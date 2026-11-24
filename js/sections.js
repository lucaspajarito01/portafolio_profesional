/**
 * ============================================================================
 * SECTIONS.JS — Cuadrito Apuntador Único Sin Colisiones (3D->2D)
 * y Tarjetas Compactas de Proyectos con Imagen Relacionada.
 * ============================================================================
 */

import { CONFIG } from './config.js';

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

    // 3. Enlaces de Contacto (Escena 5)
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
 * Muestra ÚNICAMENTE el cuadrito apuntador de la gema 3D más cercana en foco,
 * y solo cuando la cámara ya salió del Hero y está dentro del corredor de Skills.
 * Esto evita que dos cuadritos se encimen o choquen con los textos del Hero.
 */
export function updateSkillCalloutsPosition(projectedSkills, currentSceneIndex, cameraZ = 12) {
    const counterBadge = document.querySelector('#skills-active-counter');
    const skillsHeader = document.querySelector('.skills-sticky-header');
    const isMobile = window.innerWidth <= 768;

    // Solo permitir cuadritos apuntadores dentro del corredor Z de Skills (-14.5m a -126m)
    const inSkillsCorridor = cameraZ < -14.5 && cameraZ > -126;

    // Encontrar únicamente la gema activa con mayor proximidad al punto focal
    let activeHeroGem = null;
    let bestProximity = 0;

    if (inSkillsCorridor) {
        projectedSkills.forEach((item) => {
            if (item.visible && item.proximity > bestProximity) {
                bestProximity = item.proximity;
                activeHeroGem = item;
            }
        });
    }

    projectedSkills.forEach((item) => {
        const containerEl = document.querySelector(`#skill-pointer-${item.id}`);
        if (!containerEl) return;

        const isTheSingleActiveGem = activeHeroGem && activeHeroGem.id === item.id && bestProximity > 0.22;

        if (!isTheSingleActiveGem) {
            containerEl.classList.remove('is-active');
            containerEl.style.opacity = '0';
            containerEl.style.pointerEvents = 'none';
            return;
        }

        containerEl.classList.add('is-active');
        const alpha = Math.min(1, (item.proximity - 0.15) * 1.65);
        containerEl.style.opacity = alpha.toFixed(2);
        containerEl.style.pointerEvents = 'auto';

        // Mantener el recuadro debajo del banner sticky, incluso cuando se divide en varias líneas.
        const scale = 0.92 + item.proximity * 0.08;
        const calloutHeight = containerEl.querySelector('.skill-callout-box').offsetHeight * scale;
        const headerBottom = skillsHeader.getBoundingClientRect().bottom;
        const calloutTopOffset = isMobile ? 52 * scale : -calloutHeight / 2;
        const minY = Math.max(230, headerBottom + 16 - calloutTopOffset);
        const maxY = Math.max(260, window.innerHeight - 140);
        const safeX = Math.max(90, Math.min(window.innerWidth - 90, item.screenX));
        const safeY = Math.max(minY, Math.min(maxY, item.screenY));

        containerEl.style.setProperty('--gem-x', `${safeX.toFixed(1)}px`);
        containerEl.style.setProperty('--gem-y', `${safeY.toFixed(1)}px`);
        containerEl.style.setProperty('--callout-scale', scale.toFixed(3));

        // Si la gema está en la mitad izquierda, el cuadrito se despliega a su derecha apuntando hacia la gema
        const isLeftGem = item.data.side === 'left' || safeX < window.innerWidth * 0.5;
        containerEl.classList.toggle('points-from-left', isLeftGem && !isMobile);
        containerEl.classList.toggle('points-from-right', !isLeftGem && !isMobile);
    });

    if (counterBadge) {
        if (activeHeroGem && bestProximity > 0.22) {
            counterBadge.textContent = `NODO 0${activeHeroGem.index + 1} / 0${CONFIG.skills.length} · ${activeHeroGem.data.name.toUpperCase()}`;
        } else {
            counterBadge.textContent = 'DESPLAZA EL SCROLL PARA APUNTAR A CADA GEMA 3D';
        }
    }
}

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
    const heroCaptionBox = document.querySelector('.hero-caption-box');

    if (heroBackTitle && heroFrontTitle && !prefersReducedMotion) {
        gsap.to(heroBackTitle, {
            yPercent: -35,
            scale: 0.94,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#scene-hero',
                start: 'top top',
                end: '75% top',
                scrub: true
            }
        });

        gsap.to(heroFrontTitle, {
            yPercent: -50,
            scale: 1.04,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#scene-hero',
                start: 'top top',
                end: '75% top',
                scrub: true
            }
        });
    }

    // Desvanecer rápidamente el subtítulo del Hero al iniciar el scroll para que nunca choque con Skills
    if (heroCaptionBox && !prefersReducedMotion) {
        gsap.to(heroCaptionBox, {
            y: -45,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#scene-hero',
                start: '10% top',
                end: '55% top',
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
