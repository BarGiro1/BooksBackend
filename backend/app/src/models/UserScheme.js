const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 500
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    books: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'book',
        default: []
    },
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'order',
        default: []
    }
});

module.exports = mongoose.model('user', UserScheme, 'users')