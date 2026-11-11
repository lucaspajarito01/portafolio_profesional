/**
 * Módulo: Contacto, Copiado al Portapapeles y Envío Rápido (Correo / WhatsApp)
 * Responsabilidad: Facilitar la comunicación directa con feedback visual inmediato.
 */
(function (app) {
    function setupCopyButtons() {
        const copyButtons = document.querySelectorAll('[data-copy-value]');

        copyButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                const valueToCopy = button.getAttribute('data-copy-value') || '';
                const labelSpan = button.querySelector('.copy-btn-label');
                const originalText = labelSpan ? labelSpan.textContent : 'Copiar';

                if (!valueToCopy) return;

                try {
                    await navigator.clipboard.writeText(valueToCopy);
                    button.classList.add('is-copied');
                    if (labelSpan) {
                        labelSpan.textContent = '¡Copiado!';
                    }
                    setTimeout(() => {
                        button.classList.remove('is-copied');
                        if (labelSpan) {
                            labelSpan.textContent = originalText;
                        }
                    }, 2000);
                } catch {
                    if (valueToCopy.includes('@')) {
                        window.location.href = `mailto:${valueToCopy}`;
                    }
                }
            });
        });
    }

    function setupQuickContactForm() {
        const form = document.querySelector('#quick-contact-form');
        const feedback = document.querySelector('#form-feedback');
        const sendWhatsappBtn = document.querySelector('#send-whatsapp-btn');

        if (!form) return;

        const getFormValues = () => {
            const nameInput = form.querySelector('#sender-name');
            const subjectInput = form.querySelector('#sender-subject');
            const messageInput = form.querySelector('#sender-message');

            return {
                name: nameInput ? nameInput.value.trim() : '',
                subject: subjectInput ? subjectInput.value.trim() : 'Contacto desde Portafolio Web',
                message: messageInput ? messageInput.value.trim() : ''
            };
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const { name, subject, message } = getFormValues();

            if (!name || !message) {
                if (feedback) {
                    feedback.textContent = 'Por favor completa tu nombre y mensaje para continuar.';
                }
                return;
            }

            const emailSubject = encodeURIComponent(`${subject} — ${name}`);
            const emailBody = encodeURIComponent(
                `Hola Lucas,\n\nSoy ${name}.\n\n${message}\n\nEnviado desde tu portafolio profesional.`
            );

            if (feedback) {
                feedback.textContent = 'Abriendo tu cliente de correo para enviar el mensaje...';
            }

            window.location.href = `mailto:lucaspajarito2023@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        });

        if (sendWhatsappBtn) {
            sendWhatsappBtn.addEventListener('click', () => {
                const { name, subject, message } = getFormValues();
                const intro = name ? `Hola Lucas, soy *${name}*.` : 'Hola Lucas, vi tu portafolio web.';
                const topic = subject ? ` Te escribo por: *${subject}*.` : '';
                const body = message ? `\n\n${message}` : '\n\nMe gustaría conversar contigo.';
                const text = encodeURIComponent(`${intro}${topic}${body}`);

                window.open(`https://wa.me/50241234463?text=${text}`, '_blank', 'noopener,noreferrer');
            });
        }
    }

    function initContactModule() {
        setupCopyButtons();
        setupQuickContactForm();
    }

    app.initContactModule = initContactModule;
})((window.PortfolioApp = window.PortfolioApp || {}));

