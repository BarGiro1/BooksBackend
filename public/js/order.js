document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('order-form');
    const paymentMethodSelect = document.getElementById('payment-method');
    const creditCardDetails = document.querySelector('.credit-card-details');

    paymentMethodSelect.addEventListener('change', function () {
        if (paymentMethodSelect.value === 'credit-card') {
            creditCardDetails.style.display = 'block';  
        } 
    });

    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
});
