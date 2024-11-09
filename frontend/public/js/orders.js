$(document).ready(function () {
    $.ajax({
        url: "http://localhost:3001/orders", 
        type: "GET",
        success: function(orders) {
            console.log(orders);
            orders.forEach(order => {
                $.ajax({
                    url: `http://localhost:3001/users/${order.user}`,
                    type: "GET",
                    success: function(user) {
                        let orderLink = $('<a class="nav-link"></a>');
                        orderLink.text(`User: ${user.name}`);
                        orderLink.attr('data-order-id', order._id);

                        $('#orderNav').append(orderLink);

                        orderLink.on('click', function() {
                            displayOrderDetails(order);
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        showModal("Error Fetching User", `Error fetching user: ${textStatus} - ${errorThrown}`);
                    }
                });
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showModal("Error Fetching Orders", `Error fetching orders: ${textStatus} - ${errorThrown}`);
        }
    });

    function displayOrderDetails(order) {
        $('#orderDetails').empty();

        $.ajax({
            url: `http://localhost:3001/users/${order.user}`,
            type: "GET",
            success: function(user) {
                let books = [];
                let bookIndex = 0;
        
                function fetchNextBook() {
                    if (bookIndex < order.books.length) {
                        let bookId = order.books[bookIndex];
                        $.ajax({
                            url: `http://127.0.0.1:3001/books/${bookId}`,
                            type: "GET",
                            success: function(book) {
                                books.push(book);
                                bookIndex++;
                                fetchNextBook(); // Fetch the next book
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                showModal("Error Fetching Book", `Book with ID ${bookId} not found: ${textStatus} - ${errorThrown}`);
                                bookIndex++;
                                fetchNextBook(); // Continue with the next book even if this one fails
                            }
                        });
                    } else {
                        // All books have been processed, render the order details
                        let orderContent = `
                            <h3>Order Details</h3>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>User Name:</strong> ${user.name}</p>
                            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                            <p><strong>Total Price:</strong> $${order.totalPrice}</p>
                            <h4>Books</h4>
                            <table class="table table-striped">
                                <thead class="table-dark">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Author</th>
                                        <th scope="col">Publication Year</th>
                                        <th scope="col">Genre</th>
                                        <th scope="col">Pages</th>
                                        <th scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${books.map(book => `
                                        <tr data-book-id="${book._id}">
                                            <td>${book.name}</td>
                                            <td>${book.author}</td>
                                            <td>${book.publicationYear}</td>
                                            <td>${book.genre.join(', ')}</td>
                                            <td>${book.numOfPages}</td>
                                            <td>${book.price}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        `;
                        $('#orderDetails').append(orderContent);
        
                        // Add event listener for remove buttons
                        $('.remove-book').on('click', function() {
                            let bookId = $(this).closest('tr').data('book-id');
                            removeBookFromOrder(order._id, bookId);
                        });
                    }
                }
        
                // Start fetching books
                fetchNextBook();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showModal("Error Fetching User", `Error fetching user: ${textStatus} - ${errorThrown}`);
            }
        });
    }
});