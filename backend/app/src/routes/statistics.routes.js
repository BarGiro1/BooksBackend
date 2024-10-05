const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');

router
.get('/getMonthlyAveragePurchases', statisticsController.getMonthlyAveragePurchases)
.get('/getOrdersByAuthor', statisticsController.getOrdersByAuthor)
.get('/getSalesPerBook', statisticsController.getSalesPerBook)

module.exports = router;