// Build a separate export with two videos so playback is tested even when the
// editorial list is empty. Never rewrite the real YAML or production export.
const fs = require("node:fs/promises");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const YAML = require("yaml");

async function main() {
  const root = path.resolve(__dirname, "..");
  const fixture = path.join(root, ".cache/browser-fixture");
  await fs.rm(fixture, { recursive: true, force: true });
  await fs.mkdir(fixture, { recursive: true });
  for (const item of ["pages", "src", "styles", "content", "public", "next.config.js", "package.json", "package-lock.json"]) await fs.cp(path.join(root, item), path.join(fixture, item), { recursive: true });
  const filename = path.join(fixture, "content/site.yml");
  const document = YAML.parseDocument(await fs.readFile(filename, "utf8"));
  document.setIn(["videos", "sources"], []);
  document.setIn(["videos", "items"], ["dQw4w9WgXcQ", "M7lc1UVf-VE"].map((id, index) => ({
    title: `Vídeo de prueba ${index + 1} con un título largo para verificar la lectura y navegación`,
    youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: { src: "/images/hero.jpg", alt: { es: "Miniatura de prueba", en: "Test thumbnail" }, position: "center" },
  })));
  await fs.writeFile(filename, document.toString());
  const next = require.resolve("next/dist/bin/next");
  const build = spawnSync(process.execPath, [next, "build", "--webpack"], { cwd: fixture, stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } });
  if (build.status !== 0) throw new Error("No se pudo compilar la copia de pruebas.");
  const playwright = require.resolve("@playwright/test/cli");
  const result = spawnSync(process.execPath, [playwright, "test", ...process.argv.slice(2)], { cwd: root, stdio: "inherit", env: { ...process.env, E2E_FIXTURE_DIR: fixture } });
  process.exitCode = result.status ?? 1;
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
