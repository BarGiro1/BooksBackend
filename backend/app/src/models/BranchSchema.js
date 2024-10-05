const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },
        city: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        country: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        maxlength: 15
    }
});

module.exports = mongoose.model('branch', BranchSchema, 'branches');
