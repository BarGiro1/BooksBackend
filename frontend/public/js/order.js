document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('order-form');
    const paymentMethodSelect = document.getElementById('payment-method');
    const creditCardDetails = document.querySelector('.credit-card-details');
    const token = localStorage.token;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    isCartEmpty(cart)
    paymentMethodSelect.addEventListener('change', function () {
        creditCardDetails.style.display = paymentMethodSelect.value === 'credit-card' ? 'block' : 'none';
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return; 
        }

        const decodedToken = decodeToken(token)
        const userId = decodedToken.id;
        const orderPayload = {
            token: token,   
            user: userId,           
            order: {
                books: cart.map(book => book.id) 
            }
        };

        try {
            const response = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderPayload)
            });

            if (response.ok) {
                createOrder = await response.json()
                alert('Order successfully placed!');
                localStorage.removeItem('cart');
                window.location.href = '/home'; 
            } else {
                const errorData = await response.json();
                alert('Error placing order: ' + errorData.message);
            }
        } catch (error) {
            alert('Error placing order. Please try again.');
        }
    });
});
