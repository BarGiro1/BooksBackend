const bookServiceModule = require('../functions/books.service');
const curlRequest = require('curl');
const getAllBooks = async (req, res) => {
    try {
        const allBooksData = await bookServiceModule.getAllBooks();
        res.status(200).json(allBooksData);
    } catch (serviceError) {
        res.status(500).json({ message: serviceError.message });
    }
}
const getBooksByIds = async (req, res) => {
    try {
        const { ids } = req.body;
        const booksByIdsData = await bookServiceModule.getBooksByIds(ids);
        res.status(200).json(booksByIdsData);
    } catch (serviceError) {
        res.status(500).json({ message: serviceError.message });
    }
}

const getBooksByAuthor = async (req, res) => {
    try {
        const { author } = req.params;
        const booksByAuthorData = await bookServiceModule.getBooksByAuthor(author);
        res.status(200).json(booksByAuthorData);
    } catch (serviceError) {
        res.status(500).json({ message: serviceError.message });
    }
}

const getBooksByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const booksByGenreData = await bookServiceModule.getBooksByGenre(genre);
        res.status(200).json(booksByGenreData);
    } catch (serviceError) {
        res.status(500).json({ message: serviceError.message });
    }
}
const getBooksByYear = async (req, res) => {
    try {
        const { year } = req.params;
        const booksByYearData = await bookServiceModule.getBooksByPublicationYear(year);
        res.status(200).json(booksByYearData);
    } catch (serviceError) {
        res.status(500).json({ message: serviceError.message });
    }
}

const getBookById = async (req, res) => {
    try {
        const bookIdParam = req.params.bookId;
        const bookData = await bookServiceModule.getBookById(bookIdParam);
        res.status(200).json(bookData);
    } catch (serviceError) {
        res.status(500).json({ message: serviceError.message });
    }
}

const createBook = async (req, res) => {
    try {
        const { book } = req.body;
        const bookGenres = [...book.genre];
        const bookNumOfPages = book.numOfPages;
        const bookPrice = book.price;
        const priceRegex = new RegExp('^[0-9]+(\.[0-9]+)?');
        if (!priceRegex.test(bookPrice)) return res.status(500).json({ message: "Price must be a number" });
        if (bookPrice < 0) return res.status(500).json({ message: "Price cannot be negative" });
        if (bookNumOfPages < 0) return res.status(500).json({ message: "numOfPages cannot be negative" });

        const formattedGenres = bookGenres.map(genre => {
            let genreWords = genre.split(' ');
            genreWords = genreWords.map(word => word[0].toUpperCase() + word.slice(1));
            return genreWords.join('-');
        });

        book.genre = formattedGenres;
        const createdBook = await bookServiceModule.createBook(book);
        res.status(201).json(createdBook);
    } catch (serviceError) {
        res.status(409).json({ message: serviceError.message });
    }
}
const deleteBook = async (req, res) => {
    try {
        const bookIdParam = req.params.bookId;
        await bookServiceModule.deleteBook(bookIdParam);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (serviceError) {
        res.status(500).json({ message: serviceError.message });
    }
}
const updateBook = async (req, res) => {
    try {
        const bookIdParam = req.params.bookId;
        const { updatedBook } = req.body;
        console.log(updatedBook);
        const updatedNumOfPages = updatedBook.numOfPages;
        const updatedPrice = updatedBook.price;
        const priceRegex = new RegExp('^[0-9]+(\.[0-9]+)?');
        if (updatedPrice < 0) return res.status(500).json({ message: "Price cannot be negative" });
        if (!priceRegex.test(updatedPrice)) return res.status(500).json({ message: "Price must be a number" });
        if (updatedNumOfPages < 0) return res.status(500).json({ message: "numOfPages cannot be negative" });

        await bookServiceModule.updateBook(bookIdParam, updatedBook);
        res.status(200).json({ message: 'Book updated successfully' });
    } catch (serviceError) {
        res.status(500).json({ message: serviceError.message });
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
    getBooksByYear
}