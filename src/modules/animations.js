/**
 * Módulo: Animaciones, Efecto Typewriter, Reveal en Scroll e Interacción 3D
 * Responsabilidad: Dar dinamismo visual fluido respetando prefers-reduced-motion.
 */
(function (app) {
    function setupTypewriter(typewriterElement, prefersReducedMotion) {
        if (!typewriterElement || prefersReducedMotion) return;

        const roles = [
            'Técnico en Desarrollo de Software',
            'Desarrollo Backend con Node.js & Express',
            'Interfaces Modernas & Accesibles (WCAG AAA)',
            'Desarrollo Móvil con Flutter, Dart & Firebase',
            'Bases de Datos SQL, PostgreSQL & MySQL',
            'Integración de Inteligencia Artificial & Bots'
        ];

        let roleIndex = 0;
        let charIndex = roles[0].length;
        let isDeleting = false;

        const tick = () => {
            const currentPhrase = roles[roleIndex];

            if (!isDeleting) {
                charIndex++;
                typewriterElement.textContent = currentPhrase.slice(0, charIndex);
                if (charIndex >= currentPhrase.length) {
                    isDeleting = true;
                    setTimeout(tick, 2100);
                    return;
                }
                setTimeout(tick, 58);
            } else {
                charIndex--;
                typewriterElement.textContent = currentPhrase.slice(0, charIndex);
                if (charIndex <= 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(tick, 280);
                    return;
                }
                setTimeout(tick, 28);
            }
        };

        setTimeout(() => {
            isDeleting = true;
            tick();
        }, 2200);
    }

    function setupScrollReveal() {
        const revealItems = document.querySelectorAll('.reveal');
        if (revealItems.length === 0) return;

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.08 }
            );

            revealItems.forEach((item, index) => {
                item.style.transitionDelay = `${(index % 4) * 45}ms`;
                revealObserver.observe(item);
            });
        } else {
            revealItems.forEach((item) => item.classList.add('is-visible'));
        }
    }

    function setupCardInteractions(prefersReducedMotion) {
        const canUsePointer = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion;
        if (!canUsePointer) return;

        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach((card) => {
            card.addEventListener('mousemove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -1.8;
                const rotateY = ((x - centerX) / centerX) * 1.8;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                card.style.transform = `perspective(950px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    function initAnimationsModule() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const typewriterElement = document.querySelector('#typewriter-text');

        setupTypewriter(typewriterElement, prefersReducedMotion);
        setupScrollReveal();
        setupCardInteractions(prefersReducedMotion);
    }

    app.initAnimationsModule = initAnimationsModule;
})((window.PortfolioApp = window.PortfolioApp || {}));

