const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");
const { schema } = require("./content-schema.cjs");
const { parseSpotifyUrl, parseYouTubeUrl } = require("./site-utils.cjs");

function validateContent(rawContent, publicDirectory = path.join(process.cwd(), "public")) {
  const result = schema.safeParse(rawContent);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => {
      const key = issue.path.join(".") || "contenido";
      const message = issue.code === "invalid_type" && issue.input === undefined
        ? `falta el campo ${key}.`
        : `campo ${key}: ${issue.message}`;
      return `- ${message}`;
    });
    throw new Error(`Contenido inválido:\n${problems.join("\n")}`);
  }

  const content = result.data;
  const issues = [];
  const error = (field, message) => issues.push(`- ${field}: ${message}`);
  const httpsUrl = (value) => {
    try { const url = new URL(value); return url.protocol === "https:"; } catch { return false; }
  };
  const checkImage = (src, field) => {
    if (!src.startsWith("/images/") || src.includes("..") || src.includes("\\") || !/\.(jpe?g|png|webp|avif)$/i.test(src)) {
      error(`${field}.src`, "usa una ruta de imagen local dentro de /images/ y una extensión jpg, png, webp o avif.");
      return;
    }
    const root = path.resolve(publicDirectory, "images");
    const filepath = path.resolve(publicDirectory, `.${src}`);
    if (!filepath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
      error(`${field}.src`, `no existe public${src}.`);
    }
  };

  if (!httpsUrl(content.site.url)) error("site.url", "debe ser una URL HTTPS.");
  if (!httpsUrl(content.site.spotifyArtistUrl) || !/^https:\/\/open\.spotify\.com\/(?:intl-[a-z-]+\/)?artist\/[A-Za-z0-9]+\/?(?:\?.*)?$/.test(content.site.spotifyArtistUrl)) {
    error("site.spotifyArtistUrl", "utiliza el enlace HTTPS del perfil de artista de Spotify.");
  }
  checkImage(content.seo.image, "seo.image");
  checkImage(content.hero.image.src, "hero.image");
  checkImage(content.biography.image.src, "biography.image");
  const today = new Date().toISOString().slice(0, 10);
  const ids = new Set();
  const sources = new Set();
  content.releases.sources.forEach((url, index) => {
    try {
      const { type, id } = parseSpotifyUrl(url);
      const key = `${type}/${id}`;
      if (sources.has(key)) error(`releases.sources.${index}`, "este enlace ya está añadido.");
      sources.add(key);
    } catch { error(`releases.sources.${index}`, "utiliza un enlace de canción o álbum de Spotify."); }
  });
  content.releases.items.forEach((item, index) => {
    const field = `releases.items.${index}`;
    const date = new Date(`${item.releaseDate}T00:00:00.000Z`);
    if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== item.releaseDate || item.releaseDate > today) {
      error(`${field}.releaseDate`, "indica una fecha real en formato AAAA-MM-DD que no sea futura.");
    }
    if (!httpsUrl(item.spotifyUrl)) error(`${field}.spotifyUrl`, "debe ser un enlace HTTPS de Spotify.");
    let id;
    try { id = parseSpotifyUrl(item.spotifyUrl).id; } catch { error(`${field}.spotifyUrl`, "utiliza un enlace de canción o álbum de Spotify."); }
    if (id && ids.has(id)) error(`${field}.spotifyUrl`, "este lanzamiento ya está añadido.");
    if (id) ids.add(id);
    checkImage(item.cover.src, `${field}.cover`);
  });
  content.social.items.forEach((item, index) => {
    if (!httpsUrl(item.url)) error(`social.items.${index}.url`, "debe ser una URL HTTPS.");
  });
  for (const field of ["sources", "items"]) {
    const videoIds = new Set();
    content.videos[field].forEach((item, index) => {
      try {
        const { id } = parseYouTubeUrl(field === "sources" ? item : item.youtubeUrl);
        if (videoIds.has(id)) error(`videos.${field}.${index}`, "este vídeo ya está añadido.");
        videoIds.add(id);
      } catch { error(`videos.${field}.${index}`, "utiliza un enlace HTTPS de vídeo de YouTube."); }
      if (field === "items") checkImage(item.thumbnail.src, `videos.items.${index}.thumbnail`);
    });
  }

  if (issues.length) throw new Error(`Contenido inválido:\n${issues.join("\n")}`);
  return content;
}

function loadContent(filename = path.join(process.cwd(), "content", "site.yml"), publicDirectory = path.join(process.cwd(), "public")) {
  const source = fs.readFileSync(filename, "utf8");
  const document = YAML.parseDocument(source, { uniqueKeys: true, prettyErrors: true });
  if (document.errors.length) {
    const issues = document.errors.map((issue) => {
      const line = issue.linePos?.[0];
      const position = line ? ` (línea ${line.line}, columna ${line.col})` : "";
      return `- ${issue.message}${position}`;
    });
    throw new Error(`Contenido YAML inválido:\n${issues.join("\n")}`);
  }
  return validateContent(document.toJS(), publicDirectory);
}

module.exports = { loadContent, validateContent };
