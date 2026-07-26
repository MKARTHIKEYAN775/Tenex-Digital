/* ========================================= */
/* SERVICES PAGE SCRIPT                      */
/* ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll if landing with hash fragment
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetElement.style.borderColor = 'var(--accent-orange)';
                setTimeout(() => {
                    targetElement.style.borderColor = '';
                }, 2000);
            }, 600);
        }
    }
});