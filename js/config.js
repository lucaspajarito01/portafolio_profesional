/**
 * ============================================================================
 * CONFIG.JS — Configuración centralizada del portafolio inmersivo 3D (2026)
 * Edita este archivo para cambiar nombre, textos, skills, proyectos, enlaces y paleta.
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
        whatsappUrl: 'https://wa.me/50241234463?text=Hola%20Lucas,%20explorado%20tu%20experiencia%203D%20y%20me%20gustar%C3%ADa%20hablar%20contigo.',
        discordHandle: 'lucaspajarito01',
        traits: ['Emprendedor', 'Constante', 'Decidido'],
        languages: ['Español (Nativo)', 'Inglés (B2)', 'Kaqchikel'],
        bioShort: 'Arquitectura limpia, interfaces inmersivas y sistemas escalables.'
    },

    palette: {
        night: '#070B14',      // Azul noche (fondo base)
        deep: '#0F1B2D',       // Azul profundo
        steel: '#1E3A5F',      // Azul acero
        glacier: '#5B8DB8',    // Azul glaciar
        ice: '#A9C7D9',        // Hielo
        mist: '#DCE6EE',       // Niebla
        accentTeal: '#7FA6A0'  // Verde azulado apagado
    },

    // Posiciones Z de la cámara para cada una de las 6 escenas
    cameraWaypoints: {
        hero: { zStart: 12, zEnd: -10 },
        skills: { zStart: -10, zEnd: -95 },
        fogLandscape: { zStart: -95, zEnd: -155 },
        projects: { zStart: -155, zEnd: -215 },
        process: { zStart: -215, zEnd: -280 },
        contact: { zStart: -280, zEnd: -325 }
    },

    // Escena 2: Cristales 3D de Skills con iconos vectoriales minimalistas
    skills: [
        {
            id: 'html5',
            name: 'HTML5 Semántico',
            category: 'Estructura & Accesibilidad WCAG AAA',
            pos: { x: -4.2, y: 1.4, z: -24 },
            svgPath: 'M4 3h16l-1.5 15L12 21l-6.5-3L4 3zm3.5 4l.5 5h6.5l-.3 3-2.7.8-2.7-.8-.2-1.8H6.5l.4 3.5L12 18.2l5.1-1.5.7-7.7H9.5l-.2-2h8.7l.2-2H7.5z'
        },
        {
            id: 'css3',
            name: 'CSS3 & Arquitectura UI',
            category: 'Diseño Responsivo & Animación',
            pos: { x: 4.4, y: -1.1, z: -34 },
            svgPath: 'M4 3h16l-1.5 15L12 21l-6.5-3L4 3zm3.2 4l.2 2h7.4l-.3 2.5H8l.2 2h6.1l-.4 2.8-1.9.6-1.9-.6-.2-1.5H7.8l.3 3 3.9 1.2 3.9-1.2.9-8.8H7.2z'
        },
        {
            id: 'javascript',
            name: 'JavaScript ES6+',
            category: 'DOM, Asincronía & Módulos ES',
            pos: { x: -3.8, y: -1.5, z: -44 },
            svgPath: 'M3 3h18v18H3V3zm9.5 12.8c0 1.8-1 2.7-2.6 2.7-1.3 0-2.1-.6-2.5-1.5l1.4-.8c.3.5.6.8 1.1.8.6 0 1-.3 1-1.1V10h1.6v5.8zm4.7 2.7c-1.6 0-2.6-.8-3.1-1.8l1.4-.8c.4.6.9 1.1 1.7 1.1.7 0 1.2-.3 1.2-.8 0-.6-.5-.8-1.4-1.2l-.5-.2c-1.4-.6-2.2-1.3-2.2-2.6 0-1.3 1-2.3 2.5-2.3 1.1 0 1.9.4 2.5 1.4l-1.3.9c-.3-.5-.7-.8-1.2-.8-.5 0-.9.3-.9.8 0 .5.4.8 1.2 1.1l.5.2c1.6.7 2.4 1.4 2.4 2.8 0 1.5-1.2 2.4-2.8 2.4z'
        },
        {
            id: 'threejs',
            name: 'Three.js & WebGL',
            category: 'Escenas 3D, Shaders & Postprocesado',
            pos: { x: 4.1, y: 1.6, z: -54 },
            svgPath: 'M12 2L3 20h18L12 2zm0 4.8L17.4 18H6.6L12 6.8zM12 10l-2.8 5.8h5.6L12 10z'
        },
        {
            id: 'gsap',
            name: 'GSAP & ScrollTrigger',
            category: 'Coreografía Temporal & Cámaras',
            pos: { x: -4.3, y: 1.2, z: -64 },
            svgPath: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z'
        },
        {
            id: 'nodejs',
            name: 'Node.js, Express & SOLID',
            category: 'Backend, APIs REST & POO',
            pos: { x: 3.9, y: -1.4, z: -74 },
            svgPath: 'M12 2l8.5 5v10L12 22l-8.5-5V7L12 2zm0 2.3L5.5 8v8L12 19.7 18.5 16V8L12 4.3z'
        },
        {
            id: 'sql',
            name: 'SQL, PostgreSQL & MySQL',
            category: 'Modelado Relacional, JSONB & XML',
            pos: { x: -3.6, y: -1.2, z: -83 },
            svgPath: 'M12 3C7 3 3 4.8 3 7v10c0 2.2 4 4 9 4s9-1.8 9-4V7c0-2.2-4-4-9-4zm0 2c4.2 0 7 1.2 7 2s-2.8 2-7 2-7-1.2-7-2 2.8-2 7-2zm7 12c0 .8-2.8 2-7 2s-7-1.2-7-2v-2.6c1.7 1 4.2 1.6 7 1.6s5.3-.6 7-1.6V17zm0-5c0 .8-2.8 2-7 2s-7-1.2-7-2V9.4c1.7 1 4.2 1.6 7 1.6s5.3-.6 7-1.6V12z'
        },
        {
            id: 'git',
            name: 'Git, Scrum & Responsive',
            category: 'Flujo Colaborativo & Mobile-First',
            pos: { x: 3.5, y: 1.3, z: -91 },
            svgPath: 'M21.6 11.1l-8.7-8.7c-.5-.5-1.3-.5-1.8 0L9.3 4.2l2.3 2.3c.5-.2 1.1-.1 1.5.3.4.4.5 1 .3 1.5l2.2 2.2c.5-.2 1.1-.1 1.5.3.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.4-.4-.5-1-.3-1.5L12.6 9.3v5.4c.2.1.3.2.5.3.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1.2-.2.3-.3.5-.4V9.1c-.2-.1-.3-.2-.5-.3-.4-.4-.5-1-.3-1.5L8.4 5 2.4 11c-.5.5-.5 1.3 0 1.8l8.7 8.7c.5.5 1.3.5 1.8 0l8.7-8.6c.5-.5.5-1.3 0-1.8z'
        }
    ],

    // Escena 4: Proyectos Destacados (Únicamente los proyectos autorizados)
    projects: [
        {
            id: 'wtwt-imdb',
            index: '01',
            title: 'What to Watch Today?',
            subtitle: 'Explorador IMDB de Películas & Backend',
            description: 'Servicio backend y explorador cinematográfico estilo IMDB para descubrir películas, filtrar catálogos y gestionar metadatos con arquitectura modular.',
            technologies: ['Node.js', 'Express', 'REST API', 'POO & SOLID'],
            demoUrl: 'https://github.com/lucaspajarito01/wtwt_movie_explorer_backend.git',
            codeUrl: 'https://github.com/lucaspajarito01/wtwt_movie_explorer_backend.git',
            visualType: 'cinema'
        },
        {
            id: 'library-cli',
            index: '02',
            title: 'Library CLI System',
            subtitle: 'Gestión Integral de Librerías',
            description: 'Sistema para la administración simultánea de préstamos y venta de libros, control de cartera de clientes y trazabilidad de inventario bibliográfico.',
            technologies: ['CLI Architecture', 'POO', 'Clientes & Préstamos', 'Stock'],
            demoUrl: 'https://github.com/lucaspajarito01/library_cli_system.git',
            codeUrl: 'https://github.com/lucaspajarito01/library_cli_system.git',
            visualType: 'library'
        },
        {
            id: 'gym-system',
            index: '03',
            title: 'Gym System',
            subtitle: 'Sistema de Gestión de Gimnasio',
            description: 'Plataforma de control operativo para gimnasios: administración de membresías, registro de socios, seguimiento de planes y rutinas de entrenamiento.',
            technologies: ['Lógica de Negocio', 'POO', 'Membresías', 'Arquitectura Limpia'],
            demoUrl: 'https://github.com/lucaspajarito01/gym_system.git',
            codeUrl: 'https://github.com/lucaspajarito01/gym_system.git',
            visualType: 'gym'
        },
        {
            id: 'alba-health',
            index: '04',
            title: 'Proyecto ALBA',
            subtitle: 'Plataforma Móvil Farma-Geriátrica',
            description: 'Aplicación de salud con detección de caídas por giroscopio/acelerómetro, vinculación de roles mediante QR, recordatorios dinámicos y accesibilidad WCAG AAA.',
            technologies: ['Flutter & Dart', 'Firebase', 'Provider', 'WCAG AAA'],
            demoUrl: 'https://github.com/lucaspajarito01',
            codeUrl: 'https://github.com/lucaspajarito01',
            visualType: 'alba'
        }
    ],

    // Escena 5: Línea de tiempo 3D (2 palabras por nodo)
    processSteps: [
        { step: '01', label: 'Idea estratégica', z: -226, x: -2.6, y: 0.8 },
        { step: '02', label: 'Diseño preciso', z: -242, x: 2.6, y: -0.6 },
        { step: '03', label: 'Código limpio', z: -258, x: -2.4, y: 0.7 },
        { step: '04', label: 'Despliegue global', z: -274, x: 2.2, y: -0.4 }
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
