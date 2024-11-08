$(document).ready(function () {
    addTableHeaders();
    fetchBooks();
    addNewBookRow();
    attachHeaderFilterEvents();
});

function addTableHeaders() {
    var headers = `
        <tr>
            <th>Name<br><input type="text" class="filter-input" data-column="0" placeholder="Search Name"></th>
            <th>Author<br><input type="text" class="filter-input" data-column="1" placeholder="Search Author"></th>
            <th>Year<br><input type="text" class="filter-input" data-column="2" placeholder="Search Year"></th>
            <th>Genre<br><input type="text" class="filter-input" data-column="3" placeholder="Search Genre"></th>
            <th>Pages<br><input type="text" class="filter-input" data-column="4" placeholder="Search Pages"></th>
            <th>Price<br><input type="text" class="filter-input" data-column="5" placeholder="Search Price"></th>
            <th>Actions</th>
        </tr>
    `;
    $('.books-table thead').html(headers);
}

function fetchBooks() {
    $.ajax({
        type: "POST",
        url: "http://localhost:3001/admin/books",
        success: function (response) {
            console.log(response);
            response.forEach(function(book) {
                addBookRow(book);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}

function addBookRow(book) {
    var row = $(`<tr data-book-id=${book._id}></tr>`);
    
    var nameCell = $('<td>' + book.name + '</td>');
    var authorCell = $('<td>' + book.author + '</td>');
    var yearCell = $('<td>' + book.publicationYear + '</td>');
    var genreCell = $('<td>' + book.genre.join(', ') + '</td>');
    var pagesCell = $('<td>' + book.numOfPages + '</td>');
    var priceCell = $('<td>' + book.price + '</td>');
    var actionCell = $('<td class="d-flex"><button class="btn btn-primary edit-btn me-2">Edit</button> <button class="btn btn-danger delete-btn">Delete</button></td>');
    
    row.append(nameCell, authorCell, yearCell, genreCell, pagesCell, priceCell, actionCell);
    
    $('.books').append(row);

    attachEditFunctionality(row, book);
    attachDeleteFunctionality(row, book);
}

function attachDeleteFunctionality(row, book) {
    row.find('.delete-btn').click(function() {
        if (confirm('Are you sure you want to delete this book?')) {
            deleteBook(book._id, row);
        }
    });
}

function attachEditFunctionality(row, book) {
    var nameCell = row.children().eq(0);
    var authorCell = row.children().eq(1);
    var yearCell = row.children().eq(2);
    var genreCell = row.children().eq(3);
    var pagesCell = row.children().eq(4);
    var priceCell = row.children().eq(5);
    var actionCell = row.children().eq(6);

    actionCell.find('.edit-btn').click(function() {
        // Replace text with input fields
        nameCell.html('<input type="text" name="name" value="' + book.name + '">');
        authorCell.html('<input type="text" name="author" value="' + book.author + '">');
        yearCell.html('<input type="number" name="publicationYear" value="' + book.publicationYear + '">');
        genreCell.html('<input type="text" name="genre" value="' + book.genre.join(', ') + '">');
        pagesCell.html('<input type="number" name="numOfPages" value="' + book.numOfPages + '">');
        priceCell.html('<input type="number" name="price" value="' + book.price + '">');
        actionCell.html('<button class="btn btn-success save-btn me-2">Save</button> <button class="btn btn-secondary cancel-btn">Cancel</button>');
        
        attachSaveCancelFunctionality(row, book);
    });
}

function attachSaveCancelFunctionality(row, book) {
    var nameCell = row.children().eq(0);
    var authorCell = row.children().eq(1);
    var yearCell = row.children().eq(2);
    var genreCell = row.children().eq(3);
    var pagesCell = row.children().eq(4);
    var priceCell = row.children().eq(5);
    var actionCell = row.children().eq(6);

    actionCell.find('.save-btn').click(function() {
        var updatedBook = {
            _id: book._id,
            name: nameCell.find('input[name="name"]').val(),
            author: authorCell.find('input[name="author"]').val(),
            publicationYear: parseInt(yearCell.find('input[name="publicationYear"]').val()),
            genre: genreCell.find('input[name="genre"]').val().split(',').map(g => g.trim()),
            numOfPages: parseInt(pagesCell.find('input[name="numOfPages"]').val()),
            price: parseFloat(priceCell.find('input[name="price"]').val())
        };

        updateBook(updatedBook, function() {
            nameCell.text(updatedBook.name);
            authorCell.text(updatedBook.author);
            yearCell.text(updatedBook.publicationYear);
            genreCell.text(updatedBook.genre.join(', '));
            pagesCell.text(updatedBook.numOfPages);
            priceCell.text(updatedBook.price);
            actionCell.html('<button class="btn btn-primary edit-btn me-2">Edit</button> <button class="btn btn-danger delete-btn">Delete</button>');

            attachEditFunctionality(row, updatedBook);
            attachDeleteFunctionality(row, updatedBook);
        });
    });

    actionCell.find('.cancel-btn').click(function() {
        nameCell.text(book.name);
        authorCell.text(book.author);
        yearCell.text(book.publicationYear);
        genreCell.text(book.genre.join(', '));
        pagesCell.text(book.numOfPages);
        priceCell.text(book.price);
        actionCell.html('<button class="btn btn-primary edit-btn me-2">Edit</button> <button class="btn btn-danger delete-btn">Delete</button>');

        attachEditFunctionality(row, book);
        attachDeleteFunctionality(row, book);
    });
}

function updateBook(updatedBook, callback) {
    $.ajax({
        type: "PUT",
        url: `http://localhost:3001/admin/books/${updatedBook._id}`,
        data: JSON.stringify({updatedBook}),
        contentType: "application/json",
        success: function (response) {
            showModal("Success", "Book updated successfully");
            callback();
        },
        error: function (xhr, status, error) {
            showModal("Error", xhr.responseJSON.message);
        }
    });
}

function addNewBookRow() {
    var newRow = $('<tr></tr>');
    
    var nameCell = $('<td><input type="text" id="new-book-name" placeholder="Name" class="form-control"></td>');
    var authorCell = $('<td><input type="text" id="new-book-author" placeholder="Author" class="form-control"></td>');
    var yearCell = $('<td><input type="number" id="new-book-year" placeholder="Year" class="form-control"></td>');
    var genreCell = $('<td><input type="text" id="new-book-genre" placeholder="Genre" class="form-control"></td>');
    var pagesCell = $('<td><input type="number" id="new-book-pages" placeholder="Pages" class="form-control"></td>');
    var priceCell = $('<td><input type="number" id="new-book-price" placeholder="Price" class="form-control"></td>');
    var addCell = $('<td><button class="btn btn-success" id="add-book-btn">Add</button></td>');
    
    newRow.append(nameCell, authorCell, yearCell, genreCell, pagesCell, priceCell, addCell);
    
    $('.books').prepend(newRow);

    $('#add-book-btn').on("click", function () {
        addBook();
    });
}

function addBook() {
    var newBook = {
        name: $('#new-book-name').val().trim(),
        author: $('#new-book-author').val().trim(),
        publicationYear: $('#new-book-year').val().trim(),
        genre: $('#new-book-genre').val().trim(),
        numOfPages: $('#new-book-pages').val().trim(),
        price: $('#new-book-price').val().trim()
    };

    var fieldMapping = {
        name: "Name",
        author: "Author",
        publicationYear: "Year",
        genre: "Genre",
        numOfPages: "Pages",
        price: "Price"
    };

    var missingFields = [];
    for (var key in newBook) {
        if (newBook[key] === "") {
            missingFields.push(fieldMapping[key]);
        }
    }

    if (missingFields.length > 0) {
        showModal("Error", "Please fill in all fields. Missing: " + missingFields.join(", "));
        return;
    }

    newBook.publicationYear = parseInt(newBook.publicationYear);
    newBook.numOfPages = parseInt(newBook.numOfPages);
    newBook.price = parseFloat(newBook.price);
    newBook.genre = newBook.genre.split(',').map(g => g.trim());

    $.ajax({
        type: "POST",
        url: "http://localhost:3001/admin/books/create",
        data: JSON.stringify({book: newBook}),
        contentType: "application/json",
        success: function (response) {
            console.log('Book added:', response);
            addBookRow(response);
            $('#new-book-name').val('');
            $('#new-book-author').val('');
            $('#new-book-year').val('');
            $('#new-book-genre').val('');
            $('#new-book-pages').val('');
            $('#new-book-price').val('');
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseJSON.message);
            showModal("There was a problem", xhr.responseJSON.message);
        }
    });
}

function attachHeaderFilterEvents() {
    $('.filter-input').on('keyup', function() {
        filterTable();
    });
}

function filterTable() {
    var filters = [];
    $('.filter-input').each(function() {
        filters.push($(this).val().toLowerCase());
    });

    $('.books tr').filter(function() {
        var row = $(this);
        var matches = true;

        row.children('td').each(function(index) {
            if (filters[index] && $(this).text().toLowerCase().indexOf(filters[index]) === -1) {
                matches = false;
                return false; // Break out of the loop
            }
        });

        row.toggle(matches);
    });
}

function deleteBook(bookId, row) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/admin/books/${bookId}`,
        success: function (response) {
            showModal("Success", "Book deleted successfully");
            row.remove();
        },
        error: function (xhr, status, error) {
            showModal("Error", "Failed to delete book: " + xhr.responseJSON.message);
        }
    });
}

function showModal(title, message) {
    // Implement your modal display logic here
    alert(title + ": " + message);
}