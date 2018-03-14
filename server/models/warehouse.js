// server/models/warehouse.js
const mongoose = require('mongoose');

const Warehouse = mongoose.model('Warehouse', {
    productName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    amount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number
    },
    allowedToSell: {
        type: Boolean,
        default: false
    }
});

module.exports = {Warehouse}