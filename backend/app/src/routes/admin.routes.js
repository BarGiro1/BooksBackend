const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders.controller');
const userController = require('../controllers/users.controller');
const bookController = require('../controllers/books.controller');
const validations = require('../validations/users.validations');

router
    .post('/users/', validations.checkToken, validations.adminAuth, userController.getAllUsers)
    .put('/users/:userId', validations.checkToken, validations.adminAuth, validations.updatedUserAuth, userController.updateUser)
    .delete('/users/:userId', validations.checkToken, validations.adminAuth, userController.deleteUser)

    .post('/books/', validations.checkToken, validations.adminAuth, bookController.getAllBooks)
    .post('/books/create', validations.checkToken, validations.adminAuth, bookController.createBook)
    .put('/books/:bookId', validations.checkToken, validations.adminAuth, bookController.updateBook)
    .delete('/books/:bookId', validations.checkToken, validations.adminAuth, bookController.deleteBook)

    .post('/orders/', validations.checkToken, validations.adminAuth, orderController.getAllOrders)
    .put('/orders/:orderId', validations.checkToken, validations.adminAuth, orderController.updateOrder)
    .delete('/orders/:orderId', validations.checkToken, validations.adminAuth, orderController.deleteOrder)


module.exports = router;