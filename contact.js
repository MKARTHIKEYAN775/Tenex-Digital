/* ========================================= */
/* CONTACT PAGE INTAKE FORM SCRIPT           */
/* ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const intakeForm = document.getElementById('deepIntakeForm');
    const successMsg = document.getElementById('formSuccessMessage');

    if(intakeForm) {
        intakeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Gather the three input fields: fullName, workEmail, phoneNum
            const formData = new FormData(intakeForm);
            const dataObj = {};

            formData.forEach((value, key) => {
                dataObj[key] = value.trim();
            });

            const submitBtn = intakeForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            try {
                // UI Loading State
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                // Send data to PHP backend
                const response = await fetch('backend/submit_intake.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataObj)
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.error || 'Submission failed');
                }

                console.log('Database Success Response:', result.message);

                // Reset form and show success message
                intakeForm.reset();
                successMsg.classList.remove('hidden');

                // Wait one frame so the browser has reflowed after the
                // classList change before we measure positions. We scroll
                // manually (instead of successMsg.scrollIntoView) because
                // scrollIntoView's centering ignores the fixed header —
                // it treats the full viewport height as available space,
                // so the target can end up landing partly behind the
                // header. Subtracting the header's real height here keeps
                // the success message fully visible below it.
                requestAnimationFrame(() => {
                    const header = document.getElementById('header');
                    const headerOffset = header ? header.offsetHeight : 0;
                    const extraGap = 20; // small breathing room below the header

                    const elementTop = successMsg.getBoundingClientRect().top + window.scrollY;
                    const targetScroll = elementTop - headerOffset - extraGap;

                    window.scrollTo({
                        top: Math.max(targetScroll, 0),
                        behavior: 'smooth'
                    });
                });

                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 8000);

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Oops! Something went wrong while saving your details: ' + error.message);
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});