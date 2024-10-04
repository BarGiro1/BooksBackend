$(document).ready(function () {
     let books = []

    $.ajax({ 
        type: 'GET', 
        url: 'books.json', 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (data) { 
            books = data;
            renderBooks()
        }
    });
    
    $("#search-bar").on("keyup", function () {
        let searchTerm = $(this).val().toLowerCase();

        $(".book-card").each(function () {
            let title = $(this).find(".card-title").text().toLowerCase();
            let author = $(this).find(".card-text").first().text().toLowerCase();
            let price = $(this).find(".card-text").first().text().toLowerCase();

            if (title.includes(searchTerm) || author.includes(searchTerm)) {
                $(this).show();  
            } else {
                $(this).hide(); 
            }
        });
        
        
        
    });

    function renderBooks() {
        console.log(books);
        let html = ''
        booksContainer = $('.books-continer')

        $.each(books, function (index, book) { 
            console.log(book.author);
            html += `
            <div class="card book-card col-2 me-4 mb-4">
                <img src="/api/placeholder/400/300" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">Author: ${book.author}</p>
                    <p class="card-text">Year: ${book.year}</p>
                    <p>Price: $${book.price}</p>
                    <button class="add-to-cart-btn" data-price=${book.price} data-title="${book.title}" data-author="${book.author}">Add to Cart</button>

                </div>
            </div>
            `
        });
        booksContainer.html(html)

    }

    $(document).on('click', '.add-to-cart-btn', function () {
        const title = $(this).data('title');
        const author = $(this).data('author');
        const price = $(this).data('price');


        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        console.log('Cart before adding:', cart);

        cart.push({ title, author, price });

        localStorage.setItem('cart', JSON.stringify(cart));

        alert(`${title} added to cart!`);
    });

});