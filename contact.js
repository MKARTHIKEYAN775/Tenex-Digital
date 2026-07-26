/* ========================================= */
/* CONTACT PAGE INTAKE FORM SCRIPT           */
/* ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const intakeForm = document.getElementById('deepIntakeForm');
    const successMsg = document.getElementById('formSuccessMessage');

    if(intakeForm) {
        intakeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather all input data to verify completion
            const formData = new FormData(intakeForm);
            const dataObj = {};
            formData.forEach((value, key) => {
                if(!dataObj[key]) {
                    dataObj[key] = value;
                } else {
                    if(!Array.isArray(dataObj[key])) {
                        dataObj[key] = [dataObj[key]];
                    }
                    dataObj[key].push(value);
                }
            });

            console.log('User Complete Intake Profile:', dataObj);

            // Show success alert
            intakeForm.reset();
            successMsg.classList.remove('hidden');
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 8000);
        });
    }
});