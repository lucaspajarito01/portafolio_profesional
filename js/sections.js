/**
 * ============================================================================
 * SECTIONS.JS — Renderizado de secciones, SplitType + GSAP ScrollTrigger,
 * Tarjetas Glassmorphism 3D con desenfoque de fondo y Botón Magnético.
 * ============================================================================
 */

import { CONFIG } from './config.js';

/**
 * Genera el arte SVG técnico minimalista para cada tarjeta de proyecto
 * usando exclusivamente la paleta fría (#070B14, #1E3A5F, #5B8DB8, #A9C7D9, #7FA6A0).
 */
function buildProjectArtworkSVG(visualType, index) {
    const artworks = {
        cinema: `
            <svg viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="420" height="200" fill="#070B14"/>
                <circle cx="210" cy="100" r="78" stroke="#1E3A5F" stroke-width="1.2" stroke-dasharray="4 4"/>
                <circle cx="210" cy="100" r="52" stroke="#5B8DB8" stroke-width="1.5"/>
                <polygon points="198,78 234,100 198,122" fill="#A9C7D9" fill-opacity="0.85"/>
                <line x1="28" y1="36" x2="115" y2="36" stroke="#7FA6A0" stroke-width="2"/>
                <text x="28" y="54" fill="#A9C7D9" font-family="monospace" font-size="11">IMDB // API_EXPLORER_V2</text>
                <text x="28" y="176" fill="#5B8DB8" font-family="monospace" font-size="10">GET /api/v1/movies/discover · 200 OK</text>
            </svg>
        `,
        library: `
            <svg viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="420" height="200" fill="#070B14"/>
                <rect x="85" y="45" width="38" height="110" rx="3" stroke="#5B8DB8" stroke-width="1.5" fill="#0F1B2D"/>
                <rect x="132" y="35" width="42" height="120" rx="3" stroke="#A9C7D9" stroke-width="1.5" fill="#1E3A5F" fill-opacity="0.45"/>
                <rect x="184" y="50" width="36" height="105" rx="3" stroke="#7FA6A0" stroke-width="1.5" fill="#0F1B2D"/>
                <path d="M245 60 L335 60 M245 84 L315 84 M245 108 L328 108 M245 132 L295 132" stroke="#A9C7D9" stroke-width="2" stroke-linecap="round"/>
                <text x="28" y="176" fill="#7FA6A0" font-family="monospace" font-size="10">CLI // PRESTAMOS · VENTAS · CLIENTES · STOCK</text>
            </svg>
        `,
        gym: `
            <svg viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="420" height="200" fill="#070B14"/>
                <path d="M70 135 L130 95 L185 115 L250 62 L310 82 L355 48" stroke="#7FA6A0" stroke-width="2.5" fill="none"/>
                <circle cx="130" cy="95" r="4.5" fill="#DCE6EE"/>
                <circle cx="250" cy="62" r="4.5" fill="#DCE6EE"/>
                <circle cx="355" cy="48" r="5.5" fill="#7FA6A0"/>
                <rect x="70" y="148" width="285" height="1" fill="#1E3A5F"/>
                <text x="28" y="34" fill="#A9C7D9" font-family="monospace" font-size="11">SYS_${index} // GYM_CORE_ENGINE</text>
                <text x="28" y="176" fill="#5B8DB8" font-family="monospace" font-size="10">MEMBRESÍAS · SOCIOS · RUTINAS · CONTROL</text>
            </svg>
        `,
        alba: `
            <svg viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="420" height="200" fill="#070B14"/>
                <path d="M40 102 L125 102 L145 62 L168 142 L192 78 L212 118 L230 102 L380 102" stroke="#A9C7D9" stroke-width="2" stroke-linejoin="round"/>
                <circle cx="210" cy="100" r="64" stroke="#1E3A5F" stroke-width="1"/>
                <text x="28" y="34" fill="#7FA6A0" font-family="monospace" font-size="11">ALBA // FLUTTER · FIREBASE · WCAG AAA</text>
                <text x="28" y="176" fill="#5B8DB8" font-family="monospace" font-size="10">GIROSCOPIO · QR ROLES · ADHERENCIA SALUD</text>
            </svg>
        `
    };

    return artworks[visualType] || artworks.cinema;
}

/**
 * Inyecta en el DOM los datos configurados en CONFIG (Skills, Proyectos, Proceso, Contacto)
 */
export function renderDynamicSections() {
    // 1. Píldoras de Skills en Escena 2
    const skillsListEl = document.querySelector('#skills-hud-grid');
    if (skillsListEl) {
        skillsListEl.innerHTML = CONFIG.skills
            .map(
                (skill, idx) => `
                <div class="skill-hud-chip" data-skill-chip="${skill.id}">
                    <span class="chip-index">0${idx + 1}</span>
                    <span class="chip-name">${skill.name}</span>
                </div>
            `
            )
            .join('');
    }

    // 2. Tarjetas de Vidrio 3D de Proyectos en Escena 4
    const projectsGridEl = document.querySelector('#projects-glass-grid');
    if (projectsGridEl) {
        projectsGridEl.innerHTML = CONFIG.projects
            .map(
                (proj) => `
                <article class="project-glass-card" data-cursor="project">
                    <div class="project-card-capture">
                        ${buildProjectArtworkSVG(proj.visualType, proj.index)}
                        <span class="project-card-index">${proj.index}</span>
                    </div>
                    <div class="project-card-content">
                        <span class="project-card-subtitle">${proj.subtitle}</span>
                        <h3 class="project-card-title">${proj.title}</h3>
                        <p class="project-card-desc">${proj.description}</p>
                        <div class="project-card-chips" aria-label="Tecnologías utilizadas">
                            ${proj.technologies.map((t) => `<span>${t}</span>`).join('')}
                        </div>
                        <div class="project-card-actions">
                            <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="glass-btn primary-glass" data-cursor="link">
                                <span>Demo</span>
                                <span aria-hidden="true">↗</span>
                            </a>
                            <a href="${proj.codeUrl}" target="_blank" rel="noopener noreferrer" class="glass-btn" data-cursor="link">
                                <span>Código</span>
                                <span aria-hidden="true">{ }</span>
                            </a>
                        </div>
                    </div>
                </article>
            `
            )
            .join('');
    }

    // 3. Nodos del Proceso en Escena 5 (2 palabras por nodo)
    const processNodesEl = document.querySelector('#process-timeline-nodes');
    if (processNodesEl) {
        processNodesEl.innerHTML = CONFIG.processSteps
            .map(
                (item) => `
                <div class="process-node-card">
                    <span class="process-node-index">${item.step}</span>
                    <h3 class="process-node-title">${item.label}</h3>
                </div>
            `
            )
            .join('');
    }

    // 4. Enlaces de Contacto en Escena 6
    const socialsEl = document.querySelector('#contact-socials-list');
    if (socialsEl) {
        socialsEl.innerHTML = CONFIG.socials
            .map(
                (soc) => `
                <a href="${soc.url}" ${soc.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="contact-social-link" data-cursor="link">
                    <span class="social-platform">${soc.label}</span>
                    <span class="social-handle">${soc.handle}</span>
                </a>
            `
            )
            .join('');
    }
}

/**
 * Actualiza el indicador HUD cuando la cámara se acerca a un cristal de Skill en 3D
 */
export function updateActiveSkillBeacon(skillData) {
    const beaconTitle = document.querySelector('#active-skill-name');
    const beaconCategory = document.querySelector('#active-skill-category');
    const chips = document.querySelectorAll('[data-skill-chip]');

    if (!skillData) {
        if (beaconTitle) beaconTitle.textContent = 'Explora el campo de cristales';
        if (beaconCategory) beaconCategory.textContent = 'Desplaza el scroll para iluminar cada nodo';
        chips.forEach((c) => c.classList.remove('is-illuminated'));
        return;
    }

    if (beaconTitle) beaconTitle.textContent = skillData.name;
    if (beaconCategory) beaconCategory.textContent = skillData.category;

    chips.forEach((chip) => {
        const isMatch = chip.getAttribute('data-skill-chip') === skillData.id;
        chip.classList.toggle('is-illuminated', isMatch);
    });
}

/**
 * Configura las animaciones tipográficas con SplitType + GSAP ScrollTrigger
 */
export function setupScrollAnimations(gsap, ScrollTrigger, SplitType, onSceneEnter) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dividir titulares con SplitType para revelado por líneas/palabras con máscara
    if (SplitType && !prefersReducedMotion) {
        const splitTargets = document.querySelectorAll('[data-split]');
        splitTargets.forEach((target) => {
            const split = new SplitType(target, { types: 'lines,words' });
            gsap.from(split.words, {
                yPercent: 115,
                opacity: 0,
                duration: 1.15,
                ease: 'expo.out',
                stagger: 0.045,
                scrollTrigger: {
                    trigger: target,
                    start: 'top 84%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    // Parallax opuesto de las dos capas del nombre gigante en el Hero (delante y detrás del cristal 3D)
    const heroBackTitle = document.querySelector('.hero-title-back');
    const heroFrontTitle = document.querySelector('.hero-title-front');

    if (heroBackTitle && heroFrontTitle && !prefersReducedMotion) {
        gsap.to(heroBackTitle, {
            yPercent: -35,
            scale: 0.94,
            opacity: 0.15,
            ease: 'none',
            scrollTrigger: {
                trigger: '#scene-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        gsap.to(heroFrontTitle, {
            yPercent: -55,
            scale: 1.06,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#scene-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // Transición de zoom cinematográfico en Escena 3 ("Del diseño al código.")
    const fogPhrase = document.querySelector('.fog-cinematic-phrase');
    if (fogPhrase && !prefersReducedMotion) {
        gsap.fromTo(
            fogPhrase,
            { scale: 0.82, opacity: 0.15, letterSpacing: '0.28em' },
            {
                scale: 1.08,
                opacity: 1,
                letterSpacing: '0.06em',
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#scene-fog',
                    start: 'top 75%',
                    end: 'center center',
                    scrub: 1
                }
            }
        );
    }

    // Detectar cuál de las 6 escenas está activa para actualizar navegación y barra lateral
    const scenes = document.querySelectorAll('.cinema-scene');
    scenes.forEach((sceneEl, index) => {
        ScrollTrigger.create({
            trigger: sceneEl,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: () => onSceneEnter(index + 1, sceneEl.id),
            onEnterBack: () => onSceneEnter(index + 1, sceneEl.id)
        });
    });
}

/**
 * Interacción 3D Tilt en las tarjetas de Proyectos + Desenfoque de profundidad del fondo
 */
export function setupProjectCardsInteraction() {
    const cards = document.querySelectorAll('.project-glass-card');
    const grid = document.querySelector('#projects-glass-grid');

    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            document.body.classList.add('is-project-focused');
            if (grid) grid.classList.add('has-active-card');
            card.classList.add('is-hovered');
        });

        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.setProperty('--card-rx', `${rotateX.toFixed(2)}deg`);
            card.style.setProperty('--card-ry', `${rotateY.toFixed(2)}deg`);
            card.style.setProperty('--spot-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--spot-y', `${(y / rect.height) * 100}%`);
        });

        card.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-project-focused');
            if (grid) grid.classList.remove('has-active-card');
            card.classList.remove('is-hovered');
            card.style.setProperty('--card-rx', '0deg');
            card.style.setProperty('--card-ry', '0deg');
        });
    });
}

/**
 * Botón Magnético para el CTA gigante en Escena 6 ("Construyamos algo juntos")
 */
export function setupMagneticButtons(gsap) {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach((btn) => {
        const textSpan = btn.querySelector('.magnetic-btn-inner');

        btn.addEventListener('mousemove', (event) => {
            const rect = btn.getBoundingClientRect();
            const relX = event.clientX - (rect.left + rect.width / 2);
            const relY = event.clientY - (rect.top + rect.height / 2);

            gsap.to(btn, {
                x: relX * 0.36,
                y: relY * 0.36,
                duration: 0.35,
                ease: 'power3.out'
            });

            if (textSpan) {
                gsap.to(textSpan, {
                    x: relX * 0.18,
                    y: relY * 0.18,
                    duration: 0.35,
                    ease: 'power3.out'
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)'
            });

            if (textSpan) {
                gsap.to(textSpan, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.4)'
                });
            }
        });
    });
}
