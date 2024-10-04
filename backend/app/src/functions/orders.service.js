const Order = require('../models/OrderSchema');
const { Types: { ObjectId } } = require('mongoose');
const usersService = require('./users.service');
const booksService = require('./books.service');

// Fetch orders by user ID
const getOrdersByUser = async (user) => {
    if (!user) throw new Error('User ID is required');
    try {
        const orders = await Order.find({ user });
        if (!orders.length) throw new Error('No orders found for this user');
        return orders;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Create a new order
const createOrder = async (orderData) => {
    const { user, books } = orderData;
    if (!user || !books || !books.length) throw new Error('User and books are required');

    try {
        const newOrder = new Order({ user, books });
        await newOrder.save();
        return newOrder;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Fetch all orders
const getAllOrders = async () => {
    try {
        const orders = await Order.find();
        return orders.length ? orders : 'No orders found';
    } catch (error) {
        throw new Error(error.message);
    }
}

// Delete an order by ID
const deleteOrder = async (id) => {
    if (!id) throw new Error('Order ID is required');
    
    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) throw new Error('Order not found');
        return order;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Update an order by ID
const updateOrder = async (id, updatedOrderData) => {
    if (!id) throw new Error('Order ID is required');
    if (!updatedOrderData) throw new Error('Updated order data is required');
    
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData, { new: true });
        if (!updatedOrder) throw new Error('Order not found');
        return updatedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Fetch an order by ID
const getOrderById = async (id) => {
    if (!id) throw new Error('Order ID is required');
    
    try {
        const order = await Order.findById(id);
        if (!order) throw new Error('Order not found');
        return order;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Delete all orders and clean up associated user books and purchases
const deleteAllOrders = async () => {
    try {
        const orders = await Order.deleteMany();
        if (!orders) throw new Error('No orders found to delete');

        // Clean up user books and book purchases
        for (let order of orders) {
            const user = await usersService.getUserById(order.user);
            user.books = user.books.filter(book => !order.books.includes(book));
            await usersService.updateUser(user._id, user);
            
            for (let bookId of order.books) {
                const book = await booksService.getBookById(bookId);
                book.numOfPurchases = Math.max(0, (book.numOfPurchases || 0) - 1); // Decrease purchase count
                await booksService.updateBook(book._id, book);
            }
        }
        return orders;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getAllOrders,
    getOrdersByUser,
    getOrderById,
    createOrder,
    deleteOrder,
    deleteAllOrders,
    updateOrder
}