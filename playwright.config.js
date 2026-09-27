const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.js",
  use: { baseURL: "http://127.0.0.1:4173", browserName: "chromium" },
  webServer: { command: "npm run preview", cwd: process.env.E2E_FIXTURE_DIR || process.cwd(), url: "http://127.0.0.1:4173", reuseExistingServer: false, timeout: 30_000 },
});
