/**
 * ============================================================================
 * SECTIONS.JS — Cuadritos Apuntadores Dinámicos 3D->2D para Skills,
 * Tarjetas Compactas de Proyectos con Imagen Relacionada y Parte 5 Reestructurada.
 * ============================================================================
 */

import { CONFIG } from './config.js';

/**
 * SVG de respaldo temático colorido en caso de que el navegador esté sin internet
 */
function buildFallbackDataUri(visualType, accentColor) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
        <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#151F42"/>
                <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.45"/>
            </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#g)"/>
        <circle cx="200" cy="100" r="55" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="6 4"/>
        <text x="200" y="106" text-anchor="middle" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="bold">${visualType.toUpperCase()}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Renderiza dinámicamente:
 * 1. Los Cuadritos Apuntadores de Skills (conectados en tiempo real a las gemas 3D)
 * 2. Las Tarjetas Compactas de Proyectos con Imagen Relacionada y Enlaces
 * 3. La Parte 5 (Proceso) Reestructurada como un Pipeline Conectado
 * 4. Los Enlaces de Contacto en Escena 6
 */
export function renderDynamicSections() {
    // 1. Capa de Cuadritos Apuntadores Dinámicos para Skills (Escena 2)
    const pointersLayer = document.querySelector('#skills-pointers-layer');
    if (pointersLayer) {
        const cardsHtml = CONFIG.skills
            .map(
                (skill, idx) => `
                <div class="skill-pointer-item" id="skill-pointer-${skill.id}" style="--skill-color: ${skill.color};" aria-hidden="true">
                    <!-- Punto de mira sobre la gema 3D -->
                    <div class="skill-target-reticle" id="reticle-${skill.id}">
                        <span class="reticle-core"></span>
                        <span class="reticle-ring"></span>
                    </div>

                    <!-- Línea SVG con flecha que apunta desde el cuadrito hacia la gema 3D -->
                    <svg class="skill-connector-svg" id="connector-${skill.id}" viewBox="0 0 180 80" preserveAspectRatio="none">
                        <path class="connector-line" d="M 10,40 L 135,40 L 170,40" />
                        <polygon class="connector-arrow" points="170,40 158,34 158,46" />
                    </svg>

                    <!-- Cuadrito flotante de la Skill -->
                    <article class="skill-callout-box">
                        <div class="callout-pointer-tip"></div>
                        <div class="callout-header">
                            <div class="callout-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="${skill.svgPath}" fill="currentColor" />
                                </svg>
                            </div>
                            <div class="callout-title-wrap">
                                <span class="callout-index">SKILL 0${idx + 1} // ${skill.level}</span>
                                <h3 class="callout-name">${skill.name}</h3>
                            </div>
                        </div>
                        <p class="callout-category">${skill.category}</p>
                        <p class="callout-detail">${skill.detail}</p>
                        <div class="callout-progress-track">
                            <div class="callout-progress-fill" style="width: ${skill.level};"></div>
                        </div>
                    </article>
                </div>
            `
            )
            .join('');

        pointersLayer.innerHTML = cardsHtml;
    }

    // 2. Tarjetas Compactas de Proyectos con Imagen Relacionada (Escena 4)
    const projectsGridEl = document.querySelector('#projects-glass-grid');
    if (projectsGridEl) {
        projectsGridEl.innerHTML = CONFIG.projects
            .map((proj) => {
                const fallbackUri = buildFallbackDataUri(proj.visualType, proj.accentColor);
                return `
                <article class="project-glass-card" style="--proj-accent: ${proj.accentColor};" data-cursor="project">
                    <div class="project-card-capture">
                        <img
                            src="${proj.image}"
                            alt="Imagen representativa de ${proj.title}"
                            class="project-related-img"
                            loading="lazy"
                            onerror="this.onerror=null;this.src='${fallbackUri}';"
                        />
                        <div class="project-capture-overlay"></div>
                        <span class="project-card-index">${proj.index}</span>
                        <span class="project-card-tag">${proj.subtitle}</span>
                    </div>
                    <div class="project-card-content">
                        <div>
                            <h3 class="project-card-title">${proj.title}</h3>
                            <p class="project-card-desc">${proj.description}</p>
                        </div>
                        <div>
                            <div class="project-card-chips" aria-label="Tecnologías utilizadas">
                                ${proj.technologies.map((t) => `<span>${t}</span>`).join('')}
                            </div>
                            <div class="project-card-actions">
                                <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="glass-btn primary-glass" data-cursor="link">
                                    <span>Explorar Proyecto</span>
                                    <span aria-hidden="true">↗</span>
                                </a>
                                <a href="${proj.codeUrl}" target="_blank" rel="noopener noreferrer" class="glass-btn" data-cursor="link">
                                    <span>GitHub</span>
                                    <span aria-hidden="true">{ }</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            })
            .join('');
    }

    // 3. Parte 5 Reestructurada: Pipeline Conectado de Proceso (Escena 5)
    const processNodesEl = document.querySelector('#process-timeline-nodes');
    if (processNodesEl) {
        processNodesEl.innerHTML = CONFIG.processSteps
            .map(
                (item, idx) => `
                <article class="process-pipeline-card" style="--step-color: ${item.color};">
                    <div class="pipeline-connector-bar" aria-hidden="true">
                        <span class="pipeline-dot"></span>
                        ${idx < CONFIG.processSteps.length - 1 ? '<span class="pipeline-line"></span>' : ''}
                    </div>
                    <div class="pipeline-card-body">
                        <div class="pipeline-top-row">
                            <div class="pipeline-icon-box">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="${item.iconPath}" fill="currentColor" />
                                </svg>
                            </div>
                            <span class="pipeline-step-badge">FASE ${item.step}</span>
                        </div>
                        <h3 class="pipeline-title">${item.label}</h3>
                        <p class="pipeline-desc">${item.description}</p>
                        <div class="pipeline-tags">
                            ${item.deliverables.map((d) => `<span>${d}</span>`).join('')}
                        </div>
                    </div>
                </article>
            `
            )
            .join('');
    }

    // 4. Enlaces de Contacto (Escena 6)
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
 * Posiciona dinámicamente cada Cuadrito Apuntador (Callout Box) en la pantalla
 * apuntando directamente a la posición 2D proyectada de su Gema 3D conforme avanza el scroll.
 */
export function updateSkillCalloutsPosition(projectedSkills, currentSceneIndex) {
    const counterBadge = document.querySelector('#skills-active-counter');
    const isMobile = window.innerWidth <= 768;

    // Verificar si estamos dentro del rango de la escena de Skills
    let activeCount = 0;
    let closestSkill = null;
    let maxProximity = 0;

    projectedSkills.forEach((item) => {
        const containerEl = document.querySelector(`#skill-pointer-${item.id}`);
        const reticleEl = document.querySelector(`#reticle-${item.id}`);
        if (!containerEl || !reticleEl) return;

        if (item.proximity > maxProximity) {
            maxProximity = item.proximity;
            closestSkill = item;
        }

        // Mostrar el cuadrito cuando la cámara se acerca a la gema en el scroll
        const shouldShow = item.visible && item.proximity > 0.14;

        if (!shouldShow) {
            containerEl.classList.remove('is-active');
            containerEl.style.opacity = '0';
            containerEl.style.pointerEvents = 'none';
            return;
        }

        activeCount++;
        containerEl.classList.add('is-active');
        const alpha = Math.min(1, item.proximity * 1.45);
        containerEl.style.opacity = alpha.toFixed(2);
        containerEl.style.pointerEvents = item.proximity > 0.45 ? 'auto' : 'none';

        // Posicionar punto de mira exactamente sobre la gema 3D
        const gemX = Math.max(40, Math.min(window.innerWidth - 40, item.screenX));
        const gemY = Math.max(80, Math.min(window.innerHeight - 80, item.screenY));

        containerEl.style.setProperty('--gem-x', `${gemX.toFixed(1)}px`);
        containerEl.style.setProperty('--gem-y', `${gemY.toFixed(1)}px`);
        containerEl.style.setProperty('--callout-scale', (0.88 + item.proximity * 0.14).toFixed(3));

        // Determinar si el cuadrito se ubica a la izquierda o derecha apuntando hacia la gema
        const isLeftGem = item.screenX < window.innerWidth * 0.5;
        containerEl.classList.toggle('points-from-right', !isLeftGem && !isMobile);
        containerEl.classList.toggle('points-from-left', isLeftGem && !isMobile);
    });

    if (counterBadge && closestSkill && maxProximity > 0.14) {
        counterBadge.textContent = `NODO 0${closestSkill.index + 1} / 0${CONFIG.skills.length} · ${closestSkill.data.name.toUpperCase()}`;
    } else if (counterBadge && currentSceneIndex === 2) {
        counterBadge.textContent = 'AVANZA CON EL SCROLL PARA APUNTAR A CADA SKILL';
    }
}

/**
 * Configura las animaciones con SplitType + GSAP ScrollTrigger
 */
export function setupScrollAnimations(gsap, ScrollTrigger, SplitType, onSceneEnter) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (SplitType && !prefersReducedMotion) {
        const splitTargets = document.querySelectorAll('[data-split]');
        splitTargets.forEach((target) => {
            const split = new SplitType(target, { types: 'lines,words' });
            gsap.from(split.words, {
                yPercent: 110,
                opacity: 0,
                duration: 1.0,
                ease: 'expo.out',
                stagger: 0.04,
                scrollTrigger: {
                    trigger: target,
                    start: 'top 86%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    const heroBackTitle = document.querySelector('.hero-title-back');
    const heroFrontTitle = document.querySelector('.hero-title-front');

    if (heroBackTitle && heroFrontTitle && !prefersReducedMotion) {
        gsap.to(heroBackTitle, {
            yPercent: -30,
            scale: 0.95,
            opacity: 0.18,
            ease: 'none',
            scrollTrigger: {
                trigger: '#scene-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        gsap.to(heroFrontTitle, {
            yPercent: -48,
            scale: 1.05,
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

    const fogPhrase = document.querySelector('.fog-cinematic-phrase');
    if (fogPhrase && !prefersReducedMotion) {
        gsap.fromTo(
            fogPhrase,
            { scale: 0.86, opacity: 0.2 },
            {
                scale: 1.05,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#scene-fog',
                    start: 'top 78%',
                    end: 'center center',
                    scrub: 1
                }
            }
        );
    }

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
 * Interacción 3D Tilt en las tarjetas compactas de Proyectos
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

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

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
 * Botón Magnético en Escena 6
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
                x: relX * 0.34,
                y: relY * 0.34,
                duration: 0.35,
                ease: 'power3.out'
            });

            if (textSpan) {
                gsap.to(textSpan, {
                    x: relX * 0.16,
                    y: relY * 0.16,
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
