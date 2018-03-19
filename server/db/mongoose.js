// server/db/mongoose.js
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let connectPath, options;
// Check if we are on Heroku
if(process.env.PORT){
    connectPath = "mongodb://user:haslo@ds119059.mlab.com:19059/warehouse";
    options = {
        auth: {
            user: 'user',
            password: 'haslo'
        }
    }
} else {
    connectPath = 'mongodb://localhost:27017/WarehouseApp';
    options = {}
}
mongoose.connect(connectPath, options);

module.exports = {mongoose}