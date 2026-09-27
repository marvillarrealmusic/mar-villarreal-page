const { loadContent } = require("../src/lib/content.server.cjs");

try {
  loadContent();
  console.log("Contenido válido.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
