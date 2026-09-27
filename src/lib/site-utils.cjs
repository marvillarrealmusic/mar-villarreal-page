function text(value, language = "es") {
  if (typeof value === "string") return value;
  return value?.[language] || value?.es || value?.en || "";
}

function getLatestReleases(items, limit = 3) {
  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.releaseDate.localeCompare(a.item.releaseDate) || a.index - b.index)
    .slice(0, limit)
    .map(({ item }) => item);
}

function parseSpotifyUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error("URL de Spotify inválida."); }
  if (url.protocol !== "https:" || url.hostname !== "open.spotify.com" || url.username || url.password || url.port) throw new Error("La URL debe pertenecer a Spotify.");
  const match = url.pathname.match(/^\/(?:intl-[a-z-]+\/)?(track|album)\/([A-Za-z0-9]+)\/?$/);
  if (!match) throw new Error("Utiliza el enlace de una canción o un álbum de Spotify.");
  const [, type, id] = match;
  return { type, id };
}

function getSpotifyEmbedUrl(value) {
  const { type, id } = parseSpotifyUrl(value);
  return `https://open.spotify.com/embed/${type}/${id}`;
}

function parseYouTubeUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error("Enlace de YouTube inválido."); }
  if (url.protocol !== "https:" || url.username || url.password || url.port) throw new Error("Utiliza un enlace HTTPS de YouTube.");
  const host = url.hostname;
  let id;
  if (host === "youtu.be" && /^\/[\w-]+\/?$/.test(url.pathname)) id = url.pathname.split("/")[1];
  else if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)) {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else id = url.pathname.match(/^\/(?:shorts|live)\/([\w-]+)\/?$/)?.[1];
  }
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error("Utiliza un enlace de vídeo de YouTube (watch, youtu.be, shorts o live).");
  return { id, url: `https://www.youtube.com/watch?v=${id}` };
}

function getSpotifyArtistEmbedUrl(value) {
  const url = new URL(value);
  const id = url.pathname.match(/^\/(?:intl-[a-z-]+\/)?artist\/([A-Za-z0-9]+)\/?$/)?.[1];
  if (url.protocol !== "https:" || url.hostname !== "open.spotify.com" || !id) throw new Error("Perfil de Spotify inválido.");
  return `https://open.spotify.com/embed/artist/${id}`;
}

function formatReleaseDate(value, language) {
  return new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-GB", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

module.exports = { text, getLatestReleases, parseSpotifyUrl, getSpotifyEmbedUrl, getSpotifyArtistEmbedUrl, parseYouTubeUrl, formatReleaseDate };
