# Editar el contenido de la web

Los textos y enlaces están en [`site.yml`](./site.yml). No es necesario abrir archivos de código.

## Cambiar textos

1. En GitHub, abre `content/site.yml` y pulsa el icono del lápiz.
2. Busca una sección como `hero`, `biography` o `services`.
3. Cambia el texto bajo `es:` y `en:`. Conserva los nombres de campo y espacios.
4. Pulsa **Commit changes**. Si el repositorio pide una revisión, crea la propuesta de cambio.

Para una descripción con varios párrafos, usa este formato:

```yaml
  description:
    es: |
      Primer párrafo en español.

      Segundo párrafo en español.
    en: |
      First paragraph in English.

      Second paragraph in English.
```

Las claves se escriben una sola vez; sus traducciones siempre llevan `es` y `en`. No borres los comentarios que explican las secciones.

## Cambiar fotografías

En GitHub, abre la carpeta `public/images/` y usa **Add file → Upload files**. Las imágenes pueden ser JPG, PNG, WebP o AVIF. Utiliza fotos con licencia para la web y comprime las imágenes grandes antes de subirlas.

Para reemplazar una foto manteniendo su nombre, sube la nueva con el mismo nombre y reemplaza el archivo. Para usar otro nombre, cambia la ruta `src` de la imagen correspondiente en `content/site.yml`. Las fotografías de portada y biografía tienen textos alternativos en los dos idiomas: actualízalos cuando haga falta.

## Logo de la cabecera

Guarda el logo original en `public/images/logo-mar.png` y añade este bloque dentro de `site` en `content/site.yml`:

```yaml
  logo:
    src: /images/logo-mar.png
    alt:
      es: Logo de Mar Villarreal
      en: Mar Villarreal logo
```

El logo sustituye al nombre de la cabecera y enlaza al inicio. Puedes reemplazar el archivo manteniendo su nombre o cambiar `src` para usar otra imagen. Si no se configura `site.logo`, se muestra `site.name`.

## Añadir un sencillo

1. En Spotify, usa **Compartir → Copiar enlace** en una canción o sencillo.
2. En GitHub, abre `content/site.yml`, pulsa el lápiz y busca `releases.sources`.
3. Pega el enlace en una línea nueva, conservando los espacios y el guion:

```yaml
  sources:
    - https://open.spotify.com/album/5iw3dCleo3lcYovu6GAOZB
    - https://open.spotify.com/album/1B9WOBwcZYPALYEQ2ZAgh6
    - https://open.spotify.com/album/4IQLfJMwO94ATJlDU2HFy0
```

4. Guarda con **Commit changes**. En `master`, la Action **Sync Spotify and YouTube** obtiene las fechas y títulos, descarga las portadas y guarda otro commit con los resultados.

Se aceptan enlaces de canciones (`track`) y sencillos publicados como álbum (`album`), también con parámetros de compartir. La canción se resuelve a su álbum: añadir ambos enlaces no duplica la tarjeta. El lanzamiento debe pertenecer a Mar Villarreal y tener una fecha exacta ya publicada.

Solo se muestran los tres más recientes por fecha. Para quitar uno, elimina su enlace de `sources`. Para vaciar la selección, usa `sources: []`. No edites `releases.items`: la Action lo genera y sobrescribe en cada importación.

## Añadir y ordenar vídeos

En YouTube, copia el enlace del vídeo. En el bloque `videos` del YAML, sustituye `sources: []` por una lista. Puedes copiar enlaces completos de `watch`, enlaces cortos `youtu.be`, Shorts o directos `live`. Usa vídeos públicos con inserción permitida; los privados o eliminados no se pueden importar.

```yaml
  # Ejemplo de sintaxis: sustituye estos enlaces por vídeos que quieras mostrar.
  sources:
    - https://www.youtube.com/watch?v=M7lc1UVf-VE
    - https://youtu.be/dQw4w9WgXcQ
```

La Action obtiene los títulos y miniaturas automáticamente. Se muestran todos los enlaces en el orden del YAML: mueve una línea para ordenar las tarjetas y bórrala para quitar el vídeo. No añadas el mismo vídeo dos veces, aunque uses distintos formatos de enlace. Usa `sources: []` para dejar la sección vacía. No edites `videos.items` ni las miniaturas generadas.

El visitante pulsa la miniatura para reproducir el vídeo en la web. Si el autor restringe la inserción, siempre puede usar **Ver en YouTube**. Solo se mantiene un reproductor activo. Los títulos originales de los vídeos no se traducen.

## Textos editables de música y vídeos

| Bloque | Campos que puedes editar en ambos idiomas |
| --- | --- |
| `releases` | `eyebrow`, `title`, `description`, `listenLabel`, `allMusicLabel`, `emptyMessage` |
| Reproductores de Spotify | `latestPlayerHeading`, `popularPlayerHeading`, `playerTitle`, `popularPlayerTitle` |
| `videos` | `eyebrow`, `title`, `description`, `playLabel`, `watchLabel`, `emptyMessage` |
| `navigation` | `releases` y `videos`, las etiquetas del menú |

El segundo reproductor usa el perfil `site.spotifyArtistUrl`; Spotify controla qué canciones muestra. Consulta [la guía de Actions](../.github/workflows/README.md) si necesitas ejecutar la importación manualmente o resolver un fallo.

## Servicios y portfolio de producción

En `services` puedes editar el título, la presentación y los tres servicios en ambos idiomas. `contactLabel` cambia el enlace a la sección de contacto.

El bloque `services.portfolio` contiene el enlace de Canva (`url`), el texto del botón (`label`), el título de proyectos (`title`) y la lista `items`. Los proyectos se muestran en el orden del YAML. Para ordenarlos, mueve un bloque completo; para eliminar uno, borra ese bloque. Puedes dejar `items: []` para mostrar solo los servicios y los enlaces.

Ejemplo de un proyecto; copia el bloque entero para añadir otro:

```yaml
      - name: Nombre del proyecto
        description:
          es: Descripción breve del trabajo realizado.
          en: A short description of the work completed.
        image:
          src: /images/portfolio/proyecto.jpg
          alt:
            es: Descripción de la imagen del proyecto
            en: Description of the project image
          position: center
```

Sube las imágenes a `public/images/portfolio/` y usa su ruta `/images/portfolio/...`. Puedes reemplazarlas manteniendo el nombre o actualizar `image.src`. Se muestran completas en un espacio 3:2. Estos archivos se editan manualmente y no los sobrescribe la importación de música y vídeos.

`services.instagram.url` enlaza al perfil de producción y `label` controla su etiqueta bilingüe. Este enlace es independiente del Instagram musical de `social.items`. Los enlaces externos deben empezar por `https://` y se abren en otra pestaña. La web no incrusta Canva ni carga un feed de Instagram; cuando actualices el Canva, cambia también aquí cualquier imagen o texto que deba reflejarlo.

## Errores y publicación

La compilación explica qué sección hay que corregir si falta una traducción, una imagen o un enlace válido. Si falla una importación, se conserva la última selección generada: corregir los enlaces y volver a ejecutar la Action no borra la versión anterior.

Al guardar cambios en GitHub, la web se actualiza cuando el servicio de alojamiento conectado vuelve a compilar `out/`. El proveedor aún no está confirmado. Si trabajas en una rama, abre una pull request; la sincronización se ejecuta después de incorporarla a `master`. Si esta rama está protegida, consulta la guía de Actions para permitir el commit generado.
