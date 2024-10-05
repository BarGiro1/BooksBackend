const ordersService = require('../functions/orders.service');
const bookService = require('../functions/books.service');
const userService = require('../functions/users.service');
const jwt = require('jsonwebtoken');
const {getSocket} = require('../config/sockets');
const getAllOrders = async (req, res) => {
    try {
        const allOrders = await ordersService.getAllOrders();
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.user;
        const userOrders = await ordersService.getOrdersByUser(userId);
        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const singleOrder = await ordersService.getOrderById(orderId);
        res.status(200).json(singleOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createOrder = async (req, res) => {
    try {
        const {order, token} = req.body;
        const decodedUserToken = jwt.decode(token);
        const userDetails = await userService.getUserById(decodedUserToken.id);
        const selectedBooks = [];
        for(let i = 0; i < order.books.length; i++){
            const bookDetails = await bookService.getBookById(order.books[i]);
            selectedBooks.push(bookDetails);
        }
        order.user = userDetails._id;
        const createdOrder = await ordersService.createOrder(order);
        for(let i = 0; i < selectedBooks.length; i++){
            bookService.increaseNumOfPurchases(selectedBooks[i]._id);
        }
        userDetails.orders.push(createdOrder._id);
        userDetails.books.push(...selectedBooks.filter(book => !userDetails.books.includes(book._id)));
        userService.updateUser(userDetails._id, userDetails);
        try{
            const socketInstance = getSocket();
            socketInstance.emit('updateBookNumOfPurchases', selectedBooks.map(book => ({"bookId": book._id, "numOfPurchases": ++book.numOfPurchases})));
        } catch(error){
            console.log("Socket error:", error);
        }
        res.status(200).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const orderDetails = await ordersService.deleteOrder(orderId);
        const userDetails = await userService.getUserById(orderDetails.user);
        const orderBooksList = []
        for(let i = 0; i < orderDetails.books.length; i++){
            const bookDetails = await bookService.getBookById(orderDetails.books[i]);
            bookDetails.numOfPurchases--;
            orderBooksList.push(bookDetails);
            bookService.updateBook(bookDetails._id, bookDetails);
            if(userDetails) userDetails.books = userDetails.books.filter(book => book.toHexString() !== bookDetails._id.toHexString());
        }
        if(userDetails){
            userDetails.orders = userDetails.orders.filter(order => order !== orderId);
            userService.updateUser(userDetails._id, userDetails);
        }
        try{
            const socketInstance = getSocket();
            socketInstance.emit('updateBookNumOfPurchases', orderBooksList.map(book => ({"bookId": book._id, "numOfPurchases": book.numOfPurchases})));
        } catch(error){
            console.log("Socket error:", error);
        }
        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAllOrders = async (req, res) => {
    try{
        const removedOrders = await ordersService.deleteAllOrders();
        res.status(200).json(removedOrders);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}
const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const {order} = req.body;
        const currentOrder = await ordersService.getOrderById(orderId);
        const userDetails = await userService.getUserById(currentOrder.user);
        if(!userDetails) return res.status(500).json({message: "cannot update order of a deleted user"})
        const removedBooks = currentOrder.books.map(book=>book.toHexString()).filter(book => !order.books.includes(book));
        const updatedBooks = [];
        for(let i = 0; i < removedBooks.length; i++){
            const bookDetails = await bookService.getBookById(removedBooks[i]);
            bookDetails.numOfPurchases--;
            updatedBooks.push({"bookId": bookDetails._id, "numOfPurchases": bookDetails.numOfPurchases});
            bookService.updateBook(bookDetails._id, bookDetails);
            userDetails.books = userDetails.books.filter(s => s.toHexString() !== bookDetails._id.toHexString());
        }
        const updatedOrder = await ordersService.updateOrder(orderId, order);
        userService.updateUser(userDetails._id, userDetails);
        try{
            const socketInstance = getSocket();
            socketInstance.emit('updateBookNumOfPurchases',updatedBooks);
        } catch(error){
            console.log("Socket error:", error);
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    createOrder,
    getOrderById,
    getOrdersByUser,
    getAllOrders,
    updateOrder,
    deleteOrder,
    deleteAllOrders
}
