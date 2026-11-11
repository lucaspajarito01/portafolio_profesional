/**
 * Módulo: Gestión de Tema (Modo Oscuro / Modo Claro)
 * Responsabilidad: Aplicar, alternar y persistir la preferencia visual del usuario.
 */
(function (app) {
    const THEME_STORAGE_KEY = 'lucas-portfolio-theme';

    function getSavedTheme() {
        try {
            const saved = localStorage.getItem(THEME_STORAGE_KEY);
            if (saved === 'light' || saved === 'dark') {
                return saved;
            }
        } catch {
            // Ignorar si el almacenamiento local está restringido
        }
        return 'dark';
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // Ignorar errores de escritura en localStorage
        }
    }

    function applyThemeState(theme, elements) {
        const validTheme = theme === 'light' ? 'light' : 'dark';
        elements.root.setAttribute('data-theme', validTheme);

        if (elements.themeLabel) {
            elements.themeLabel.textContent = validTheme === 'dark' ? 'Modo Oscuro' : 'Modo Claro';
        }

        if (elements.themeToggle) {
            elements.themeToggle.setAttribute(
                'aria-label',
                validTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
            );
        }

        if (elements.themeColorMeta) {
            elements.themeColorMeta.setAttribute(
                'content',
                validTheme === 'dark' ? '#080a11' : '#f6f7fb'
            );
        }
    }

    function initThemeModule() {
        const elements = {
            root: document.documentElement,
            themeToggle: document.querySelector('#theme-toggle'),
            themeLabel: document.querySelector('#theme-label'),
            themeColorMeta: document.querySelector('#theme-color-meta')
        };

        applyThemeState(getSavedTheme(), elements);

        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => {
                const current = elements.root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                const next = current === 'dark' ? 'light' : 'dark';
                applyThemeState(next, elements);
                saveTheme(next);
            });
        }
    }

    app.initThemeModule = initThemeModule;
})((window.PortfolioApp = window.PortfolioApp || {}));

