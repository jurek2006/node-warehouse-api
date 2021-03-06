// server/server.js
require('./config/config'); //ustawienia portu i połączenia z bazą danych

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Warehouse} = require('./models/warehouse');

const app = express();
const port = process.env.PORT || 3000;

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

    Warehouse.findOne({productName: name}).then(warehouse => {
        if(!warehouse){
            return res.status(404).send();
        }
        res.send({warehouse});
    }).catch(err => {
        res.status(400).send();
    })
});

// route DELETE /warehouse/:id do usuwania doc o zadanym id
app.delete('/warehouse/:id', (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send({message: 'Invalid id given. Unable to delete'});
    }

    Warehouse.findByIdAndRemove(id).then(warehouse => {
        if(!warehouse){
            return res.status(404).send({message: 'None doc with given id found. Unable to delete'});
        }
        res.send({deleted: warehouse})
    }).catch(err => res.status(400).send());
});

// route PATCH /warehouse/:id do edycji doc o zadanym id
app.patch('/warehouse/:id', (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send({message: 'Invalid id given. Unable to update'});
    }

    // ignorowanie właściwości, które nie są odpowiedniego typu
    // + ignorowanie prób zmiany _id
    const propertiesToOmit = ['_id'];

    if(!_.isString(req.body.productName)){ propertiesToOmit.push('productName'); }
    if(!_.isFinite(req.body.amount)){ propertiesToOmit.push('amount') }
    if(!_.isFinite(req.body.price)){ propertiesToOmit.push('price') }
    if(!_.isBoolean(req.body.allowedToSell)){ propertiesToOmit.push('allowedToSell') }

    const body = _.omit(req.body, propertiesToOmit);

    Warehouse.findByIdAndUpdate(id, {$set: body}, {new: true}).then(updated => {
        if(!updated){
            return res.status(404).send({message: 'None doc with given id found. Unable to update'});
        }
        res.send({updated});
    }).catch(err => res.status(400).send({err}) );
});

if(!module.parent){
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = {app}