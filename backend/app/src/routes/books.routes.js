const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books.controller');

router
.get('/', bookController.getAllBooks)
.get('/:bookId', bookController.getBookById)
.get('/author/:author', bookController.getBooksByAuthor)
.get('/genre/:genre', bookController.getBooksByGenre)
.get('/year/:year', bookController.getBooksByYear)

module.exports = router;