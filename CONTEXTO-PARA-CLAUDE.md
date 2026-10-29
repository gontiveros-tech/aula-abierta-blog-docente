# CONTEXTO-PARA-CLAUDE.md — Aula Abierta: Mi Blog Docente

> **INSTRUCCIÓN PARA CLAUDE:** Este archivo describe la arquitectura completa del blog educativo que el estudiante desea desplegar. Léelo completo antes de ejecutar cualquier acción. El estudiante ya tiene los conectores necesarios activos (GitHub + Render como mínimo).

---

## 1. Descripción General

**Aula Abierta** es un blog educativo diseñado para docentes de nivel primario y secundario en República Dominicana. Es un **sitio estático** (HTML + CSS + JS) que se despliega en **Render como Static Site** (gratuito, sin límite de cantidad).

- **NO requiere servidor backend** — toda la persistencia es client-side con IndexedDB
- **NO requiere base de datos externa** — ni Supabase, ni Neon, ni PostgreSQL
- **NO requiere build step** — no hay npm install, no hay webpack, no hay compilación
- **NO requiere package.json funcional** — el archivo existe pero solo tiene metadata

### Tecnologías

- HTML5 semántico
- Tailwind CSS 3.x vía CDN (`cdn.tailwindcss.com`)
- Google Material Symbols (iconos) vía CDN
- Tipografías: Literata + Source Sans 3 (Google Fonts)
- IndexedDB para persistencia local (módulo `db.js`)
- JavaScript vanilla (ES6+, async/await)

---

## 2. Mapa de Archivos (16 archivos)

### Páginas Públicas (visitante)
| Archivo | Función | Descripción |
|---------|---------|-------------|
| `index.html` | Página de inicio | Artículos destacados, áreas curriculares, hero del docente |
| `publicaciones.html` | Listado de publicaciones | Filtros por materia/grado, tarjetas de artículos |
| `lectura.html` | Vista de lectura | Artículo completo, contador de vistas, comentarios |
| `recursos.html` | Recursos didácticos | Materiales descargables organizados por categoría |

### Panel de Administración (docente)
| Archivo | Función | Descripción |
|---------|---------|-------------|
| `admin-login.html` | Login demo | Formulario con credenciales de demo, redirige a panel.html |
| `panel.html` | Dashboard | Estadísticas, accesos rápidos, actividad reciente |
| `gestion.html` | Gestión de artículos | CRUD de publicaciones, filtros, papelera |
| `editor.html` | Editor de artículos | Formulario completo para crear/editar artículos |
| `biblioteca.html` | Biblioteca multimedia | Gestión de imágenes y recursos media |
| `moderacion.html` | Moderación de comentarios | Aprobar/rechazar comentarios, respuestas docentes |
| `perfil.html` | Perfil docente | **Formulario de personalización del perfil** (nombre, título, foto, escuela, etc.) |

### Archivos de Soporte
| Archivo | Función | Descripción |
|---------|---------|-------------|
| `db.js` | Motor de datos | IndexedDB: schema, seed, CRUD, sanitización XSS |
| `profile-loader.js` | Cargador de perfil | Inyecta datos del perfil docente en todas las páginas |
| `package.json` | Metadata | Solo nombre y versión (no tiene dependencias) |
| `_redirects` | Routing SPA | Regla `/*  /index.html  200` para Render Static Site |
| `README.md` | Documentación | Descripción breve del proyecto |

---

## 3. Arquitectura de Datos (IndexedDB)

### Base de datos: `AulaAbiertaDB` (versión 1)

#### Object Store: `articles`
- **keyPath:** `id` (string, formato `art-<slug>` o `art-<timestamp>`)
- **Índices:** status, subject, grade, createdAt
- **Campos:** id, title, summary, subject, grade, readTime, status (`published`|`draft`|`scheduled`|`trash`), coverImage, coverAlt, author, role, views, content (HTML), createdAt, updatedAt, trashedAt, previousStatus

#### Object Store: `comments`
- **keyPath:** `id` (string, formato `comm-<timestamp>`)
- **Índices:** articleId, status, createdAt
- **Campos:** id, articleId, authorName, authorEmail, content, status (`pending`|`approved`|`rejected`|`spam`), teacherReply, createdAt

#### Object Store: `media`
- **keyPath:** `id` (string, formato `media-<slug>` o `media-<timestamp>`)
- **Índices:** category, createdAt
- **Campos:** id, title, category, url, sizeKB, dimensions, altText, associatedArticle, createdAt

#### Object Store: `settings`
- **keyPath:** `key` (string)
- **Registro principal:** `key: 'teacherProfile'` con campos: name, title, role, specialty, school, yearsExperience, bio, photoUrl, updatedAt

### Datos Semilla (Auto-Seed)

El método `_seedInitialData()` en db.js se ejecuta automáticamente cuando los stores están vacíos. Siembra:
- **3 artículos educativos** alineados al currículo MINERD dominicano (Ciencias Naturales, Matemáticas, Lengua Española)
- **3 items de biblioteca multimedia** (imágenes Unsplash)
- **1 perfil docente** de demo (Lic. Ramona Almonte — nombre ficticio)

> **IMPORTANTE:** Los datos semilla usan nombres ficticios dominicanos, NO son datos personales reales. Las imágenes de portada son de Unsplash (libres de uso).

---

## 4. Sistema de Perfil Docente

### Cómo funciona

1. **`perfil.html`** — Formulario donde el docente ingresa su información personal
2. **`db.js` → `updateTeacherProfile()`** — Guarda en IndexedDB (store: settings, key: teacherProfile)
3. **`profile-loader.js`** — Lee el perfil y lo inyecta en TODAS las páginas que tengan atributos `data-tp`

### Atributos `data-tp` disponibles

| Atributo | Resultado | Ejemplo |
|----------|-----------|---------|
| `data-tp="name"` | Nombre completo | "Lic. Ramona Almonte" |
| `data-tp="title"` | Título académico | "Lic." |
| `data-tp="role"` | Cargo/rol | "Especialista en Didáctica" |
| `data-tp="specialty"` | Especialidad | "Educación Primaria • Mención Ciencias" |
| `data-tp="school"` | Escuela/distrito | "Distrito Educativo 10-01" |
| `data-tp="years"` | Años de experiencia | "14" |
| `data-tp="bio"` | Frase pedagógica | "Educar con ternura..." |
| `data-tp="photo"` | src de imagen (en `<img>`) | URL o data URI |
| `data-tp="greeting"` | Saludo personalizado | "¡Buen día, Lic. Ramona!" |
| `data-tp="titleName"` | Título + Nombre | "Lic. Ramona Almonte" |
| `data-tp="schoolYears"` | Escuela + experiencia | "Distrito 10-01 • 14 años de experiencia" |
| `data-tp="authorLine"` | Línea de autoría | "Por Lic. Ramona Almonte" |
| `data-tp="roleBadge"` | Badge de rol | "Especialista en Didáctica" |
| `data-tp="emptyGreeting"` | Saludo bandeja vacía | "¡Bandeja al día, Lic. Ramona!" |

### Avatar por defecto

Cuando no hay foto, se usa un SVG inline con emoji 👩‍🏫 sobre fondo morado (#6750A4). El docente puede subir su propia foto desde `perfil.html`.

---

## 5. API del StorageService (db.js)

### Métodos de Artículos
```javascript
await AulaAbiertaDB.saveArticle(articleData)      // Crear o actualizar
await AulaAbiertaDB.getArticleById(id)             // Obtener por ID
await AulaAbiertaDB.getPublishedArticles()         // Solo status='published', ordenados por fecha
await AulaAbiertaDB.updateArticle(id, updates)     // Actualización parcial
await AulaAbiertaDB.deleteArticle(id)              // Soft-delete → status='trash'
await AulaAbiertaDB.restoreArticle(id)             // Restaurar de papelera
await AulaAbiertaDB.permanentDeleteArticle(id)     // Eliminación real + comentarios asociados
await AulaAbiertaDB.getTrashedArticles()           // Artículos en papelera
```

### Métodos de Comentarios
```javascript
await AulaAbiertaDB.addComment(commentData)                     // Nuevo (status='pending')
await AulaAbiertaDB.getCommentsByArticle(articleId, onlyApproved) // Filtrar por artículo
await AulaAbiertaDB.updateCommentStatus(id, newStatus, replyText) // Moderar
await AulaAbiertaDB.deleteComment(id)                           // Eliminar permanente
```

### Métodos de Media
```javascript
await AulaAbiertaDB.saveMedia(mediaData)   // Crear o actualizar
await AulaAbiertaDB.getAllMedia()           // Todos, ordenados por fecha
await AulaAbiertaDB.deleteMedia(id)        // Eliminar
```

### Métodos de Perfil
```javascript
await AulaAbiertaDB.getTeacherProfile()           // Leer perfil (con defaults si no existe)
await AulaAbiertaDB.updateTeacherProfile(updates)  // Actualizar campos del perfil
```

### Utilidades Globales (window)
```javascript
sanitizeHTML(html)     // Sanitizar HTML rico (para contenido de artículos)
escapeHTML(str)        // Escapar texto plano (para templates)
showToast(message, type) // Notificación toast (success|error|warning|info)
```

---

## 6. Instrucciones de Despliegue

### Tipo de servicio: **Render Static Site** (NO Web Service)

> ⚠️ IMPORTANTE: Este es un sitio estático. Usar "Static Site" en Render, NO "Web Service". Static Site es gratuito sin límite.

### Pasos para Claude con conectores:

1. **Crear repositorio en GitHub:**
   - Nombre sugerido: `mi-blog-docente` (o el que prefiera el estudiante)
   - Visibilidad: pública
   - Subir TODOS los 16 archivos a la raíz del repositorio (no en subcarpetas)

2. **Crear Static Site en Render:**
   - Conectar al repositorio de GitHub recién creado
   - **Publish Directory:** `.` (punto — la raíz, porque los HTML están en la raíz)
   - **NO configurar Build Command** (dejar vacío o `echo "No build needed"`)
   - **NO configurar variables de entorno** (no se necesitan)
   - Branch: `main`

3. **Verificar despliegue:**
   - Render asigna URL automática tipo `mi-blog-docente.onrender.com`
   - Verificar que index.html carga correctamente
   - Verificar que la navegación funciona (gracias a `_redirects`)

### Archivo `_redirects`
```
/*    /index.html   200
```
Este archivo es **crítico** — permite que todas las rutas carguen correctamente en Render Static Site. Sin él, las URLs directas a páginas internas darían error 404.

---

## 7. Personalización que el Estudiante Debe Hacer

Después del despliegue, el estudiante personaliza el blog:

### Vía interfaz web (perfil.html):
- Nombre completo con título académico
- Rol o cargo
- Especialidad
- Escuela o distrito educativo
- Años de experiencia
- Frase pedagógica personal
- Foto de perfil

### Vía código (opcional, para personalización avanzada):
- Colores del tema (buscar clases de Tailwind como `bg-purple-`, `text-purple-`)
- Nombre del blog en los `<title>` y headers
- Contenido de los artículos semilla en `db.js`
- Imágenes de portada (URLs de Unsplash u otras fuentes libres)

> Ver archivo **PERSONALIZACION.md** para guía detallada de personalización visual.

---

## 8. Notas Técnicas Importantes

1. **Todos los archivos van en la raíz** — no hay estructura de carpetas src/, public/, etc.
2. **db.js debe cargarse ANTES que profile-loader.js** en cada página HTML
3. **El seed solo se ejecuta una vez** — cuando IndexedDB está vacía (articles count === 0)
4. **IndexedDB es por navegador/dispositivo** — cada visitante tiene su propia base de datos local
5. **El login es demo** — admin-login.html no tiene autenticación real, simplemente redirige a panel.html
6. **Las imágenes de artículos son de Unsplash** — URLs externas, no archivos locales
7. **No hay CSS personalizado en archivos separados** — todo es Tailwind utility classes inline + estilos en `<style>` tags dentro de cada HTML
8. **XSS Protection** — db.js incluye `sanitizeHTML()` y `escapeHTML()` para proteger contra inyección
