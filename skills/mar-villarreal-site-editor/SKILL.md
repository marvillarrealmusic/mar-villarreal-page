---
name: mar-villarreal-site-editor
description: Edit Mar Villarreal’s website text, links, or images in its GitHub repository, following the project READMEs and committing and pushing the requested changes.
---

# Editar la web de Mar Villarreal

Usa este flujo cuando Mar pida cambiar textos, enlaces editoriales o imágenes del sitio. La conexión de GitHub debe estar autorizada para el repositorio `Colubi/mar-villarreal-page`; esta Skill no concede acceso por sí sola.

## Antes de editar

1. Lee el `README.md` raíz y las guías aplicables a la tarea:
   - Textos, enlaces editoriales, lanzamientos o vídeos: `content/README.md`.
   - Fotografías, portadas o miniaturas: `public/images/README.md`.
   - Importación de música o vídeos: `.github/workflows/README.md` y `scripts/README.md`.
2. Revisa `git status` y la rama actual. Conserva cambios ajenos a la petición y no los incluyas en el commit.
3. Limita los cambios a lo que Mar pidió. Los textos están en `content/site.yml`; las imágenes editoriales se guardan en `public/images/`.

## Edición

- Respeta las claves, comentarios e indentación YAML. Mantén español e inglés en los campos localizados.
- No edites `releases.items` ni `videos.items` manualmente: son datos generados. Para actualizar estas secciones, sigue los pasos de las guías para editar `sources` y ejecutar la importación.
- Para sustituir una imagen, conserva el nombre y la extensión salvo que Mar pida otra ruta; actualiza `content/site.yml` y el texto alternativo si corresponde.
- No cambies componentes, dependencias, configuración, DNS, alojamiento ni otros contenidos si no son necesarios para la petición.

## Verificación, commit y push

1. Ejecuta las comprobaciones indicadas en los README aplicables. Como mínimo, para cambios de contenido ejecuta `npm run validate:content`; si se cambian rutas de imagen, comprueba que los archivos existen y que sus rutas son correctas.
2. Revisa el diff para confirmar que solo contiene los cambios solicitados y que no incluye secretos, artefactos generados ni cambios previos de otras personas.
3. Cuando la petición de Mar requiera una edición, termina el trabajo creando un commit descriptivo y haciendo push de ese commit. La petición de edición autoriza ese commit y push; no vuelvas a pedir autorización.
4. Respeta la rama activa, las protecciones de GitHub y el flujo descrito en los README. Si el repositorio exige una rama o pull request, crea y sube la rama y deja preparada la pull request en lugar de saltarte la protección. No fuerces pushes ni sobrescribas commits.
5. Si permisos, autenticación o protección de rama impiden completar el push, conserva el commit local, no intentes evadir el bloqueo y explica qué acceso o paso falta.
6. Informa a Mar qué cambió, qué verificaciones pasaron y si el push completó. No afirmes que el sitio ya está publicado: la publicación depende de que el hosting conectado compile el cambio.
