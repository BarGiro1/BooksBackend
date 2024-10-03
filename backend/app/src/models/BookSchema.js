const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30
    },
    author: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30
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
        maxlength: 10,
        default: [], //By defaulting to an empty array, every document will consistently have the genre field, even if it has no values. This ensures that all documents maintain a predictable structure
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