const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const navigationLinks = document.querySelectorAll('.nav-links a');
const currentYear = document.querySelector('#current-year');

document.documentElement.classList.add('js-enabled');

if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}

if (menuToggle && navigation) {
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
        if (event.key === 'Escape') {
            closeMenu();
            menuToggle.focus();
        }
    });
}

const revealItems = document.querySelectorAll(
    '.section-heading, .about-card, .project-card, .skills-grid span, .contact-box'
);

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item, index) => {
        item.classList.add('reveal');
        item.style.transitionDelay = `${(index % 4) * 70}ms`;
        revealObserver.observe(item);
    });

    const sectionObserver = new IntersectionObserver((entries) => {
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
    }, { rootMargin: '-25% 0px -65% 0px' });

    document.querySelectorAll('main section[id]').forEach((section) => {
        sectionObserver.observe(section);
    });
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}
