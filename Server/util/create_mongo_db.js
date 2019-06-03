const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:admin@abholtheke-inim5.gcp.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "WebApp";

MongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
    if (err) throw err;

    const dbo = db.db(dbName);

    //Mock Data for customers
    const customers = [
        { insuranceId: 1234567891, firstName: "Max", lastName: "Mustermann", password: "admin", eMail: "max.mustermann@gmail.com" },
        { insuranceId: 1234567892, firstName: "Hans", lastName: "Maier", password: "admin", eMail: "hans.maier@gmail.com" },
        { insuranceId: 1234567893, firstName: "Peter", lastName: "Schmidt", password: "admin", eMail: "peter.schmidt@gmail.com" },
        { insuranceId: 1234567894, firstName: "Jan", lastName: "Müller", password: "admin", eMail: "jan.müller@gmail.com" },
        { insuranceId: 1234567895, firstName: "Stefen", lastName: "Burger", password: "admin", eMail: "stefen.burger@gmail.com"}];


    const pharmacists = {};
    const doctors = {};


    dbo.collection("customers").insertMany(customers, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        db.close();
    });

});
