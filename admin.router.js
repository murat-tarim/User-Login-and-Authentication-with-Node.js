const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')

const AdminBroMongoose = require('admin-bro-mongoose')

const mongoose = require ('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

//DB config

const db = require ('../config/keys').MongoURI;

//Connect to Mongo

const Mongo_URL =process.env.Mongo_URL ||  'mongodb+srv://murat01:murat01@cluster0-lmcvu.mongodb.net/test?retryWrites=true&w=majority';
const adminBro = new AdminBro({
  databases: [mongoose],  //No connection to db for admin panel (problem)
  rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBro)

module.exports = router