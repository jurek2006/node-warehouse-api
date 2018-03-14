// server/server.js

const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Warehouse} = require('./models/warehouse');

const app = express();

app.use(bodyParser.json());

// route POST /warehouse do dodawania danych do warehouse
app.post('/warehouse', (req, res) => {
    // console.log(req.body);

    const warehouse = new Warehouse({
        productName: req.body.productName,
        amount: req.body.amount,
        price: req.body.price,
        allowedToSell: req.body.allowedToSell,
    });

    warehouse.save()
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            res.status(400).send(err);
        })
});

if(!module.parent){
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}

module.exports = {app}