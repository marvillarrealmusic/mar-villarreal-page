const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const YAML = require("yaml");
const cheerio = require("cheerio");
const { validateContent } = require("../src/lib/content.server.cjs");
const { parseSpotifyUrl, parseYouTubeUrl, getSpotifyArtistEmbedUrl, getLatestReleases } = require("../src/lib/site-utils.cjs");

const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

async function request(url, fetchImpl = fetch) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try {
      response = await fetchImpl(url, { redirect: "error", signal: AbortSignal.timeout(20_000), headers: { "User-Agent": "MarVillarrealContentSync/1.0" } });
    } catch (error) { throw new Error(`No se pudo consultar ${url}: ${error.message}`); }
    if (response.ok) return response;
    if ([429, 502, 503, 504].includes(response.status) && attempt < 2) {
      await response.body?.cancel();
      const delay = Math.min(5, Math.max(1, Number(response.headers.get("retry-after")) || attempt + 1));
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      continue;
    }
    throw new Error(`No se pudo consultar ${url}: HTTP ${response.status}. Comprueba que sea público y esté disponible.`);
  }
}

async function readLimited(response, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > limit) throw new Error("La respuesta supera el tamaño permitido.");
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function downloadImage(url, folder, id, fetchImpl) {
  const parsed = new URL(url);
  const hosts = folder === "releases" ? ["i.scdn.co"] : ["i.ytimg.com", "img.youtube.com"];
  if (parsed.protocol !== "https:" || parsed.port || parsed.username || parsed.password || !hosts.includes(parsed.hostname)) throw new Error(`Portada o miniatura no permitida: ${url}`);
  const response = await request(url, fetchImpl);
  const mime = response.headers.get("content-type")?.split(";")[0].trim();
  const ext = IMAGE_TYPES[mime];
  if (!ext) throw new Error(`Formato de imagen no admitido en ${url}.`);
  const bytes = await readLimited(response, 8 * 1024 * 1024);
  const valid = (ext === "jpg" && bytes[0] === 0xff && bytes[1] === 0xd8)
    || (ext === "png" && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    || (ext === "webp" && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP")
    || (ext === "avif" && bytes.toString("ascii", 4, 8) === "ftyp" && bytes.subarray(8, 32).includes(Buffer.from("avif")));
  if (!valid) throw new Error(`La descarga no contiene una imagen válida: ${url}`);
  return { src: `/images/${folder}/${id}.${ext}`, bytes };
}

async function spotifyMetadata(url, artistId, fetchImpl, today) {
  const { type, id } = parseSpotifyUrl(url);
  const canonical = `https://open.spotify.com/${type}/${id}`;
  const response = await request(canonical, fetchImpl);
  const $ = cheerio.load((await readLimited(response, 3 * 1024 * 1024)).toString("utf8"));
  const musicians = $("meta[name='music:musician']").map((_, el) => $(el).attr("content")).get();
  if (!musicians.some((value) => { try { return getSpotifyArtistEmbedUrl(value).endsWith(`/${artistId}`); } catch { return false; } })) throw new Error(`${canonical}: no se pudo confirmar la autoría de Mar Villarreal.`);
  if (type === "track") {
    const album = $("meta[name='music:album']").attr("content");
    if (!album || parseSpotifyUrl(album).type !== "album") throw new Error(`${canonical}: falta el álbum del sencillo.`);
    return spotifyMetadata(album, artistId, fetchImpl, today);
  }
  let metadata;
  $("script[type='application/ld+json']").each((_, el) => {
    try {
      const raw = JSON.parse($(el).text());
      const entries = Array.isArray(raw) ? raw : raw["@graph"] || [raw];
      metadata = entries.find((entry) => [entry["@type"]].flat().includes("MusicAlbum")) || metadata;
    } catch { /* Unrelated or malformed JSON-LD is ignored; required fields are checked below. */ }
  });
  const title = metadata?.name?.trim();
  const releaseDate = metadata?.datePublished || $("meta[name='music:release_date']").attr("content");
  const coverUrl = $("meta[property='og:image']").attr("content");
  const date = new Date(`${releaseDate}T00:00:00Z`);
  if (!title || !coverUrl) throw new Error(`${canonical}: faltan título o portada pública.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate || "") || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== releaseDate || releaseDate > today) throw new Error(`${canonical}: la fecha debe ser exacta, válida y no futura.`);
  return { id, title, releaseDate, coverUrl, spotifyUrl: canonical };
}

async function importSpotify(sources, artistUrl, fetchImpl = fetch, today = new Date().toISOString().slice(0, 10)) {
  const artistId = getSpotifyArtistEmbedUrl(artistUrl).split("/").pop();
  const items = [];
  const files = [];
  const seen = new Set();
  for (const url of sources) {
    const metadata = await spotifyMetadata(url, artistId, fetchImpl, today);
    if (seen.has(metadata.id)) continue;
    seen.add(metadata.id);
    const image = await downloadImage(metadata.coverUrl, "releases", metadata.id, fetchImpl);
    files.push(image);
    items.push({ title: metadata.title, releaseDate: metadata.releaseDate, cover: { src: image.src, alt: { es: `Portada de ${metadata.title} de Mar Villarreal`, en: `Cover of ${metadata.title} by Mar Villarreal` }, position: "center" }, spotifyUrl: metadata.spotifyUrl });
  }
  return { items: getLatestReleases(items, items.length), files };
}

async function importYouTube(sources, fetchImpl = fetch) {
  const items = [];
  const files = [];
  const seen = new Set();
  for (const value of sources) {
    const { id, url } = parseYouTubeUrl(value);
    if (seen.has(id)) throw new Error(`Vídeo duplicado: ${url}`);
    seen.add(id);
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await request(endpoint, fetchImpl);
    let metadata;
    try { metadata = JSON.parse((await readLimited(response, 256 * 1024)).toString("utf8")); } catch { throw new Error(`${url}: YouTube no devolvió metadatos válidos.`); }
    if (typeof metadata.title !== "string" || !metadata.title.trim() || !metadata.thumbnail_url) throw new Error(`${url}: faltan título o miniatura pública.`);
    const title = metadata.title.trim();
    const image = await downloadImage(metadata.thumbnail_url, "videos", id, fetchImpl);
    files.push(image);
    items.push({ title, youtubeUrl: url, thumbnail: { src: image.src, alt: { es: `Miniatura del vídeo ${title}`, en: `Thumbnail of the video ${title}` }, position: "center" } });
  }
  return { items, files };
}

async function prepareSync(source, publicDirectory, fetchImpl = fetch) {
  const document = YAML.parseDocument(source, { uniqueKeys: true, prettyErrors: true });
  if (document.errors.length) throw new Error(`Contenido YAML inválido: ${document.errors.map((error) => error.message).join("; ")}`);
  const content = validateContent(document.toJS(), publicDirectory);
  const spotify = await importSpotify(content.releases.sources, content.site.spotifyArtistUrl, fetchImpl);
  const youtube = await importYouTube(content.videos.sources, fetchImpl);
  for (const [section, items] of [["releases", spotify.items], ["videos", youtube.items]]) {
    const previous = document.getIn([section, "items"], true);
    const node = document.createNode(items);
    node.commentBefore = previous?.commentBefore;
    node.comment = previous?.comment;
    document.setIn([section, "items"], node);
  }
  return { source: document.toString(), content: document.toJS(), files: [...spotify.files, ...youtube.files] };
}

async function existing(filename) {
  try { return await fs.readFile(filename); } catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

async function syncMedia(root = process.cwd(), { fetchImpl = fetch, check = false } = {}) {
  const filename = path.join(root, "content/site.yml");
  const source = await fs.readFile(filename, "utf8");
  const publicDirectory = path.join(root, "public");
  const prepared = await prepareSync(source, publicDirectory, fetchImpl);
  const stage = await fs.mkdtemp(path.join(os.tmpdir(), "mar-media-"));
  try {
    await fs.cp(path.join(publicDirectory, "images"), path.join(stage, "images"), { recursive: true });
    for (const file of prepared.files) {
      const staged = path.join(stage, file.src.slice(1));
      await fs.mkdir(path.dirname(staged), { recursive: true });
      await fs.writeFile(staged, file.bytes);
    }
    validateContent(prepared.content, stage);
  } finally { await fs.rm(stage, { recursive: true, force: true }); }
  const writes = [...prepared.files.map((file) => ({ filename: path.join(publicDirectory, file.src.slice(1)), bytes: file.bytes })), { filename, bytes: Buffer.from(prepared.source) }];
  const changed = [];
  for (const write of writes) {
    const before = await existing(write.filename);
    if (!before?.equals(write.bytes)) changed.push({ ...write, before });
  }
  if (!check) {
    // Network calls and validation are finished. Roll back local writes on a filesystem error.
    if (await fs.readFile(filename, "utf8") !== source) throw new Error("El YAML cambió durante la importación. Ejecuta de nuevo sin sobrescribir el cambio.");
    const applied = [];
    try {
      for (const write of changed) {
        applied.push(write);
        await fs.mkdir(path.dirname(write.filename), { recursive: true });
        await fs.writeFile(write.filename, write.bytes);
      }
    } catch (error) {
      for (const write of applied.reverse()) {
        if (write.before) await fs.writeFile(write.filename, write.before);
        else await fs.rm(write.filename, { force: true });
      }
      throw error;
    }
  }
  const summary = `${prepared.content.releases.items.length} lanzamientos y ${prepared.content.videos.items.length} vídeos verificados. ${check ? "Comprobación sin escritura." : `${changed.length} archivos actualizados.`}`;
  return { summary, content: prepared.content, changed: changed.length };
}

if (require.main === module) {
  syncMedia(process.cwd(), { check: process.argv.includes("--check") }).then(async ({ summary, content }) => {
    console.log(summary);
    if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `## Sincronización de contenido\n\n${summary}\n\n${content.releases.items.map((item) => `- ${item.title} (${item.releaseDate})`).concat(content.videos.items.map((item) => `- ${item.title}`)).join("\n")}\n`);
  }).catch((error) => { console.error(`Sincronización cancelada; se conserva el contenido anterior.\n${error.message}`); process.exitCode = 1; });
}

module.exports = { importSpotify, importYouTube, prepareSync, syncMedia };
