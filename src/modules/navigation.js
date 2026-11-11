/**
 * Módulo: Navegación, Menú Responsivo y Progreso de Lectura
 * Responsabilidad: Controlar el menú móvil, el indicador de scroll y el enlace activo por sección.
 */
(function (app) {
    function setupMobileMenu(menuToggle, navigation, navigationLinks) {
        if (!menuToggle || !navigation) return;

        const closeMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menú');
            navigation.classList.remove('is-open');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
            navigation.classList.toggle('is-open', !isOpen);
        });

        navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    function setupScrollProgressBar(scrollProgress) {
        if (!scrollProgress) return;

        const updateBar = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
            scrollProgress.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', updateBar, { passive: true });
        updateBar();
    }

    function setupActiveSectionObserver(navigationLinks) {
        if (!('IntersectionObserver' in window) || navigationLinks.length === 0) return;

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        navigationLinks.forEach((link) => {
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.setAttribute('aria-current', 'location');
                            } else {
                                link.removeAttribute('aria-current');
                            }
                        });
                    }
                });
            },
            { rootMargin: '-22% 0px -62% 0px' }
        );

        document.querySelectorAll('main section[id]').forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    function initNavigationModule() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navigation = document.querySelector('.navigation');
        const navigationLinks = document.querySelectorAll('.nav-links a');
        const scrollProgress = document.querySelector('#scroll-progress');
        const currentYear = document.querySelector('#current-year');

        if (currentYear) {
            currentYear.textContent = String(new Date().getFullYear());
        }

        setupMobileMenu(menuToggle, navigation, navigationLinks);
        setupScrollProgressBar(scrollProgress);
        setupActiveSectionObserver(navigationLinks);
    }

    app.initNavigationModule = initNavigationModule;
})((window.PortfolioApp = window.PortfolioApp || {}));

