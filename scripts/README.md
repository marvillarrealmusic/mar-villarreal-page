# Importación de contenido multimedia

`npm run sync:content` lee las listas de enlaces de `content/site.yml`. `npm run sync:content -- --check` consulta las mismas fuentes y valida el resultado sin escribir archivos. Solo estos comandos necesitan red; `npm run build` usa los datos y archivos locales.

## Fuentes

- Spotify: enlaces `track` y `album` de `open.spotify.com`, con región o parámetros opcionales. Se consultan HTML público, JSON-LD y metadatos `music:musician`, `music:album`, `music:release_date` y `og:image`. Las canciones se resuelven al álbum y se deduplican por su ID. Se verifica el artista configurado en `site.spotifyArtistUrl`.
- YouTube: enlaces `watch`, `youtu.be`, `shorts` y `live`. Se consulta `https://www.youtube.com/oembed` para obtener título y miniatura. Los vídeos mantienen el orden editorial, admiten colaboraciones y no se filtran por canal.

No se usan APIs privadas, sesiones, tokens ni descubrimiento automático de catálogo. Solo se descargan imágenes de `i.scdn.co`, `i.ytimg.com` e `img.youtube.com`, mediante HTTPS y sin redirecciones. Hay límites de tamaño, comprobación del formato y tiempo máximo de consulta; se reintentan hasta tres veces los errores transitorios HTTP 429/502/503/504.

## Escritura y validación

Se preparan todos los metadatos e imágenes en memoria, se valida una copia temporal de los recursos y se conserva el YAML mediante `yaml.parseDocument()`. Solo se reemplazan `releases.items` y `videos.items`. Antes de escribir se comprueba que el YAML original no haya cambiado; un error de escritura restaura los archivos afectados. Un cierre abrupto del proceso durante la escritura puede requerir restaurar el cambio local desde Git: la Action nunca hace push antes de completar todas las comprobaciones.

Los archivos se guardan en `public/images/releases/<album-id>.<ext>` y `public/images/videos/<video-id>.<ext>`. Una ejecución idéntica no reescribe archivos ni genera un commit. No se borran automáticamente recursos antiguos.

## Pruebas

`npm test` utiliza respuestas reducidas guardadas en `tests/fixtures/`; no hace consultas a las plataformas. Comprueba normalización de enlaces, deduplicación, fechas, autoría, imágenes, conservación de comentarios e importación sin cambios parciales.

`npm run test:e2e` crea una copia aislada del proyecto en `.cache/browser-fixture` y la compila con dos vídeos de prueba. Bloquea los iframes externos y verifica selección de vídeo, enlaces, idiomas y capturas responsive sin modificar el contenido real. Se requiere Chromium de Playwright (`npx playwright install chromium`).
