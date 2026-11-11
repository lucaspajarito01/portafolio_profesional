/**
 * Punto de Entrada Principal del Portafolio de Lucas Samuel Pajarito Surek
 * Orquesta la inicialización ordenada de todos los módulos funcionales.
 */
(function () {
    document.documentElement.classList.add('js-enabled');

    function bootstrapPortfolio() {
        const app = window.PortfolioApp || {};

        if (typeof app.initThemeModule === 'function') {
            app.initThemeModule();
        }

        if (typeof app.initNavigationModule === 'function') {
            app.initNavigationModule();
        }

        if (typeof app.initAnimationsModule === 'function') {
            app.initAnimationsModule();
        }

        if (typeof app.initFiltersModule === 'function') {
            app.initFiltersModule();
        }

        if (typeof app.initContactModule === 'function') {
            app.initContactModule();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrapPortfolio);
    } else {
        bootstrapPortfolio();
    }
})();
