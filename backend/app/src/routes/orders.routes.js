const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders.controller');
const validations = require('../validations/users.validations')

router
.get('/', orderController.getAllOrders)
.get('/:id', orderController.getOrderById)
.get('/user/:user', orderController.getOrdersByUser)
.post('/', validations.checkToken, orderController.createOrder)
.delete('/', orderController.deleteAllOrders)

module.exports = router;