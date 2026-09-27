# Web de Mar Villarreal

Página responsive de una sola página. El contenido editorial bilingüe se mantiene en `content/site.yml`; las imágenes se sirven desde `public/images/`.

## Requisitos

- Node.js 22.
- npm.
- No hacen falta credenciales de CMS, Spotify o YouTube. Los reproductores se incrustan con URLs públicas; la importación consulta metadatos públicos.

## Desarrollo local

```sh
npm ci
npm run dev
```

Visita `http://localhost:3000`. Para cambiar contenido, consulta [la guía de edición](content/README.md).

La sección «Mar Villarreal Producción» muestra servicios y proyectos desde `services` en el YAML. Sus imágenes son locales; los enlaces al portfolio de Canva y al Instagram de producción no necesitan credenciales ni consultas durante la compilación.

## Sincronizar música y vídeos

Pega enlaces en `releases.sources` y `videos.sources` dentro del YAML. La Action **Sync Spotify and YouTube** se ejecuta al guardar ese archivo en `master` o mediante **Actions → Run workflow**, y guarda los resultados directamente en `master`. No necesita API keys. [Guía de automatización y permisos](.github/workflows/README.md).

También puedes importar desde tu equipo, con conexión a Internet:

```sh
npm run sync:content
# Consulta y valida sin modificar archivos:
npm run sync:content -- --check
```

El comando genera `releases.items`, `videos.items` y las imágenes locales. Nunca modifica las listas de enlaces ni el contenido editorial. Si falta una fecha exacta, no coincide la autoría en Spotify o falla alguna descarga, no guarda cambios parciales. La compilación normal no consulta servicios externos. [Detalles del importador](scripts/README.md).

## Comprobaciones y salida estática

```sh
npm run validate:content
npm run lint
npm test
npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

`npm run build` comprueba el YAML automáticamente y crea `out/`, listo para servir como sitio estático. `npm run preview` sirve esa carpeta en `http://localhost:4173`.

Las pruebas de navegador compilan una copia aislada en `.cache/browser-fixture` con dos vídeos de prueba para comprobar reproducción y títulos largos incluso cuando la selección editorial está vacía. No modifican el YAML real ni `out/`. Bloquean los reproductores externos y guardan capturas a 360, 768, 1024 y 1440 px en `test-results/`.

## Publicación

El repositorio todavía no identifica su proveedor de alojamiento. En un hosting estático, configura Node.js 22, instalación `npm ci`, compilación `npm run build` y carpeta de publicación `out`. Conéctalo a GitHub para reconstruir el sitio después de aceptar los cambios.
