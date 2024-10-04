const Book = require('../models/BookSchema');

// Fetch books by genre
const getBooksByGenre = async (genre) => {
    if (!genre) throw new Error('Genre is required');
    try {
        const books = await Book.find({ genre });
        if (!books.length) throw new Error('No books found for this genre');
        return books;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Fetch books by a list of IDs
const getBooksByIds = async (ids) => {
    if (!ids || !ids.length) throw new Error('Ids are required');
    try {
        const books = await Book.find({ _id: { $in: ids } });
        if (!books.length) throw new Error('No books found for the provided IDs');
        return books;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Fetch books by author name
const getBooksByAuthor = async (author) => {
    if (!author) throw new Error('Author is required');
    try {
        const books = await Book.find({ author });
        if (!books.length) throw new Error('No books found for this author');
        return books;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Fetch books by publication year
const getBooksByPublicationYear = async (publicationYear) => {
    if (!publicationYear) throw new Error('Year is required');
    try {
        const books = await Book.find({ publicationYear });
        if (!books.length) throw new Error('No books found for this year');
        return books;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Fetch all books
const getAllBooks = async () => {
    try {
        const books = await Book.find();
        return books.length ? books : 'No books available';
    } catch (error) {
        throw new Error(error.message);
    }
}

// Fetch a book by its ID
const getBookById = async (id) => {
    if (!id) throw new Error('Id is required');
    try {
        const book = await Book.findById(id);
        if (!book) throw new Error('Book not found');
        return book;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Create a new book
const createBook = async (bookData) => {
    const { name, author, publicationYear, numOfPages, price } = bookData;
    if (!name || !author || publicationYear === undefined || numOfPages === undefined || price === undefined) {
        throw new Error('Missing required fields');
    }

    try {
        const existingBook = await Book.findOne(bookData);
        if (existingBook) throw new Error('Book already exists');
        
        const newBook = new Book(bookData);
        return await newBook.save();
    } catch (error) {
        throw new Error(error.message);
    }
}

// Update a book by its ID
const updateBook = async (id, updatedData) => {
    const { name, author, publicationYear, numOfPages, price } = updatedData;
    if (!id) throw new Error('Id is required');
    if (!name || !author || publicationYear === undefined || numOfPages === undefined || price === undefined) {
        throw new Error('Missing required fields');
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedBook) throw new Error('Book not found or could not be updated');
        return updatedBook;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Delete a book by its ID
const deleteBook = async (id) => {
    if (!id) throw new Error('Id is required');
    
    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) throw new Error('Book not found');
        return 'Book deleted successfully';
    } catch (error) {
        throw new Error(error.message);
    }
}

// Increment the number of purchases for a book
const increaseNumOfPurchases = async (id) => {
    if (!id) throw new Error('Id is required');
    
    try {
        const book = await Book.findById(id);
        if (!book) throw new Error('Book not found');

        book.numOfPurchases = (book.numOfPurchases || 0) + 1;
        await book.save();
        return book;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getAllBooks,
    getBooksByIds,
    createBook,
    deleteBook,
    updateBook,
    getBookById,
    getBooksByAuthor,
    getBooksByGenre,
    getBooksByPublicationYear,
    increaseNumOfPurchases
}