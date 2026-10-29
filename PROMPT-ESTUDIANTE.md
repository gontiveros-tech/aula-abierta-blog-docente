# PROMPT PARA ESTUDIANTES — Copiar y pegar en Claude.ai

## Prerrequisitos (hacer ANTES de usar el prompt)

1. **GitHub:** Crear tu cuenta en github.com y crear un repositorio público vacío con el nombre que quieras para tu blog (ej: `mi-blog-docente`, `aula-ciencias-5to`, etc.)
2. **Render:** Crear tu cuenta en render.com
3. **Claude.ai:** Tener activos los conectores de **GitHub** y **Render** (ver tutorial del profesor)

## Instrucciones

Copia TODO el texto del recuadro de abajo y pégalo en un chat nuevo de Claude.ai. **Adjunta el archivo .zip** junto con este prompt.

---

```
Soy estudiante de la clase de Tecnología Educativa (MTEMA). Adjunto un archivo .zip que contiene un blog educativo llamado "Aula Abierta" listo para desplegar. Ya creé mi cuenta de GitHub y un repositorio público vacío. También ya tengo mi cuenta en Render. Necesito tu ayuda para:

1. SUBIR todos los archivos del .zip a mi repositorio de GitHub (los 16 archivos del blog van en la raíz del repo, sin subcarpetas — NO subas los archivos .md de documentación).

2. CREAR un Static Site en Render conectado a ese repositorio de GitHub con esta configuración:
   - Branch: main
   - Publish Directory: . (punto, la raíz)
   - Build Command: (vacío o "echo No build needed")
   - NO necesita variables de entorno

3. VERIFICAR que el sitio cargó correctamente visitando la URL que Render asigne.

Mi repositorio de GitHub se llama: [ESCRIBE AQUÍ EL NOMBRE DE TU REPO]
Mi usuario de GitHub es: [ESCRIBE AQUÍ TU USUARIO]

IMPORTANTE — Lee primero estos archivos del .zip:
- CONTEXTO-PARA-CLAUDE.md → Explica toda la arquitectura del blog
- PERSONALIZACION.md → Guía de personalización para después del despliegue

DESPUÉS del despliegue exitoso, ayúdame a personalizar:
- Cambiar el nombre del blog "Aula Abierta" por uno que yo elija
- Cambiar los colores del tema (yo elegiré la paleta)
- Cualquier otra personalización que yo quiera hacer

Antes de empezar con la personalización, pregúntame:
1. ¿Cómo te llamas y cuál es tu título académico?
2. ¿En qué escuela o distrito trabajas?
3. ¿Qué materia(s) enseñas y en qué grado(s)?
4. ¿Qué nombre quieres para tu blog?
5. ¿Qué color prefieres como tema principal? (morado actual, azul, verde, rojo, ámbar, u otro)
```

---

> **Nota para el profesor:** Los estudiantes deben crear su cuenta y repo en GitHub + cuenta en Render ANTES de usar este prompt. Claude se encarga de subir los archivos al repo y de crear/configurar el Static Site en Render vía conectores.
