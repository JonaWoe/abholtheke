const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const userRoutes = require('./users/users.routes');
const authenticationRoutes = require('./authentication/authentication.routes');
const prescriptionRoutes = require('./prescriptions/prescriptions.routes');
const pharmaciesRoutes = require('./pharmacies/pharmacies.routes');


const config = require('./config/config.js');

// Connection to MongoDB and server initialisation and
MongoClient.connect(global.gConfig.database, { useNewUrlParser: true },(err, client) => {
    if (err) return console.log(err);
    console.log("MongoDB on " + global.gConfig.database + " connected!");
    app.locals.dbo = client.db(global.gConfig.dbName);
    app.listen(global.gConfig.port, () => {
        console.log('Example app listening on port 3000!');
    });
});

app.use(express.json());


// Add Access-Control-Allow-Origin headers to all HTTP requests
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, Accept, Accept-Language, Origin, User-Agent, Authorization');
    next();
});

// redirect all API calls to individual routes
app.use('/users', userRoutes);
app.use('/authenticate', authenticationRoutes);
app.use('/prescription', prescriptionRoutes);
app.use('/pharmacies', pharmaciesRoutes);


