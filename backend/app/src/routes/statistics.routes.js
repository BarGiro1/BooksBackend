const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');

router
  .get('/getMonthlyAveragePurchases', statisticsController.getMonthlyAveragePurchases)
  .get('/getOrdersByAuthor/:author', statisticsController.getOrdersByAuthor)  // Expecting 'author' as a route param
  .get('/getSalesPerBook/:bookId', statisticsController.getSalesPerBook)
  .get('/getLastTenDaysSales', statisticsController.getLastTenDaysSales)
  .get('/getMonthlyOrders', statisticsController.getMonthlyOrders);  // Add the new route



module.exports = router;