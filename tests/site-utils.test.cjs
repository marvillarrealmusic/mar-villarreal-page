const test = require("node:test");
const assert = require("node:assert/strict");
const { text, getLatestReleases, parseSpotifyUrl, getSpotifyEmbedUrl, formatReleaseDate } = require("../src/lib/site-utils.cjs");

test("selecciona traducciones y conserva respaldo", () => {
  assert.equal(text({ es: "Hola", en: "Hello" }, "en"), "Hello");
  assert.equal(text({ es: "Hola" }, "en"), "Hola");
});

test("ordena lanzamientos sin mutar la entrada, limita y conserva empates", () => {
  const items = [{ title: "A", releaseDate: "2026-01-01" }, { title: "B", releaseDate: "2026-02-01" }, { title: "C", releaseDate: "2026-02-01" }];
  assert.deepEqual(getLatestReleases(items, 2).map((item) => item.title), ["B", "C"]);
  assert.equal(items[0].title, "A");
});

test("acepta URLs Spotify regionales y construye un reproductor sin parámetros", () => {
  const url = "https://open.spotify.com/intl-es/album/abc123?si=tracking";
  assert.deepEqual(parseSpotifyUrl(url), { type: "album", id: "abc123" });
  assert.equal(getSpotifyEmbedUrl(url), "https://open.spotify.com/embed/album/abc123");
  assert.throws(() => parseSpotifyUrl("https://open.spotify.com/artist/abc123"));
});

test("formatea una fecha con zona UTC en español e inglés", () => {
  assert.equal(formatReleaseDate("2026-05-15", "es"), "15 de mayo de 2026");
  assert.equal(formatReleaseDate("2026-05-15", "en"), "15 May 2026");
});
