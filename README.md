# Aula Abierta — Blog Docente

## Estado actual

**Prototipo funcional mínimo**, preparado para alojarse como sitio estático. Contiene portada, blog, administración demostrativa y persistencia mediante IndexedDB.

### Archivos
- `index.html`: portada.
- `blog.html`: listado, lectura y comentarios.
- `admin.html`: creación, edición, publicación, eliminación y moderación.
- `js/db.js`: persistencia IndexedDB.
- `js/admin.js` y `js/blog.js`: lógica de interacción.
- `netlify.toml`: publicación estática en Netlify.

## Limitaciones importantes

- **No es un blog multiusuario:** IndexedDB guarda datos por navegador y origen; otros visitantes no ven los artículos creados por el docente.
- **Sin autenticación:** la administración es pública y solo demostrativa.
- No incorpora aún las diez pantallas visuales completas generadas originalmente por Stitch. Esta subida inicial prioriza el recorrido funcional mínimo; el ZIP original se conserva como referencia para la integración visual.
- No se han realizado pruebas de navegador ni despliegue público.

## Próximos pasos

1. Publicar el repositorio en un servicio de alojamiento estático.
2. Verificar creación, edición, publicación y moderación en un navegador real.
3. Integrar las pantallas visuales de Stitch.
4. Implementar autenticación y almacenamiento compartido (por ejemplo, Supabase) antes de considerarlo un blog real.

**Experimento educativo:** evaluación de la transición de diseño generado con Stitch a software desplegable y verificable.
