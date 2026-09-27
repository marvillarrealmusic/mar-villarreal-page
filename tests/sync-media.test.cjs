const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const YAML = require("yaml");
const { importSpotify, importYouTube, syncMedia } = require("../scripts/sync-media.cjs");
const { parseYouTubeUrl, getSpotifyArtistEmbedUrl } = require("../src/lib/site-utils.cjs");
const artist = "https://open.spotify.com/artist/5Yq88YEjyRPaYnOumCq34g";
const album = "https://open.spotify.com/album/1B9WOBwcZYPALYEQ2ZAgh6";
const track = "https://open.spotify.com/track/6y9z88UNqJa9wwNEgvXsN5";
const video = "https://youtu.be/M7lc1UVf-VE";
const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

async function mockFetch(albumTransform = (html) => html, videoStatus = 200) {
  const albumHtml = albumTransform(await fs.readFile(path.join(__dirname, "fixtures/spotify-album.html"), "utf8"));
  const trackHtml = await fs.readFile(path.join(__dirname, "fixtures/spotify-track.html"), "utf8");
  const youtube = await fs.readFile(path.join(__dirname, "fixtures/youtube-oembed.json"), "utf8");
  return async (url) => {
    if (url === album) return new Response(albumHtml);
    if (url === track) return new Response(trackHtml);
    if (url.startsWith("https://www.youtube.com/oembed?")) return new Response(youtube, { status: videoStatus });
    if (url.startsWith("https://i.scdn.co/") || url.startsWith("https://i.ytimg.com/")) return new Response(jpg, { headers: { "content-type": "image/jpeg" } });
    throw new Error(`URL inesperada: ${url}`);
  };
}

test("normaliza URLs YouTube y construye el embed del artista", () => {
  for (const url of [video, "https://www.youtube.com/watch?v=M7lc1UVf-VE&feature=share", "https://youtube.com/shorts/M7lc1UVf-VE", "https://youtube.com/live/M7lc1UVf-VE"]) assert.deepEqual(parseYouTubeUrl(url), { id: "M7lc1UVf-VE", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE" });
  for (const url of ["https://youtube.com.evil.test/watch?v=M7lc1UVf-VE", "http://youtu.be/M7lc1UVf-VE", "https://youtube.com/playlist?list=abc", "https://youtu.be/short", "https://user@youtu.be/M7lc1UVf-VE"]) assert.throws(() => parseYouTubeUrl(url));
  assert.equal(getSpotifyArtistEmbedUrl(artist), "https://open.spotify.com/embed/artist/5Yq88YEjyRPaYnOumCq34g");
});

test("importa Spotify regional y deduplica canción y álbum", async () => {
  const result = await importSpotify([track, `${album.replace("/album/", "/intl-es/album/")}?si=tracking`], artist, await mockFetch(), "2026-09-27");
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].title, "Rosa Pastel");
  assert.equal(result.items[0].releaseDate, "2026-05-15");
  assert.equal(result.items[0].spotifyUrl, album);
  assert.equal(result.files.length, 1);
});

test("rechaza fechas incompletas, imposibles y futuras y autoría incorrecta", async () => {
  for (const date of ["2026", "2026-02-30", "2099-01-01"]) await assert.rejects(importSpotify([album], artist, await mockFetch((html) => html.replaceAll("2026-05-15", date)), "2026-09-27"), /fecha/);
  await assert.rejects(importSpotify([album], artist, await mockFetch((html) => html.replace("5Yq88YEjyRPaYnOumCq34g", "otroArtista"))), /autoría/);
  await assert.rejects(importSpotify([album], artist, async () => { throw new Error("Sin red"); }), /Sin red/);
});

test("YouTube importa título y miniatura y rechaza duplicados y vídeos privados", async () => {
  const result = await importYouTube([video], await mockFetch());
  assert.equal(result.items[0].youtubeUrl, "https://www.youtube.com/watch?v=M7lc1UVf-VE");
  assert.equal(result.items[0].thumbnail.src, "/images/videos/M7lc1UVf-VE.jpg");
  await assert.rejects(importYouTube([video, video], await mockFetch()), /duplicado/);
  await assert.rejects(importYouTube([video], await mockFetch(undefined, 404)), /HTTP 404/);
});

test("no admite páginas HTML como imágenes ni miniaturas fuera de YouTube", async () => {
  const fetchImpl = await mockFetch();
  await assert.rejects(importSpotify([album], artist, async (url) => url.startsWith("https://i.scdn.co") ? new Response("<html>blocked</html>", { headers: { "content-type": "image/jpeg" } }) : fetchImpl(url)), /imagen válida/);
  await assert.rejects(importYouTube([video], async (url) => url.includes("/oembed?") ? new Response(JSON.stringify({ title: "Vídeo", thumbnail_url: "https://example.com/private.jpg" })) : fetchImpl(url)), /no permitida/);
});

async function fixtureRoot(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "mar-sync-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.cp(path.join(__dirname, "../public/images"), path.join(root, "public/images"), { recursive: true });
  await fs.mkdir(path.join(root, "content"));
  const doc = YAML.parseDocument(await fs.readFile(path.join(__dirname, "../content/site.yml"), "utf8"));
  doc.setIn(["releases", "sources"], [album]);
  doc.setIn(["videos", "sources"], [video]);
  await fs.writeFile(path.join(root, "content/site.yml"), doc.toString());
  return root;
}

test("sincroniza sin perder comentarios o textos y es idempotente", async (t) => {
  const root = await fixtureRoot(t);
  const filename = path.join(root, "content/site.yml");
  const before = await fs.readFile(filename, "utf8");
  const result = await syncMedia(root, { fetchImpl: await mockFetch() });
  const after = await fs.readFile(filename, "utf8");
  assert.ok(result.changed > 0);
  assert.equal(YAML.parse(before).biography.body.en, YAML.parse(after).biography.body.en);
  assert.match(after, /Pega enlaces aquí/);
  assert.equal(YAML.parse(after).videos.items.length, 1);
  assert.equal((await syncMedia(root, { fetchImpl: await mockFetch() })).changed, 0);
});

test("un fallo de YouTube conserva YAML e imágenes sin cambios parciales", async (t) => {
  const root = await fixtureRoot(t);
  const filename = path.join(root, "content/site.yml");
  const before = await fs.readFile(filename);
  const target = path.join(root, "public/images/releases/1B9WOBwcZYPALYEQ2ZAgh6.jpg");
  const imageBefore = await fs.readFile(target).catch(() => null);
  await assert.rejects(syncMedia(root, { fetchImpl: await mockFetch(undefined, 404) }), /HTTP 404/);
  assert.deepEqual(await fs.readFile(filename), before);
  assert.deepEqual(await fs.readFile(target).catch(() => null), imageBefore);
});
