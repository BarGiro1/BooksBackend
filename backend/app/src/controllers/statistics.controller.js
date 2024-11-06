const User = require('../models/UserScheme');
const Song = require('../models/BookSchema');
const Order = require('../models/OrderSchema');

const statisticsService = require('../functions/statistics.service');


const getMonthlyAveragePurchases = async (req, res) => {
    try {
        const sales = await statisticsService.getMonthlyAveragePurchases();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const getOrdersByAuthor = async (req, res) => {
    try {
        const { author } = req.params;  // Get the 'author' from the route parameters
        const sales = await statisticsService.getOrdersByAuthor(author);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}



const getSalesPerBook = async (req, res) => {
    try {
        const bookId = req.params.bookId; 
        const sales = await statisticsService.getSalesPerBook(bookId);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getLastTenDaysSales = async (req, res) => {
    try {
        const sales = await statisticsService.getLastTenDaysSales();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMonthlyOrders = async (req, res) => {
    try {
        const sales = await statisticsService.getMonthlyOrders();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
    getMonthlyAveragePurchases,
    getOrdersByAuthor,
    getSalesPerBook,
    getLastTenDaysSales,
    getMonthlyOrders
}
