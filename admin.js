
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const { Predictor, Prediction } = require('./db');

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  rootPath: '/admin', 
  resources: [
    { resource: Predictor },
    { resource: Prediction }
  ]
});

console.log("Building admin site...");
const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;