const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

//MongoDB Endpoint
const url = "mongodb+srv://admin:admin@abholtheke-inim5.gcp.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "Abholtheke";


let dbo;

// Connection to MongoDB and server initialisation
MongoClient.connect(url, { useNewUrlParser: true },(err, client) => {
    if (err) return console.log(err);
    dbo =  client.db(dbName);
    app.listen(3000, function () {
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

// REST API for unused GET example
app.get('/users/register', function (req, res) {
    res.send('Hello World!');
});

// REST API for user registration
app.post('/users/register', (req, res) => {
    const user = req.body;
    if (!getUserByInsuranceId(user.insuranceId)) {
        createUser(user);
        res.status(201).json({status:"created"});
    } else {
        res.status(400).json({ message: 'Insurance ID "' + user.insuranceId + '" is already taken'});
    }
});



// DB functionality following --> should be outsourced

function createUser(user) {
    dbo.collection("user").insertOne(user, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
    });
}


function getUserByInsuranceId(insuranceId) {
    let user;
    //TODO
    return user;
}


