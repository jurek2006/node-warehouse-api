// server/tests/server.test.js

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Warehouse} = require('./../models/warehouse');

const testDocs = [
    {
        _id: new ObjectID(),
        productName: 'xxx yy',
        amount: 5,
        price: 10,
        allowedToSell: false
    },
    {
        _id: new ObjectID(),
        productName: 'ProductOne',
        amount: 1,
        price: 100,
        allowedToSell: true
    }, 
    {
        _id: new ObjectID(),
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

describe('POST /warehouse', () => {
    describe('SUCCEED - create a new warehouse item:', () => {

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
                        expect(warehouse.length).toBe(3);
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
                        expect(warehouse.length).toBe(3);
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
                        expect(warehouse.length).toBe(3);
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
                        expect(warehouse.length).toBe(3);
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
                        expect(warehouse.length).toBe(3);
                        done();
                    }).catch(err => done(err));
                });
        });

    });

});

describe('GET /warehouse', () => {
    it('should get all docs from warehouse', done => {
        request(app)
            .get('/warehouse')
            .expect(200)
            .expect(res => {
                expect(res.body.warehouse.length).toBe(3);
            })
            .end(done);
    });
});

describe('GET /warehouse/:id', () => {
    it('should get warehouse doc with matching id', done => {
        request(app)
            .get(`/warehouse/${testDocs[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.warehouse.productName).toBe(testDocs[0].productName);
                expect(res.body.warehouse.amount).toBe(testDocs[0].amount);
                expect(res.body.warehouse.price).toBe(testDocs[0].price);
                expect(res.body.warehouse.allowedToSell).toBe(testDocs[0].allowedToSell);
            })
            .end(done);
    });

    it('should return 404 if warehouse doc not found for valid ObjectID given', done => {
        request(app)
            .get(`/warehouse/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid ObjectID given', done => {
        request(app)
            .get(`/warehouse/123`)
            .expect(404)
            .end(done);
    });
});

describe('GET /warehouse/productName/:name', () => {
    it('should return warehouse doc for productName matched', done => {
        request(app)
            .get(`/warehouse/productName/${testDocs[0].productName}`)
            .expect(200)
            .expect(res => {
                expect(res.body.warehouse.productName).toBe(testDocs[0].productName);
            })
            .end(done);
    });

    it('should return 404 if given product name is empty', done => {
        request(app)
            .get(`/warehouse/productName/`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if given product name contains only space characters', done => {
        request(app)
            .get(`/warehouse/productName/   `)
            .expect(404)
            .end(done);
    });

    it('should return 404 if no product in warehouse found with given name', done => {
        request(app)
            .get(`/warehouse/productName/nieMaTakiego`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /warehouse/:id', () => {
    const idOfElemToDelete = testDocs[1]._id.toHexString();

    it('should remove doc with given id', done => {
        request(app)
            .delete(`/warehouse/${idOfElemToDelete}`)
            .expect(200)
            .expect(res => {
                expect(res.body.deleted._id).toBe(idOfElemToDelete);
            })
            .end((err, response) => {
                if(err){
                    return done(err);
                }

                Warehouse.findById(idOfElemToDelete).then(warehouse => {
                    expect(warehouse).toNotExist();
                    done();
                }).catch(err => done(err));
            });
    });

    it('should return 404 and messageText when given id is invalid', done => {
        request(app)
            .delete('/warehouse/1234')
            .expect(404)
            .expect(res => {
                expect(res.body.message).toBe('Invalid id given. Unable to delete');
            })
            .end(done);
    });

    it('should return 404 and messageText when no doc with given valid id found', done => {
        request(app)
            .delete(`/warehouse/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect(res => {
                expect(res.body.message).toBe('None doc with given id found. Unable to delete');
            })
            .end(done);
    });
});