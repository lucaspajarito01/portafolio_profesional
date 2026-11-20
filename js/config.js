/**
 * ============================================================================
 * CONFIG.JS — Configuración centralizada del portafolio inmersivo 3D (2026)
 * Paleta vibrante y luminosa, skills con punteros dinámicos 3D->2D,
 * proyectos compactos con imágenes relacionadas y Parte 5 (Proceso) reestructurada.
 * ============================================================================
 */

export const CONFIG = {
    developer: {
        name: 'LUCAS PAJARITO',
        fullName: 'Lucas Samuel Pajarito Surek',
        role: 'Desarrollador Web · Experiencias Interactivas',
        technicalTitle: 'Técnico en Desarrollo de Software · Full-Stack & Creative Dev',
        location: 'Ciudad de Guatemala · GT',
        email: 'lucaspajarito2023@gmail.com',
        phone: '+502 4123-4463',
        whatsappUrl: 'https://wa.me/50241234463?text=Hola%20Lucas,%20vi%20tu%20portafolio%203D%20y%20me%20gustar%C3%ADa%20conversar%20contigo.',
        discordHandle: 'lucaspajarito01'
    },

    // Paleta vibrante y llamativa (no solo negro)
    palette: {
        night: '#0B1026',       // Azul cósmico profundo luminoso
        deep: '#151F42',        // Índigo espacial
        steel: '#25386E',       // Azul zafiro brillante
        glacier: '#00E5FF',     // Cian eléctrico brillante
        ice: '#A78BFA',         // Violeta luminoso
        mist: '#F0F6FF',        // Blanco cristalino
        accentTeal: '#00F5A0',  // Esmeralda neón suave
        accentCoral: '#FF6B8B', // Coral vibrante
        accentGold: '#FBBF24'   // Ámbar brillante
    },

    // Posiciones Z de la cámara compactadas para evitar espacios vacíos
    cameraWaypoints: {
        hero: { zStart: 12, zEnd: -10 },
        skills: { zStart: -10, zEnd: -96 },
        fogLandscape: { zStart: -96, zEnd: -135 },
        projects: { zStart: -135, zEnd: -175 },
        process: { zStart: -175, zEnd: -215 },
        contact: { zStart: -215, zEnd: -248 }
    },

    // Escena 2: Cristales Poliédricos 3D de Skills (no cuadrados) con colores vibrantes propios
    skills: [
        {
            id: 'html5',
            name: 'HTML5 Semántico',
            category: 'Estructura & Accesibilidad WCAG AAA',
            detail: 'Maquetación limpia, SEO técnico y arquitectura accesible.',
            level: '92%',
            color: '#FF5E3A',
            side: 'left',
            pos: { x: -3.2, y: 1.1, z: -22 },
            svgPath: 'M4 3h16l-1.5 15L12 21l-6.5-3L4 3zm3.5 4l.5 5h6.5l-.3 3-2.7.8-2.7-.8-.2-1.8H6.5l.4 3.5L12 18.2l5.1-1.5.7-7.7H9.5l-.2-2h8.7l.2-2H7.5z'
        },
        {
            id: 'css3',
            name: 'CSS3 & Diseño UI',
            category: 'Grid, Flexbox & Animación Fluida',
            detail: 'Interfaces responsivas, glassmorphism y sistemas de diseño.',
            level: '90%',
            color: '#00D2FF',
            side: 'right',
            pos: { x: 3.3, y: -0.7, z: -32 },
            svgPath: 'M4 3h16l-1.5 15L12 21l-6.5-3L4 3zm3.2 4l.2 2h7.4l-.3 2.5H8l.2 2h6.1l-.4 2.8-1.9.6-1.9-.6-.2-1.5H7.8l.3 3 3.9 1.2 3.9-1.2.9-8.8H7.2z'
        },
        {
            id: 'javascript',
            name: 'JavaScript ES6+',
            category: 'DOM, Asincronía & ES Modules',
            detail: 'Programación modular, eventos reactivos y consumo de APIs.',
            level: '88%',
            color: '#FFD60A',
            side: 'left',
            pos: { x: -3.1, y: -0.9, z: -42 },
            svgPath: 'M3 3h18v18H3V3zm9.5 12.8c0 1.8-1 2.7-2.6 2.7-1.3 0-2.1-.6-2.5-1.5l1.4-.8c.3.5.6.8 1.1.8.6 0 1-.3 1-1.1V10h1.6v5.8zm4.7 2.7c-1.6 0-2.6-.8-3.1-1.8l1.4-.8c.4.6.9 1.1 1.7 1.1.7 0 1.2-.3 1.2-.8 0-.6-.5-.8-1.4-1.2l-.5-.2c-1.4-.6-2.2-1.3-2.2-2.6 0-1.3 1-2.3 2.5-2.3 1.1 0 1.9.4 2.5 1.4l-1.3.9c-.3-.5-.7-.8-1.2-.8-.5 0-.9.3-.9.8 0 .5.4.8 1.2 1.1l.5.2c1.6.7 2.4 1.4 2.4 2.8 0 1.5-1.2 2.4-2.8 2.4z'
        },
        {
            id: 'threejs',
            name: 'Three.js & WebGL',
            category: 'Escenas 3D, Shaders GLSL & Luces',
            detail: 'Geometrías físicas, partículas instanciadas y postprocesado.',
            level: '84%',
            color: '#00F5A0',
            side: 'right',
            pos: { x: 3.2, y: 1.0, z: -52 },
            svgPath: 'M12 2L3 20h18L12 2zm0 4.8L17.4 18H6.6L12 6.8zM12 10l-2.8 5.8h5.6L12 10z'
        },
        {
            id: 'gsap',
            name: 'GSAP & ScrollTrigger',
            category: 'Coreografía Temporal & Cámaras',
            detail: 'Sincronización de scroll con cámaras 3D y micro-interacciones.',
            level: '86%',
            color: '#38EF7D',
            side: 'left',
            pos: { x: -3.3, y: 0.9, z: -62 },
            svgPath: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z'
        },
        {
            id: 'nodejs',
            name: 'Node.js, Express & SOLID',
            category: 'Backend, APIs REST & POO',
            detail: 'Servidores modulares aplicando encapsulamiento, herencia y SOLID.',
            level: '86%',
            color: '#4ADE80',
            side: 'right',
            pos: { x: 3.1, y: -0.8, z: -72 },
            svgPath: 'M12 2l8.5 5v10L12 22l-8.5-5V7L12 2zm0 2.3L5.5 8v8L12 19.7 18.5 16V8L12 4.3z'
        },
        {
            id: 'sql',
            name: 'SQL, PostgreSQL & MySQL',
            category: 'Modelado Relacional, JSONB & XML',
            detail: 'Consultas avanzadas, diseño de esquemas e integridad de datos.',
            level: '85%',
            color: '#A855F7',
            side: 'left',
            pos: { x: -3.0, y: -0.7, z: -82 },
            svgPath: 'M12 3C7 3 3 4.8 3 7v10c0 2.2 4 4 9 4s9-1.8 9-4V7c0-2.2-4-4-9-4zm0 2c4.2 0 7 1.2 7 2s-2.8 2-7 2-7-1.2-7-2 2.8-2 7-2zm7 12c0 .8-2.8 2-7 2s-7-1.2-7-2v-2.6c1.7 1 4.2 1.6 7 1.6s5.3-.6 7-1.6V17zm0-5c0 .8-2.8 2-7 2s-7-1.2-7-2V9.4c1.7 1 4.2 1.6 7 1.6s5.3-.6 7-1.6V12z'
        },
        {
            id: 'git',
            name: 'Git, GitHub & Scrum',
            category: 'Control de Versiones & Equipos Ágiles',
            detail: 'Flujo de ramas colaborativo, revisiones de código y despliegue.',
            level: '90%',
            color: '#FF4D79',
            side: 'right',
            pos: { x: 3.0, y: 0.9, z: -91 },
            svgPath: 'M21.6 11.1l-8.7-8.7c-.5-.5-1.3-.5-1.8 0L9.3 4.2l2.3 2.3c.5-.2 1.1-.1 1.5.3.4.4.5 1 .3 1.5l2.2 2.2c.5-.2 1.1-.1 1.5.3.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.4-.4-.5-1-.3-1.5L12.6 9.3v5.4c.2.1.3.2.5.3.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1.2-.2.3-.3.5-.4V9.1c-.2-.1-.3-.2-.5-.3-.4-.4-.5-1-.3-1.5L8.4 5 2.4 11c-.5.5-.5 1.3 0 1.8l8.7 8.7c.5.5 1.3.5 1.8 0l8.7-8.6c.5-.5.5-1.3 0-1.8z'
        }
    ],

    // Escena 4: Proyectos Compactos con Imagen Relacionada y Enlaces Oficiales
    projects: [
        {
            id: 'wtwt-imdb',
            index: '01',
            title: 'What to Watch Today?',
            subtitle: 'IMDB de Películas · Backend Explorer',
            description: 'Explorador cinematográfico estilo IMDB para descubrir qué película ver hoy, con filtrado por géneros, calificaciones y arquitectura de API REST modular.',
            technologies: ['Node.js', 'Express', 'REST API', 'POO & SOLID'],
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
            accentColor: '#FF4D79',
            demoUrl: 'https://github.com/lucaspajarito01/wtwt_movie_explorer_backend.git',
            codeUrl: 'https://github.com/lucaspajarito01/wtwt_movie_explorer_backend.git',
            visualType: 'cinema'
        },
        {
            id: 'library-cli',
            index: '02',
            title: 'Library CLI System',
            subtitle: 'Sistema de Librerías · Préstamos y Ventas',
            description: 'Sistema integral para la gestión de préstamo y venta de libros, administrando simultáneamente la cartera de clientes y el inventario bibliográfico.',
            technologies: ['CLI System', 'POO', 'Clientes & Ventas', 'Inventario Libros'],
            image: 'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=700&q=80',
            accentColor: '#00E5FF',
            demoUrl: 'https://github.com/lucaspajarito01/library_cli_system.git',
            codeUrl: 'https://github.com/lucaspajarito01/library_cli_system.git',
            visualType: 'library'
        },
        {
            id: 'gym-system',
            index: '03',
            title: 'Gym System',
            subtitle: 'Sistema de Gestión de Gimnasio',
            description: 'Plataforma para la administración de un gimnasio: control de membresías activas, registro de clientes, planes de entrenamiento y seguimiento operativo.',
            technologies: ['Arquitectura POO', 'Membresías', 'Control Clientes', 'Lógica'],
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
            accentColor: '#00F5A0',
            demoUrl: 'https://github.com/lucaspajarito01/gym_system.git',
            codeUrl: 'https://github.com/lucaspajarito01/gym_system.git',
            visualType: 'gym'
        }
    ],

    // Escena 5 (Reestructurada): Pipeline Interactivo de Proceso de Ingeniería
    processSteps: [
        {
            step: '01',
            label: 'Idea & Arquitectura',
            shortLabel: 'Idea estratégica',
            description: 'Análisis de requerimientos, modelado de datos relacionales y definición de arquitectura limpia aplicando principios SOLID.',
            deliverables: ['Requerimientos', 'Esquema SQL', 'Arquitectura'],
            color: '#00E5FF',
            iconPath: 'M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7zm-3 18h6v2H9v-2z',
            z: -182,
            x: -2.4,
            y: 0.7
        },
        {
            step: '02',
            label: 'Diseño UI & Experiencia',
            shortLabel: 'Diseño preciso',
            description: 'Prototipado de interfaces modernas, responsivas y accesibles (WCAG AAA) con micro-interacciones y jerarquía visual clara.',
            deliverables: ['UI Responsiva', 'WCAG AAA', 'Prototipo 3D'],
            color: '#A855F7',
            iconPath: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
            z: -192,
            x: 2.4,
            y: -0.5
        },
        {
            step: '03',
            label: 'Código Modular & APIs',
            shortLabel: 'Código limpio',
            description: 'Implementación frontend y backend con JavaScript ES6+, Node.js, Express, POO e integración de bases de datos y herramientas de IA.',
            deliverables: ['Node.js & ES6+', 'POO & SOLID', 'Integración SQL'],
            color: '#00F5A0',
            iconPath: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
            z: -202,
            x: -2.2,
            y: 0.6
        },
        {
            step: '04',
            label: 'Pruebas & Despliegue',
            shortLabel: 'Despliegue global',
            description: 'Optimización a 60 FPS, control de versiones colaborativo en Git/GitHub bajo metodología Scrum y puesta en producción.',
            deliverables: ['60 FPS Ready', 'Git & GitHub', 'Producción'],
            color: '#FF4D79',
            iconPath: 'M12 2.5s4.5 2.04 4.5 10.5c0 2.49-1.04 5.57-1.6 7H9.1c-.56-1.43-1.6-4.51-1.6-7C7.5 4.54 12 2.5 12 2.5zm2 8.5a2 2 0 1 0-4 0 2 2 0 0 0 4 0zm-6.31 9.52c-.48-1.23-1.12-3.47-1.19-5.52L4 17v5l3.69-1.48zm8.62 0L20 22v-5l-2.5-2c-.07 2.05-.71 4.29-1.19 5.52z',
            z: -212,
            x: 2.0,
            y: -0.4
        }
    ],

    // Escena 6: Enlaces de contacto y plataformas
    socials: [
        {
            label: 'GitHub',
            handle: '@lucaspajarito01',
            url: 'https://github.com/lucaspajarito01'
        },
        {
            label: 'LinkedIn',
            handle: 'Lucas Samuel Pajarito Surek',
            url: 'https://www.linkedin.com/in/lucas-samuel-pajarito-surek-9072933b9/'
        },
        {
            label: 'WhatsApp',
            handle: '+502 4123-4463',
            url: 'https://wa.me/50241234463'
        },
        {
            label: 'Instagram',
            handle: '@samysurek',
            url: 'https://www.instagram.com/samysurek/'
        },
        {
            label: 'Email',
            handle: 'lucaspajarito2023@gmail.com',
            url: 'mailto:lucaspajarito2023@gmail.com'
        }
    ]
};
