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
        longitude: {
            type: Number,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
             },
        country: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        
      
    }
});

module.exports = mongoose.model('branch', BranchSchema, 'branches');
