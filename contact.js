/* ========================================= */
/* CONTACT PAGE INTAKE FORM SCRIPT           */
/* ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const intakeForm = document.getElementById('deepIntakeForm');
    const successMsg = document.getElementById('formSuccessMessage');

    if(intakeForm) {
        intakeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Custom validation: Ensure at least one service checkbox is selected
            const servicesChecked = intakeForm.querySelectorAll('input[name="servicesNeeded"]:checked');
            if (servicesChecked.length === 0) {
                alert('Please select at least one service you need help with.');
                return;
            }

            // Gather all input data
            const formData = new FormData(intakeForm);
            const dataObj = {};
            
            formData.forEach((value, key) => {
                if (key !== 'servicesNeeded') {
                    dataObj[key] = value;
                }
            });

            // Map all checked services into an array
            dataObj.servicesNeeded = Array.from(servicesChecked).map(cb => cb.value);

            const submitBtn = intakeForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            try {
                // UI Loading State
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting to Database...';

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
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

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