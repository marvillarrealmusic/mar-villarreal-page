# Imágenes de la web

Cada archivo tiene una función concreta. Puedes reemplazar las fotografías editoriales subiendo otra con el **mismo nombre y extensión**. Las portadas musicales y miniaturas de vídeos se descargan automáticamente desde los enlaces configurados en `content/site.yml`.

| Archivo | Sección | Para qué se usa |
| --- | --- | --- |
| `hero.jpg` | Portada | Fotografía principal que acompaña el título de Mar. Se muestra en formato vertical. |
| `logo-mar.png` | Cabecera | Logo de Mar que sustituye al nombre escrito cuando se configura `site.logo` en el YAML. Conserva el logo completo; se adapta al espacio disponible en móvil y escritorio. |
| `biography.jpg` | Biografía | Fotografía junto al texto biográfico. También se muestra en formato vertical. |
| `portfolio/nerea.jpg` | Mar Villarreal Producción | Diseño del perfil de Instagram de Nerea, extraído del portfolio de Canva de Mar y optimizado en JPEG para la web. |
| `portfolio/alexia-yoga.jpg` | Mar Villarreal Producción | Collage horizontal sin texto para Alexia Yoga, creado con las fotos, el símbolo y la paleta de su proyecto de marca. |
| `releases/5iw3dCleo3lcYovu6GAOZB.jpg` | Últimos lanzamientos | Portada de AMAR. Generada por la importación. |
| `releases/1B9WOBwcZYPALYEQ2ZAgh6.jpg` | Últimos lanzamientos | Portada de Rosa Pastel. Generada por la importación. |
| `releases/4IQLfJMwO94ATJlDU2HFy0.jpg` | Últimos lanzamientos | Portada de Rincón Florido. Generada por la importación. |
| `videos/<ID-del-vídeo>.jpg` | Vídeos | Miniatura descargada de YouTube; no hay miniaturas hasta configurar vídeos. La extensión depende de la imagen recibida. |
| `social-preview.jpg` | Vista previa al compartir | Imagen que aparece en tarjetas de redes sociales y aplicaciones de mensajería cuando se comparte la web. No aparece dentro de las secciones de la página. |

## Reemplazar una imagen

1. Abre este directorio en GitHub y entra en la carpeta correspondiente.
2. Pulsa **Add file → Upload files** para subir la imagen nueva.
3. Para reemplazar una imagen existente, conserva su nombre y extensión. Si GitHub pregunta si quieres reemplazar el archivo, confirma el cambio.
4. Guarda los cambios. La web se actualizará al volver a compilarse y publicarse.

También puedes subir una imagen con otro nombre y cambiar la ruta en `content/site.yml`. Las rutas empiezan por `/images/`; por ejemplo, el archivo `public/images/biography.jpg` se referencia como `/images/biography.jpg`.

## Imágenes del portfolio de producción

Los proyectos de `services.portfolio.items` utilizan imágenes locales de `portfolio/`. Se muestran completas dentro de un espacio 3:2, sin recortarlas. Para sustituirlas, sube el nuevo archivo con el mismo nombre o cambia `image.src` y los textos alternativos en `content/site.yml`. No se sincronizan automáticamente con Canva.

Fuentes de las imágenes iniciales, verificadas en el [portfolio de Mar](https://marvillarreal.my.canva.site/):

- Nerea: `https://marvillarreal.my.canva.site/_assets/media/187bd212bfb941ae7650087d09f6af24.png`.
- Alexia Yoga: composición visual creada a partir de la página del proyecto en el [portfolio de Mar](https://marvillarreal.my.canva.site/), usando sus fotos de yoga y bienestar, símbolo y paleta.

## Portadas y miniaturas automáticas

Para añadir música o vídeos, pega enlaces en `releases.sources` o `videos.sources`; no hace falta subir sus imágenes ni escribir títulos y fechas. La Action descarga los archivos a `releases/` y `videos/`, usando el identificador de Spotify o YouTube como nombre. [Guía paso a paso](../../content/README.md).

No reemplaces manualmente estas imágenes: la siguiente importación recuperará las originales de la plataforma. Las portadas se muestran cuadradas y las miniaturas de YouTube en formato 16:9. Los archivos antiguos pueden conservarse sin aparecer en la web; el YAML decide qué imágenes se usan.

Se admiten imágenes JPG, JPEG, PNG, WebP y AVIF. Mantén las fotografías de portada con proporción vertical y las carátulas musicales cuadradas para que se vean correctamente en móvil y escritorio.
