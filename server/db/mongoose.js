// server/db/mongoose.js
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/WarehouseApp');

module.exports = {mongoose}