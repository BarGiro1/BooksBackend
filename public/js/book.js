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
        },
        error: function(xhr, status, error) {
            $('#loading').addClass('d-none');
            $('#error').removeClass('d-none').text(`Error: ${error}`);
        }
    });

    $("#add-to-cart").on(click, function () {
        $.ajax({
            type: "method",
            url: "url",
            data: "data",
            dataType: "dataType",
            success: function (response) {
                
            }
        });
    });

});