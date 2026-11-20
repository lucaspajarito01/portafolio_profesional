# Lucas Samuel Pajarito Surek — Portafolio Inmersivo 3D (2026)

Experiencia web interactiva 3D en una sola página donde **el scroll actúa como la cámara**. Construido con **HTML5**, **CSS3** y **JavaScript Vanilla (ES Modules)** utilizando **Three.js (WebGL2 + Shaders GLSL + Postprocessing)**, **GSAP + ScrollTrigger**, **Lenis (Smooth Scroll)** y **SplitType**.

---

## Estructura del Proyecto
02 // 
```text
├── index.html          # Estructura semántica de las 6 escenas, HUD, Loader y Import Map
├── css/
│   └── style.css       # Variables de paleta fría, tipografía editorial, glassmorphism y responsive
├── js/
│   ├── config.js       # Datos centralizados: perfil, skills, proyectos, proceso y enlaces
│   ├── scene.js        # Escena única Three.js (6 ambientes en eje Z, Shaders FBM y Postprocesado)
│   ├── sections.js     # Renderizado DOM, SplitType + GSAP, tarjetas 3D con tilt y botón magnético
│   └── main.js         # Bucle único requestAnimationFrame compartido, Lenis, cursor y Easter Egg DEV
└── README.md
```

---

## Cómo Ejecutar Localmente

Al utilizar **ES Modules nativos** (`<script type="module">`), el proyecto debe servirse desde un servidor HTTP local:

### Opción 1: Con `npx serve` (Node.js)
```bash
npx serve .
```

### Opción 2: Con Vite
```bash
npx vite
```

### Opción 3: Con Python o VS Code Live Server
```bash
python -m http.server 8080
```
Luego abre `http://localhost:8080` (o el puerto asignado) en tu navegador.

---

## Dónde Personalizar Datos y Estilo

1. **Nombre, Subtítulo, Skills, Proyectos y Enlaces (`/js/config.js`)**:
   - `CONFIG.developer`: Cambia el nombre, rol, correo y teléfono.
   - `CONFIG.skills`: Edita los 8 cristales 3D del corredor (`name`, `category`, coordenadas `pos` y `svgPath`).
   - `CONFIG.projects`: Agrega o edita las tarjetas de proyectos (`title`, `subtitle`, `description`, `technologies`, `demoUrl`, `codeUrl`).
   - `CONFIG.processSteps`: Modifica los 4 nodos del tubo de luz 3D (`Idea`, `Diseño`, `Código`, `Despliegue`).
   - `CONFIG.socials`: Actualiza enlaces a GitHub, LinkedIn, WhatsApp, Instagram y Email.

2. **Colores y Tipografía (`/css/style.css` y `/js/config.js`)**:
   - En `/css/style.css` dentro de `:root`:
     - `--bg-night: #070B14` (Azul noche)
     - `--bg-deep: #0F1B2D` (Azul profundo)
     - `--blue-steel: #1E3A5F` (Azul acero)
     - `--blue-glacier: #5B8DB8` (Azul glaciar)
     - `--ice: #A9C7D9` (Hielo)
     - `--mist: #DCE6EE` (Niebla)
     - `--accent-teal: #7FA6A0` (Verde azulado apagado)
   - En `/js/config.js` dentro de `CONFIG.palette` para sincronizar la niebla y materiales 3D de Three.js.

---

## Easter Egg para Desarrolladores

Escribe **`dev`** en cualquier momento con el teclado (o presiona la tecla **`` ` ``** o el botón **`[DEV]`** del HUD superior) para desplegar la consola de telemetría con FPS en tiempo real, coordenada `Z` de la cámara, *draw calls* y desglose del stack.
