const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    books: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        required: true

        },
     ],
    date: {
        type: Date,
        default: Date.now
    },
    
    totalPrice: {
        type: Number,
        required: true
    },
});
module.exports = mongoose.model('order', OrderSchema, 'orders')