// server/tests/server.test.js

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Warehouse} = require('./../models/warehouse');

const testDocs = [
    {
        productName: 'ProductOne',
        amount: 1,
        price: 100,
        allowedToSell: true
    }, 
    {
        productName: 'ProductTwo',
        amount: 5,
        price: 10,
        allowedToSell: false
    }
];

beforeEach(done => {
    // before each test removes each document in Warehouse and creates two testing Warehouse's items from testDocs
    Warehouse.remove({}).then(() => {
        return Warehouse.insertMany(testDocs);
    }).then(() => done());
});

describe('POST /todos', () => {
    describe('SUCCED - create a new warehouse item:', () => {

        it('should create a new warehouse item - with all the fields proper values given - and return it in response', done => {
            const docToAdd = {
                productName: 'ProductTest',
                amount: 5,
                price: 1200,
                allowedToSell: true
            }

            request(app)
                .post('/warehouse')
                .send(docToAdd)
                .expect(200)
                .expect(res => {
                    expect(res.body.productName).toBe(docToAdd.productName);
                    expect(res.body.amount).toBe(docToAdd.amount);
                    expect(res.body.price).toBe(docToAdd.price);
                    expect(res.body.allowedToSell).toBe(docToAdd.allowedToSell);
                })
                .end((err, response) => {
                    if(err){
                        return done(err);
                    }

                    Warehouse.find(docToAdd).then(warehouse => {
                        expect(warehouse.length).toBe(1);
                        expect(warehouse[0].productName).toBe(docToAdd.productName);
                        expect(warehouse[0].amount).toBe(docToAdd.amount);
                        expect(warehouse[0].price).toBe(docToAdd.price);
                        expect(warehouse[0].allowedToSell).toBe(docToAdd.allowedToSell);
                        done();
                    }).catch(err => done(err));
                });
        });

        it('should create a new warehouse item - with only productName given - and return it in response', done => {
            const productName = 'Pies';

            request(app)
                .post('/warehouse')
                .send({productName})
                .expect(200)
                .expect(res => {
                    expect(res.body.productName).toBe(productName);
                    expect(res.body.amount).toBe(0);
                    expect(res.body.price).toBe(undefined);
                    expect(res.body.allowedToSell).toBe(false);
                })
                .end((err, response) => {
                    if(err){
                        return done(err);
                    }

                    Warehouse.find({productName}).then(warehouse => {
                        expect(warehouse.length).toBe(1);
                        expect(warehouse[0].productName).toBe(productName);
                        expect(warehouse[0].amount).toBe(0);
                        expect(warehouse[0].price).toBe(undefined);
                        expect(warehouse[0].allowedToSell).toBe(false);
                        done()
                    }).catch(err => done(err));
                })
        });
    });

    describe('FAIL - not create any warehouse item:', () => {

        it('should not create any warehouse item when empty JSON given', done => {

            request(app)
                .post('/warehouse')
                .send()
                .expect(400)
                .end((err, response) => {
                    if(err){
                        return done(err);
                    }

                    Warehouse.find().then(warehouse => {
                        expect(warehouse.length).toBe(2);
                        done();
                    }).catch(err => done(err));
                });
        });

        it('should not create any warehouse item when not productName given', done => {
            const docToAdd = {
                wrongProductName: 'Wrong',
                amount: 5,
                price: 1200,
                allowedToSell: true
            }

            request(app)
                .post('/warehouse')
                .send(docToAdd)
                .expect(400)
                .end((err, response) => {
                    if(err){
                        return done(err);
                    }

                    Warehouse.find().then(warehouse => {
                        expect(warehouse.length).toBe(2);
                        done();
                    }).catch(err => done(err));
                });
        });

        it('should not create any warehouse item when productName contains only spaces', done => {
            const docToAdd = {
                productName: '   ',
                amount: 5,
                price: 1200,
                allowedToSell: true
            }

            request(app)
                .post('/warehouse')
                .send(docToAdd)
                .expect(400)
                .end((err, response) => {
                    if(err){
                        return done(err);
                    }

                    Warehouse.find().then(warehouse => {
                        expect(warehouse.length).toBe(2);
                        done();
                    }).catch(err => done(err));
                });
        });

        it('should not create any warehouse item when amount can\'t be converted to a number' , done => {
            const docToAdd = {
                productName: 'z numerem',
                amount: 'jedenaście',
                price: 1200,
                allowedToSell: true
            }

            request(app)
                .post('/warehouse')
                .send(docToAdd)
                .expect(400)
                .end((err, response) => {
                    if(err){
                        return done(err);
                    }

                    Warehouse.find().then(warehouse => {
                        expect(warehouse.length).toBe(2);
                        done();
                    }).catch(err => done(err));
                });
        });

        it('should not create any warehouse item when price can\'t be converted to a number' , done => {
            const docToAdd = {
                productName: 'name',
                amount: 11,
                price: 'tysiąc',
                allowedToSell: true
            }

            request(app)
                .post('/warehouse')
                .send(docToAdd)
                .expect(400)
                .end((err, response) => {
                    if(err){
                        return done(err);
                    }

                    Warehouse.find().then(warehouse => {
                        expect(warehouse.length).toBe(2);
                        done();
                    }).catch(err => done(err));
                });
        });

    });

});