/**
 * Módulo: Filtros Interactivos (Skills, Proyectos y Pestañas de Datos)
 * Responsabilidad: Organizar y filtrar dinámicamente las secciones sin recargar la página.
 */
(function (app) {
    function setupSkillsFilter() {
        const filterButtons = document.querySelectorAll('[data-skill-filter]');
        const skillBlocks = document.querySelectorAll('[data-category-group]');

        if (filterButtons.length === 0 || skillBlocks.length === 0) return;

        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const selectedFilter = button.getAttribute('data-skill-filter') || 'all';

                filterButtons.forEach((btn) => {
                    const isSelected = btn === button;
                    btn.classList.toggle('is-active', isSelected);
                    btn.setAttribute('aria-selected', String(isSelected));
                });

                skillBlocks.forEach((block) => {
                    const group = block.getAttribute('data-category-group');
                    const visible = selectedFilter === 'all' || group === selectedFilter;
                    block.classList.toggle('is-hidden', !visible);
                });
            });
        });
    }

    function setupProjectsFilter() {
        const projectButtons = document.querySelectorAll('[data-project-filter]');
        const projectCards = document.querySelectorAll('[data-project-category]');

        if (projectButtons.length === 0 || projectCards.length === 0) return;

        projectButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const selectedCategory = button.getAttribute('data-project-filter') || 'all';

                projectButtons.forEach((btn) => {
                    const isSelected = btn === button;
                    btn.classList.toggle('is-active', isSelected);
                    btn.setAttribute('aria-selected', String(isSelected));
                });

                projectCards.forEach((card) => {
                    const categories = (card.getAttribute('data-project-category') || '').split(' ');
                    const visible = selectedCategory === 'all' || categories.includes(selectedCategory);
                    card.classList.toggle('is-hidden', !visible);
                });
            });
        });
    }

    function setupDataLabTabs() {
        const labTabs = document.querySelectorAll('[data-lab-tab]');
        const labPanels = document.querySelectorAll('[data-lab-panel]');

        if (labTabs.length === 0 || labPanels.length === 0) return;

        labTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-lab-tab');

                labTabs.forEach((t) => {
                    const isSelected = t === tab;
                    t.classList.toggle('is-active', isSelected);
                    t.setAttribute('aria-selected', String(isSelected));
                });

                labPanels.forEach((panel) => {
                    const isMatch = panel.getAttribute('data-lab-panel') === target;
                    panel.classList.toggle('is-active', isMatch);
                });
            });
        });
    }

    function initFiltersModule() {
        setupSkillsFilter();
        setupProjectsFilter();
        setupDataLabTabs();
    }

    app.initFiltersModule = initFiltersModule;
})((window.PortfolioApp = window.PortfolioApp || {}));

