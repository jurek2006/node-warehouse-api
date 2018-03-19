// server/server.js

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Warehouse} = require('./models/warehouse');

const app = express();

app.use(bodyParser.json());

// route POST /warehouse do dodawania danych do warehouse
app.post('/warehouse', (req, res) => {

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

// route GET /warehouse do wyświetlania wszystkich danych z warehouse
app.get('/warehouse', (req, res) => {
    Warehouse.find().then(warehouse => {
        res.send({warehouse});
    }, err => {
        res.status(400).send(err);
    });
});

// route GET /warehouse/:id do wyświetlenia doc z warehouse o zadanym id
app.get('/warehouse/:id', (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Warehouse.findById(id).then(warehouse => {
        if(!warehouse){
            return res.status(404).send();
        }
        res.send({warehouse});
    }).catch(err => {
        res.status(400).send();
    });
});

// route GET /warehouse/productName/:name do wyświetlania doc z warehouse o zadanej nazwie produktu
app.get('/warehouse/productName/:name', (req, res) => {
    const name = req.params.name;

    console.log(name);

    Warehouse.findOne({productName: name}).then(warehouse => {
        if(!warehouse){
            return res.status(404).send();
        }
        res.send({warehouse});
    }).catch(err => {
        res.status(400).send();
    })
    // return res.status(200).send();
});

if(!module.parent){
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}

module.exports = {app}