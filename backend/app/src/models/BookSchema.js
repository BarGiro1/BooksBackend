const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    author: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    publicationYear: {
        type: Number,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 4
    },
    genre: {
        type: [String],
        trim: true,
        minlength: 3,
        maxlength: 100,
        default: [],
    },
    numOfPages: {
        type: Number,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 10000
    },
    numOfPurchases : {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 4,
        default: 49.99,
        min: 0
    },
});

module.exports = mongoose.model('book', BookSchema, 'books')