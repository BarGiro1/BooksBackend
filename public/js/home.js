$(document).ready(function () {
     let books = []

    $.ajax({ 
        type: 'GET', 
        url: 'http://localhost:3001/books', 
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
            let author = $(this).find(".book-author").text().toLowerCase();

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
                <a href="book/${book._id}" class="text-decoration-none col-2 me-4 mb-4">
                    <div class="card book-card">
                        <img src="/api/placeholder/400/300" class="card-img-top" alt="${book.name}">
                        <div class="card-body">
                            <h5 class="card-title">${book.name}</h5>
                            <p class="card-text">Author: <span class="book-author">${book.author}</span></p>
                            <p class="card-text">Year: ${book.publicationYear}</p>
                            <p class="card-text">Pages: ${book.numOfPages}</p>
                            <p class="card-text">Price: ${book.price}</p>
                        </div>
                    </div>
                </a>
            `
        });
        booksContainer.html(html)

    }

});