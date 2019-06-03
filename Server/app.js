const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:admin@abholtheke-inim5.gcp.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "Abholtheke";


let dbo;

MongoClient.connect(url, { useNewUrlParser: true },(err, client) => {
    if (err) return console.log(err);
    dbo =  client.db(dbName);
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
});



app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.post('/customers', (req, res) => {
    const customer = { insuranceId: 1234567899, firstName: "Max", lastName: "Mustermann", password: "admin", eMail: "max.mustermann@gmail.com" };
    createUser(customer);
    console.log('Hellooooooooooooooooo!');
    res.send("ok");
});



function createUser(customer) {
    dbo.collection("customers").insertOne(customer, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
    });
}
