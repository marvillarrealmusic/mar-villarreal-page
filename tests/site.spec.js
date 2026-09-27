const { test, expect } = require("@playwright/test");
const path = require("node:path");
const { loadContent } = require("../src/lib/content.server.cjs");
const { getLatestReleases, getSpotifyEmbedUrl } = require("../src/lib/site-utils.cjs");
const root = process.env.E2E_FIXTURE_DIR || path.join(__dirname, "..");
const content = loadContent(path.join(root, "content/site.yml"), path.join(root, "public"));

test.beforeEach(async ({ page }) => {
  await page.route("https://open.spotify.com/**", (route) => route.abort());
  await page.route("https://www.youtube-nocookie.com/**", (route) => route.abort());
});

test("muestra la página bilingüe, las siete secciones y enlaces de contacto", async ({ page }) => {
  await page.route("https://open.spotify.com/embed/**", (route) => route.abort());
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mar Villarreal");
  for (const id of ["home", "releases", "videos", "biography", "services", "social", "contact"]) await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("a[href^='mailto:info@marvillarreal.com']").first()).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await page.selectOption("#site-language", "en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 2 }).first()).toContainText("Latest");
  await page.reload();
  await expect(page.locator("#site-language")).toHaveValue("en");
  expect(errors).toEqual([]);
});

test("descarta un idioma local inválido y vuelve al español", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("mar-language", "fr");
    Object.defineProperty(navigator, "languages", { configurable: true, value: ["es-ES"] });
    Object.defineProperty(navigator, "language", { configurable: true, value: "es-ES" });
  });
  await page.goto("/");
  await expect(page.locator("#site-language")).toHaveValue("es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("detecta inglés desde el navegador cuando no se ha elegido idioma", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "languages", { configurable: true, value: ["en-GB", "es-ES"] });
    Object.defineProperty(navigator, "language", { configurable: true, value: "en-GB" });
  });
  await page.goto("/");
  await expect(page.locator("#site-language")).toHaveValue("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("navegación móvil abre, cierra con Escape y no desborda a ningún ancho", async ({ page }, testInfo) => {
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflowing = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflowing, `desbordamiento a ${width}px`).toBe(false);
    await page.locator("#releases").screenshot({ path: testInfo.outputPath(`releases-${width}.png`) });
    await page.locator("#videos").screenshot({ path: testInfo.outputPath(`videos-${width}.png`) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = page.locator("#menu-toggle");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator("#site-menu a[href='#videos']").click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("muestra los lanzamientos ordenados y los dos reproductores Spotify", async ({ page }) => {
  await page.goto("/");
  const releases = getLatestReleases(content.releases.items);
  await expect(page.locator("#releases article")).toHaveCount(releases.length);
  await expect(page.locator("#releases article h3")).toHaveText(releases.map((item) => item.title));
  await expect(page.locator("#releases iframe")).toHaveCount(releases.length ? 2 : 1);
  if (releases.length) await expect(page.locator("#releases iframe").first()).toHaveAttribute("src", getSpotifyEmbedUrl(releases[0].spotifyUrl));
  await expect(page.locator("#releases iframe").last()).toHaveAttribute("src", /\/embed\/artist\/5Yq88YEjyRPaYnOumCq34g$/);
  for (const image of await page.locator("#releases img").all()) await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
});

test("YouTube carga al pulsar, conserva el orden y solo tiene un reproductor activo", async ({ page }) => {
  const errors = [];
  const youtubeRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (request.url().includes("youtube-nocookie")) youtubeRequests.push(request.url()); });
  await page.goto("/");
  await expect(page.locator("#videos iframe")).toHaveCount(0);
  expect(youtubeRequests).toEqual([]);
  await expect(page.locator("#videos article h3")).toHaveText(content.videos.items.map((item) => item.title));
  const buttons = page.locator("#videos button");
  await buttons.first().click();
  await expect(page.locator("#videos iframe")).toHaveCount(1);
  await expect(page.locator("#videos iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ\?autoplay=1$/);
  await page.locator("#videos article").nth(1).getByRole("button").click();
  await expect(page.locator("#videos iframe")).toHaveCount(1);
  await expect(page.locator("#videos article").first().getByRole("button")).toBeVisible();
  await expect(page.locator("#videos iframe")).toHaveAttribute("src", /\/embed\/M7lc1UVf-VE\?autoplay=1$/);
  await expect(page.locator("#videos article a")).toHaveCount(2);
  await page.selectOption("#site-language", "en");
  await expect(page.locator("#videos article a").first()).toContainText("Watch on YouTube");
  expect(errors).toEqual([]);
});
