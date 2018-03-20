const env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/WarehouseApp';
} else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/WarehouseAppTest';
} else if(env === 'production'){
    process.env.MONGODB_URI = 'mongodb://user:haslo@ds119059.mlab.com:19059/warehouse';
}