# PROMPT PARA ESTUDIANTES — Copiar y pegar en Claude.ai

> **Instrucciones:** Copia TODO el texto del recuadro de abajo y pégalo en un chat nuevo de Claude.ai. Asegúrate de tener activos los conectores de **GitHub** y **Render** antes de enviar el mensaje. Adjunta el archivo .zip junto con este prompt.

---

```
Soy estudiante de la clase de Tecnología Educativa (MTEMA). Adjunto un archivo .zip que contiene un blog educativo llamado "Aula Abierta" listo para desplegar. Necesito tu ayuda para:

1. CREAR un repositorio público en mi GitHub con un nombre personalizado para mi blog (sugiéreme opciones basadas en mi nombre o área de enseñanza, yo elegiré uno).

2. SUBIR todos los archivos del .zip al repositorio (los 16 archivos van en la raíz del repo, sin subcarpetas).

3. CREAR un Static Site en Render conectado a ese repositorio con esta configuración:
   - Branch: main
   - Publish Directory: . (punto, la raíz)
   - Build Command: (vacío o "echo No build needed")
   - NO necesita variables de entorno

4. VERIFICAR que el sitio cargó correctamente visitando la URL que Render asigne.

IMPORTANTE — Lee primero estos archivos del .zip:
- CONTEXTO-PARA-CLAUDE.md → Explica toda la arquitectura del blog
- PERSONALIZACION.md → Guía de personalización para después del despliegue

DESPUÉS del despliegue exitoso, ayúdame a personalizar:
- Cambiar el nombre del blog "Aula Abierta" por uno que yo elija
- Cambiar los colores del tema (yo elegiré la paleta)
- Cualquier otra personalización que yo quiera hacer

Antes de empezar, pregúntame:
1. ¿Cómo te llamas y cuál es tu título académico?
2. ¿En qué escuela o distrito trabajas?
3. ¿Qué materia(s) enseñas y en qué grado(s)?
4. ¿Qué nombre quieres para tu blog?
5. ¿Qué color prefieres como tema principal? (morado actual, azul, verde, rojo, ámbar, u otro)
```

---

> **Nota para el profesor:** Este prompt está diseñado para que Claude haga preguntas de personalización antes de actuar. Los estudiantes no necesitan conocimiento técnico — Claude los guiará paso a paso usando los conectores de GitHub y Render.
