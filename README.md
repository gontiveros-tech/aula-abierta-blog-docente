# Aula Abierta — integración visual y funcional de Stitch

Contiene las **10 pantallas originales** de Stitch, conservadas, y un módulo operativo superpuesto de gestión de artículos, comentarios e imágenes.

## Ejecutar

Publicar la carpeta raíz en Netlify o iniciar un servidor HTTP local (por ejemplo `python -m http.server 8000`). Abrir `index.html`.

## Flujo

1. `editor.html`: crear un artículo, escribir contenido, seleccionar **Publicado** y guardar.
2. `gestion.html`: comprobar persistencia, editar, despublicar o eliminar.
3. `publicaciones.html`: ver el artículo publicado.
4. `lectura.html`: abrir el artículo y enviar un comentario.
5. `moderacion.html`: aprobarlo.
6. Recargar `lectura.html` y comprobar que aparece.

## Advertencias

- **No es una aplicación multiusuario**: IndexedDB es almacenamiento local por navegador.
- **No hay autenticación**: las pantallas administrativas son públicas y solo demostrativas.
- Los textos, botones y tarjetas estáticas originales de Stitch siguen siendo maqueta. El bloque marcado como **funcional** contiene los controles conectados a IndexedDB.
- Imágenes limitadas a 1 MB; pueden agotarse las cuotas de almacenamiento.
- Para producción hacen falta backend compartido, autenticación, autorización, políticas de seguridad, controles de medios y pruebas de navegador.
- No afirmar pruebas de navegador ni despliegue si no se han ejecutado.