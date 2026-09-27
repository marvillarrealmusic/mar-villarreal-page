# Actualizar música y vídeos desde GitHub

## Ejecución automática

```text
Editar content/site.yml → guardar en master → importar y comprobar → commit generado → nueva compilación del alojamiento
```

1. En `content/site.yml`, pega enlaces en `releases.sources` o `videos.sources`.
2. Guarda el cambio en `master`. Si usas una rama, incorpórala mediante una pull request.
3. Abre **Actions → Sync Spotify and YouTube** y espera a que termine.
4. Revisa el resumen: incluye el número de elementos y los títulos importados. Si cambiaron datos, aparecerá un commit de `github-actions[bot]`.

## Ejecutar manualmente

```text
GitHub → Actions → Sync Spotify and YouTube → Run workflow → Branch: master → Run workflow
```

No hay ejecución programada ni búsqueda automática de novedades. La Action importa exclusivamente los enlaces del YAML. Puedes tener más de tres sencillos configurados: la web muestra los tres más recientes. YouTube muestra todos los vídeos en el orden de sus enlaces.

## Permisos y comprobaciones

El workflow usa Node 22 y el `GITHUB_TOKEN` temporal de Actions con permiso `contents: write`. No configures credenciales de Spotify, YouTube ni un token personal. GitHub Actions debe estar habilitado; las políticas de la organización o del repositorio no deben impedir estos permisos.

Antes de guardar se ejecutan validación, lint, pruebas de Node, compilación estática y pruebas de navegador. Las ejecuciones se serializan. Si alguien cambia `master` mientras se importa, se cancela el guardado: vuelve a ejecutarla. Nunca se fuerza un push.

Una rama protegida puede rechazar el commit del bot. En ese caso, un administrador debe configurar en las reglas del repositorio un actor con autorización de escritura/bypass que sea compatible con la política de la organización. El token de Actions no garantiza bypass de protección. Si la política no permite este flujo, importa localmente con `npm run sync:content` y entrega los cambios mediante una pull request. No desactives las protecciones como parte de esta tarea.

Los commits realizados con `GITHUB_TOKEN` no vuelven a disparar los workflows normales de push; por eso esta Action hace las comprobaciones antes de guardar. No crea pull requests ni publica la web. El alojamiento conectado debe reconstruir `out/` después del commit; su proveedor todavía no está identificado.

## Resolver errores

| Mensaje o situación | Qué hacer |
| --- | --- |
| Enlace inválido o duplicado | Usa enlaces de canciones/álbumes de Spotify o vídeos de YouTube; elimina repeticiones. |
| No se confirma la autoría | Comprueba que el enlace de Spotify pertenece a Mar. |
| Falta fecha exacta, título o imagen | Comprueba la página pública; no se inventan metadatos. |
| HTTP 404 o vídeo privado | Reemplaza el enlace o haz público el vídeo. |
| Error de red, bloqueo o HTTP 429 | Espera y ejecuta de nuevo. Si persiste, la plataforma puede haber cambiado sus páginas. |
| Error YAML | Conserva la indentación y no repitas claves; revisa el campo indicado. |
| Push rechazado | Comprueba permisos de Actions y protección de `master`. |
| Sin cambios | La selección ya estaba actualizada; no se genera otro commit. |

Si falla la importación, no se guarda una selección parcial ni se vacían las tarjetas existentes. Los títulos y miniaturas de YouTube se obtienen mediante oEmbed público. Las fechas y autoría de Spotify se leen de sus páginas públicas: estos formatos pueden cambiar y requerir mantenimiento del importador.
