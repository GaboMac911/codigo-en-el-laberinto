# Mentes en acción

Plataforma de aprendizaje de pensamiento computacional para estudiantes de grado noveno. La ruta se organiza en cuatro unidades e integra actividades desconectadas, retos interactivos, un miniproyecto y juegos de MakeCode Arcade y Scratch.

## Requisitos

- Node.js 20.19 o superior
- npm

## Ejecutar localmente

```bash
npm ci
npm start
```

Abre `http://localhost:4200/` en el navegador.

## Compilar

```bash
npm run build
```

La salida estática queda en `dist/PlataformaPC/browser/` y puede servirse desde un hosting estático. La aplicación guarda el avance y el miniproyecto en el almacenamiento local del navegador.

## Publicación en GitHub Pages

El flujo de GitHub Actions incluido compila y publica automáticamente el sitio cuando hay un push a `main`. En GitHub, abre **Settings → Pages** y selecciona **GitHub Actions** como fuente de publicación. La URL del sitio aparecerá en esa sección cuando termine el primer despliegue.

## Material pedagógico

La plataforma incluye los proyectos MakeCode Arcade y Scratch proporcionados como iframes. Las actividades interactivas propias dan retroalimentación al estudiante y guardan el miniproyecto final en su dispositivo.
