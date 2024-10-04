$(document).ready(function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        let html = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            html = `
                <div class="alert alert-warning text-center" role="alert">
                    Your cart is empty. Please select products and add them to the Cart
                </div>
            `;
        } else {
            cart.forEach((book, index) => {
                html += `
                    <div class="list-group-item d-flex justify-content-between align-items-center mb-3 shadow-sm p-3 bg-white rounded">
                        <div class="d-flex align-items-center">
                            <img src="${book.imageLink}" alt="${book.title}" class="img-fluid me-3">
                            <div>
                                <h5 class="mb-1">${book.title}</h5>
                                <p class="mb-0 text-muted">Author: ${book.author}</p>
                                <p class="mb-0 text-success">$${book.price}</p>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-outline-danger remove-item-btn" data-index="${index}">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
                totalPrice += parseFloat(book.price);
            });
        }

        $('#cart-items').html(html);
        $('#total-price').text(totalPrice.toFixed(2));
    }

    renderCart();

    $(document).on('click', '.remove-item-btn', function () {
        const index = $(this).data('index');
        cart.splice(index, 1); 
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });

    $('#checkout-btn').click(function () {
        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            window.location.href = '/order';
        }
    });
});
