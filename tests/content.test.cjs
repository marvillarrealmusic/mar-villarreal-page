const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadContent, validateContent } = require("../src/lib/content.server.cjs");
const { schema } = require("../src/lib/content-schema.cjs");

const root = path.join(__dirname, "..");

test("el contenido real pasa validación y mantiene los dos idiomas", () => {
  const content = loadContent();
  assert.equal(content.hero.title.es, "Mar Villarreal");
  assert.ok(content.hero.title.en);
  assert.ok(content.releases.items.length > 0);
  assert.ok(Array.isArray(content.videos.sources));
});

test("valida enlaces y miniaturas de vídeos y rechaza duplicados", () => {
  const data = loadContent();
  data.videos.sources = ["https://youtu.be/M7lc1UVf-VE", "https://www.youtube.com/watch?v=M7lc1UVf-VE"];
  assert.throws(() => validateContent(data), /videos.sources.1/);
  data.videos.sources = ["https://example.com/watch?v=M7lc1UVf-VE"];
  assert.throws(() => validateContent(data), /videos.sources.0/);
  data.videos.sources = [];
  data.videos.items = [{ title: "Vídeo", youtubeUrl: "https://youtu.be/M7lc1UVf-VE", thumbnail: { src: "/images/missing.jpg", alt: { es: "Vídeo", en: "Video" } } }];
  assert.throws(() => validateContent(data), /videos.items.0.thumbnail/);
});

test("schema rechaza idiomas ausentes y campos desconocidos", () => {
  assert.equal(schema.safeParse({ es: "Hola" }).success, false);
  assert.equal(schema.safeParse({ es: "Hola", en: "Hello", enn: "typo" }).success, false);
});

test("portfolio valida enlaces HTTPS, traducciones e imágenes locales", () => {
  const data = loadContent();
  data.services.portfolio.url = "http://example.com/";
  data.services.instagram.url = "http://instagram.com/";
  data.services.portfolio.items[0].image.src = "/images/portfolio/missing.png";
  assert.throws(() => validateContent(data), (error) => {
    assert.match(error.message, /services.portfolio.url/);
    assert.match(error.message, /services.instagram.url/);
    assert.match(error.message, /services.portfolio.items.0.image/);
    return true;
  });
  const untranslated = loadContent();
  delete untranslated.services.portfolio.items[0].description.en;
  assert.throws(() => validateContent(untranslated), /services.portfolio.items.0.description.en/);
});

test("rechaza rutas de imágenes que escapan de la carpeta pública", () => {
 const data = loadContent();
 data.seo.image = "/images/../../secret.jpg";
 assert.throws(() => validateContent(data, path.join(root, "public")), /Contenido inválido/);
});

test("rechaza carátulas ausentes, fechas imposibles y URLs de perfil en lanzamientos", () => {
  const data = loadContent();
  data.releases.items[0].cover.src = "/images/releases/missing.jpg";
  data.releases.items[0].releaseDate = "2026-02-30";
  data.releases.items[0].spotifyUrl = data.site.spotifyArtistUrl;
  assert.throws(() => validateContent(data), /releases\.items\.0/);
});
