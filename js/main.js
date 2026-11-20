/**
 * ============================================================================
 * MAIN.JS — Orquestador Principal
 * Sincroniza Lenis + GSAP ScrollTrigger + Three.js en un único requestAnimationFrame,
 * y enlaza la proyección 3D->2D de las gemas de Skills con sus cuadritos apuntadores.
 * ============================================================================
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';

import { ExperienceScene } from './scene.js';
import {
    renderDynamicSections,
    updateSkillCalloutsPosition,
    setupScrollAnimations,
    setupProjectCardsInteraction,
    setupMagneticButtons
} from './sections.js';

gsap.registerPlugin(ScrollTrigger);

class ImmersivePortfolioApp {
    constructor() {
        this.scene3D = null;
        this.lenis = null;
        this.currentSceneIndex = 1;
        this.isMotionPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.cursor = {
            dot: document.querySelector('#cursor-dot'),
            ring: document.querySelector('#cursor-ring'),
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            ringX: window.innerWidth / 2,
            ringY: window.innerHeight / 2
        };

        this.keyBuffer = '';
        this.devConsoleOpen = false;

        this.init();
    }

    init() {
        renderDynamicSections();
        this.setupLoaderAndWebGL();
        this.setupSmoothScroll();

        setupScrollAnimations(gsap, ScrollTrigger, SplitType, (sceneNumber) => {
            this.currentSceneIndex = sceneNumber;
            this.updateActiveSceneIndicator(sceneNumber);
        });
        setupProjectCardsInteraction();
        setupMagneticButtons(gsap);

        this.setupCustomCursor();
        this.setupHudControls();
        this.setupDevEasterEgg();
        this.startSharedRafLoop();
    }

    setupLoaderAndWebGL() {
        const loaderEl = document.querySelector('#terminal-loader');
        const loaderPercentEl = document.querySelector('#loader-percent');
        const loaderBarEl = document.querySelector('#loader-bar-fill');
        const loaderStatusEl = document.querySelector('#loader-status-msg');
        const canvas = document.querySelector('#webgl-canvas');

        let displayedProgress = 0;

        const updateLoaderUI = (targetPct, statusText) => {
            if (loaderStatusEl && statusText) {
                loaderStatusEl.textContent = statusText;
            }
            gsap.to(
                { val: displayedProgress },
                {
                    val: targetPct,
                    duration: 0.4,
                    ease: 'power2.out',
                    onUpdate: function () {
                        displayedProgress = Math.round(this.targets()[0].val);
                        if (loaderPercentEl) {
                            loaderPercentEl.textContent = `compilando experiencia… ${displayedProgress}%`;
                        }
                        if (loaderBarEl) {
                            loaderBarEl.style.width = `${displayedProgress}%`;
                        }
                    },
                    onComplete: () => {
                        if (targetPct >= 100 && loaderEl) {
                            setTimeout(() => {
                                loaderEl.classList.add('is-complete');
                                loaderEl.setAttribute('aria-hidden', 'true');
                            }, 320);
                        }
                    }
                }
            );
        };

        if (ExperienceScene.isWebGLAvailable() && canvas) {
            this.scene3D = new ExperienceScene(canvas, {
                onProgress: (pct, msg) => updateLoaderUI(pct, msg),
                onSkillScreenPositions: (projectedSkills, cameraZ) => {
                    updateSkillCalloutsPosition(projectedSkills, this.currentSceneIndex, cameraZ);
                }
            });
        } else {
            document.documentElement.classList.add('no-webgl');
            updateLoaderUI(100, 'modo fallback activado · sin WebGL');
        }
    }

    setupSmoothScroll() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: !this.isMotionPaused,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.5
        });

        const lateralFill = document.querySelector('#lateral-progress-fill');
        const depthReadout = document.querySelector('#hud-camera-z');

        this.lenis.on('scroll', (e) => {
            ScrollTrigger.update();

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY || window.pageYOffset;
            const progress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
            const velocity = e && typeof e.velocity === 'number' ? e.velocity : 0;

            if (lateralFill) {
                lateralFill.style.height = `${(progress * 100).toFixed(1)}%`;
            }

            if (this.scene3D) {
                this.scene3D.setScrollState(progress, velocity);
                if (depthReadout) {
                    depthReadout.textContent = `Z: ${this.scene3D.cameraTargetZ.toFixed(1)}m`;
                }
            }
        });

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                const targetId = anchor.getAttribute('href');
                const targetEl = targetId ? document.querySelector(targetId) : null;
                if (targetEl && this.lenis) {
                    event.preventDefault();
                    this.lenis.scrollTo(targetEl, { offset: 0, duration: 1.3 });
                }
            });
        });
    }

    updateActiveSceneIndicator(sceneIndex) {
        const formatted = `0${sceneIndex}`;
        const activeSceneNum = document.querySelector('#hud-scene-number');
        if (activeSceneNum) {
            activeSceneNum.textContent = formatted;
        }

        document.querySelectorAll('[data-scene-dot]').forEach((dot) => {
            const dotIndex = Number(dot.getAttribute('data-scene-dot'));
            dot.classList.toggle('is-active', dotIndex === sceneIndex);
        });

        document.querySelectorAll('.top-nav-links a').forEach((link, idx) => {
            link.classList.toggle('is-active', idx + 1 === sceneIndex);
        });
    }

    setupCustomCursor() {
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        if (!hasFinePointer || !this.cursor.dot || !this.cursor.ring) return;

        window.addEventListener(
            'mousemove',
            (event) => {
                this.cursor.x = event.clientX;
                this.cursor.y = event.clientY;
            },
            { passive: true }
        );

        const interactives = document.querySelectorAll('a, button, [data-cursor]');
        interactives.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                const cursorType = el.getAttribute('data-cursor') || 'link';
                this.cursor.ring.classList.add('is-expanded');
                this.cursor.ring.setAttribute('data-state', cursorType);
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.ring.classList.remove('is-expanded');
                this.cursor.ring.removeAttribute('data-state');
            });
        });
    }

    setupHudControls() {
        const pauseBtn = document.querySelector('#pause-motion-btn');
        const pauseLabel = document.querySelector('#pause-motion-label');

        const syncPauseState = () => {
            document.body.classList.toggle('is-motion-paused', this.isMotionPaused);
            if (this.scene3D) {
                this.scene3D.setPaused(this.isMotionPaused);
            }
            if (pauseBtn) {
                pauseBtn.setAttribute('aria-pressed', String(this.isMotionPaused));
            }
            if (pauseLabel) {
                pauseLabel.textContent = this.isMotionPaused ? 'Reanudar movimiento' : 'Pausar movimiento';
            }
        };

        syncPauseState();

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.isMotionPaused = !this.isMotionPaused;
                syncPauseState();
            });
        }

        const themeBtn = document.querySelector('#theme-mode-btn');
        const themeLabel = document.querySelector('#theme-mode-label');

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                const nextTheme = isLight ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', nextTheme);

                if (themeLabel) {
                    themeLabel.textContent = nextTheme === 'light' ? 'Modo Claro' : 'Modo Cósmico';
                }
                if (this.scene3D) {
                    this.scene3D.setThemePalette(nextTheme === 'light');
                }
            });
        }
    }

    setupDevEasterEgg() {
        const consoleOverlay = document.querySelector('#dev-console-overlay');
        const closeBtn = document.querySelector('#close-dev-console');
        const triggerBtn = document.querySelector('#open-dev-console-btn');

        const toggleConsole = (forceState) => {
            this.devConsoleOpen = typeof forceState === 'boolean' ? forceState : !this.devConsoleOpen;
            if (consoleOverlay) {
                consoleOverlay.classList.toggle('is-open', this.devConsoleOpen);
                consoleOverlay.setAttribute('aria-hidden', String(!this.devConsoleOpen));
            }
        };

        window.addEventListener('keydown', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

            if (event.key === '`' || event.key === '~') {
                event.preventDefault();
                toggleConsole();
                return;
            }

            if (event.key === 'Escape' && this.devConsoleOpen) {
                toggleConsole(false);
                return;
            }

            this.keyBuffer = (this.keyBuffer + event.key.toLowerCase()).slice(-3);
            if (this.keyBuffer === 'dev') {
                toggleConsole();
                this.keyBuffer = '';
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => toggleConsole(false));
        }

        if (triggerBtn) {
            triggerBtn.addEventListener('click', () => toggleConsole());
        }
    }

    startSharedRafLoop() {
        const devFpsEl = document.querySelector('#dev-fps-val');
        const devCamZEl = document.querySelector('#dev-camz-val');
        const devCallsEl = document.querySelector('#dev-drawcalls-val');

        const raf = (time) => {
            if (this.lenis) {
                this.lenis.raf(time);
            }

            if (this.scene3D) {
                this.scene3D.update();

                if (this.devConsoleOpen) {
                    if (devFpsEl) devFpsEl.textContent = `${this.scene3D.fps} FPS`;
                    if (devCamZEl) devCamZEl.textContent = `${this.scene3D.cameraCurrentZ.toFixed(2)}m`;
                    if (devCallsEl && this.scene3D.renderer) {
                        devCallsEl.textContent = String(this.scene3D.renderer.info.render.calls);
                    }
                }
            }

            if (this.cursor.dot && this.cursor.ring) {
                this.cursor.ringX += (this.cursor.x - this.cursor.ringX) * 0.16;
                this.cursor.ringY += (this.cursor.y - this.cursor.ringY) * 0.16;

                this.cursor.dot.style.transform = `translate3d(${this.cursor.x}px, ${this.cursor.y}px, 0)`;
                this.cursor.ring.style.transform = `translate3d(${this.cursor.ringX}px, ${this.cursor.ringY}px, 0)`;
            }

            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new ImmersivePortfolioApp();
});
