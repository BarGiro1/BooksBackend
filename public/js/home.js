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
                    <p class="card-text">Pages: ${book.pages}</p>
                </div>
            </div>
            `
        });
        booksContainer.html(html)

    }

});