const User = require('../models/UserScheme');
const Song = require('../models/BookSchema');
const Order = require('../models/OrderSchema');

const statisticsService = require('../functions/statistics.service');


const getMonthlyAveragePurchases = async (req, res) => {
    try {
        const sales = await statisticsService.getLastTenDaysSales();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const getOrdersByAuthor = async (req, res) => {
    try {
        const sales = await statisticsService.getOrdersByAuthor();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}



const getSalesPerBook = async (req, res) => {
    try {
        const sales = await statisticsService.getSalesPerBook();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}




module.exports = {
    getMonthlyAveragePurchases,
    getOrdersByAuthor,
    getSalesPerBook,
}
