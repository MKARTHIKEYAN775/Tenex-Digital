/* ========================================= */
/* SERVICES PAGE SCRIPT                      */
/* ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll to a service from the URL hash and briefly outline it
    const highlightFromHash = (delay) => {
        if (!window.location.hash) return;
        let targetElement = null;
        try {
            targetElement = document.querySelector(window.location.hash);
        } catch (e) {
            return;
        }
        if (!targetElement) return;

        setTimeout(() => {
            targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
            targetElement.style.borderColor = 'var(--accent-orange, var(--sv-lime))';
            setTimeout(() => {
                targetElement.style.borderColor = '';
            }, 2000);
        }, delay);
    };

    // On page load with a hash (e.g. services.html#seo)
    highlightFromHash(600);

    // When a hero orbit chip (or any in-page link) changes the hash
    window.addEventListener('hashchange', () => highlightFromHash(0));
});