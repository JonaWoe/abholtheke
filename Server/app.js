const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const userRoutes = require('./users/users.routes');

//MongoDB Endpoint
const url = "mongodb+srv://admin:admin@abholtheke-inim5.gcp.mongodb.net/test?retryWrites=true&w=majority";
// const url ="localhost:27017";
const dbName = "Abholtheke";


// Connection to MongoDB and server initialisation and
MongoClient.connect(url, { useNewUrlParser: true },(err, client) => {
    if (err) return console.log(err);
    console.log("MongoDB on " + url + " connected!");
    app.locals.dbo = client.db(dbName);
    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
    });
});

app.use(express.json());


// Add Access-Control-Allow-Origin headers to all HTTP requests
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, Accept, Accept-Language, Origin, User-Agent');
    next();
});

// redirect all API calls on /useres to users.route
app.use('/users', userRoutes);



