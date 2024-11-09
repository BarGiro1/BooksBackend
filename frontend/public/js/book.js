$(document).ready(function() {
    console.log("asd");
    const bookId = $('#book-container').data('book-id');
    $.ajax({
        url: `http://127.0.0.1:3001/books/${bookId}`,
        method: 'GET',
        success: function(response) {
            const book = response;
            $('#book-container').removeClass('d-none')

            $('#bookName').text(book.name);
            $('#bookAuthor').text(`By ${book.author}`);
            $('#bookYear').text(`Published in ${book.publicationYear}`);
            $('#bookGenre').html(book.genre.map(g => `<span class="badge bg-secondary me-1 genre-badge">${g}</span>`).join(''));
            $('#bookPages').text(`${book.numOfPages} pages`);
            $('#bookPrice').text(`${book.price.toFixed(2)} $`);
            $('.add-to-cart-btn').attr({
                'data-price': book.price,
                'data-title': book.name,
                'data-author': book.author,
                'data-id': book._id
              });
        },
        error: function(xhr, status, error) {
            $('#loading').addClass('d-none');
            $('#error').removeClass('d-none').text(`Error: ${error}`);
        }
    });

    $(document).on('click', '.add-to-cart-btn', function (event) {
        event.preventDefault(); 
        event.stopPropagation(); 
        const title = $(this).data('title');
        const author = $(this).data('author');
        const price = $(this).data('price');
        const id = $(this).data('id');

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        console.log('Cart before adding:', cart);

        cart.push({ title, author, price, id });

        localStorage.setItem('cart', JSON.stringify(cart));

        alert(`${title} added to cart!`);
    });

});