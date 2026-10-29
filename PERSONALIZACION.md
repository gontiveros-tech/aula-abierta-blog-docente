# PERSONALIZACION.md — Guía de Personalización de Tu Blog

> Esta guía te ayuda a hacer el blog verdaderamente tuyo. Hay dos niveles: básico (desde la interfaz web) y avanzado (editando código).

---

## Nivel 1: Personalización Básica (Sin tocar código)

### Tu Perfil Docente

1. Abre tu blog desplegado y navega a **perfil.html** (ej: `tu-blog.onrender.com/perfil.html`)
2. Completa todos los campos del formulario:
   - **Nombre completo** con tu título académico (ej: "Lic. María Pérez")
   - **Título académico** (Lic., Mtr., Mtra., Dr., Dra., Ing., Prof.)
   - **Rol o cargo** (ej: "Coordinadora de Ciencias Naturales")
   - **Especialidad** (ej: "Educación Secundaria • Mención Biología")
   - **Escuela o Distrito** (ej: "Liceo Prof. Juan Bosch, Santiago")
   - **Años de experiencia**
   - **Frase pedagógica** — tu filosofía educativa personal
   - **Foto de perfil** — sube una foto profesional tuya
3. Guarda los cambios

> **¿Qué pasa al guardar?** Tu perfil se actualiza automáticamente en TODAS las páginas del blog: la página de inicio, los artículos, el panel de administración, etc. Esto funciona gracias al sistema `profile-loader.js`.

### Tus Artículos

1. Accede al panel: `tu-blog.onrender.com/admin-login.html`
2. Usa las credenciales de demo para entrar
3. Desde **Gestión**, puedes:
   - Editar los 3 artículos de ejemplo que vienen incluidos
   - Crear artículos nuevos desde el **Editor**
   - Organizar por materia y grado
4. Los artículos se guardan en el navegador (IndexedDB)

---

## Nivel 2: Personalización Visual (Editando código)

> Para estos cambios, edita los archivos en tu repositorio de GitHub y Render se actualiza automáticamente.

### Cambiar el Nombre del Blog

El nombre "Aula Abierta" aparece en varias ubicaciones. Para cambiarlo:

**En cada archivo HTML**, busca y reemplaza:
- `<title>` tags — Ej: cambiar "Aula Abierta" por "Mi Rincón Educativo"
- El logo/texto en el header de navegación
- El footer con créditos

**Archivos a modificar:** index.html, publicaciones.html, lectura.html, recursos.html, panel.html, gestion.html, editor.html, biblioteca.html, moderacion.html, perfil.html, admin-login.html

> **Tip:** Pide a Claude que busque y reemplace "Aula Abierta" por tu nombre elegido en todos los archivos de una vez.

### Cambiar los Colores del Tema

El blog usa **Tailwind CSS** con tonos morados como color primario. Las clases más comunes son:

| Clase actual | Uso | Ejemplo de cambio |
|-------------|------|-------------------|
| `bg-purple-600` | Fondos principales | `bg-blue-600`, `bg-teal-600` |
| `bg-purple-700` | Fondos hover/activos | `bg-blue-700`, `bg-teal-700` |
| `bg-purple-50` | Fondos claros | `bg-blue-50`, `bg-teal-50` |
| `text-purple-600` | Texto de acento | `text-blue-600`, `text-teal-600` |
| `border-purple-200` | Bordes decorativos | `border-blue-200`, `border-teal-200` |
| `from-purple-600` | Gradientes | `from-blue-600`, `from-teal-600` |

**Paletas sugeridas:**
- 🔵 **Azul:** blue-50 / blue-600 / blue-700 (clásico educativo)
- 🟢 **Verde:** emerald-50 / emerald-600 / emerald-700 (naturaleza, ciencias)
- 🔴 **Rojo institucional:** rose-50 / rose-600 / rose-700 (formal)
- 🟡 **Ámbar:** amber-50 / amber-600 / amber-700 (cálido, primaria)

> **Tip:** Pide a Claude: "Cambia todos los colores purple por teal en todos los archivos HTML"

### Cambiar las Imágenes de Portada

Los artículos de ejemplo usan imágenes de **Unsplash** (gratuitas). Puedes cambiarlas:

1. Ve a [unsplash.com](https://unsplash.com) y busca imágenes educativas
2. Copia la URL de la imagen
3. En `db.js`, busca los objetos dentro de `defaultArticles` y cambia el campo `coverImage`

**Formato de URL Unsplash:**
```
https://images.unsplash.com/photo-XXXXX?auto=format&fit=crop&w=1200&q=80
```

### Cambiar el Contenido Semilla

En `db.js`, dentro de `_seedInitialData()`, puedes modificar:

- **Artículos:** Cambia title, summary, subject, grade, content (HTML) de los 3 artículos
- **Media:** Cambia las 3 imágenes de la biblioteca
- **Perfil por defecto:** Cambia el nombre y datos del perfil demo (líneas ~386-398)

> **IMPORTANTE:** Los datos semilla solo se cargan cuando IndexedDB está vacía (primera visita). Si ya visitaste el blog, limpia los datos del sitio en tu navegador para ver los cambios en el seed.

### Agregar Nuevas Materias/Áreas

Los filtros de materia en `publicaciones.html` y el editor tienen opciones predefinidas. Para agregar nuevas:

1. Busca los `<select>` o botones de filtro de materias
2. Agrega nuevas opciones: Educación Artística, Educación Física, Formación Humana, etc.

---

## Nivel 3: Personalización Estructural (Avanzado)

### Agregar Nuevas Páginas

1. Copia cualquier HTML existente como base
2. Asegúrate de incluir estos scripts en orden:
   ```html
   <script src="db.js"></script>
   <script src="profile-loader.js"></script>
   ```
3. Agrega `data-auto-profile` al `<body>` para carga automática del perfil
4. Actualiza la navegación en todas las demás páginas

### Activar el Sistema de Perfil en Elementos Nuevos

Agrega atributos `data-tp` a cualquier elemento HTML:
```html
<span data-tp="name">Docente</span>
<span data-tp="greeting">¡Buen día!</span>
<img data-tp="photo" src="" alt="Perfil">
```

El `profile-loader.js` los actualizará automáticamente con los datos del perfil guardado.

---

## Notas Importantes

- **IndexedDB es local:** Cada persona que visita tu blog tiene su propia copia de datos. Los visitantes ven los artículos semilla; tú ves los que creaste/editaste en TU navegador.
- **Los cambios en GitHub se despliegan automáticamente:** Cada push al repositorio dispara un re-deploy en Render.
- **El blog es un prototipo educativo:** No tiene autenticación real ni base de datos compartida. Es ideal para demostrar conceptos de desarrollo web.
