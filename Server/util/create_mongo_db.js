const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:admin@abholtheke-inim5.gcp.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "Abholtheke";


// Example MongoDB connection, can be used to create initial DB entrys
MongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
    if (err) throw err;

    const dbo = db.db(dbName);

    //Mock Data for customers --> pw is "1"
    const user = [
        { insuranceId: '1', firstName: 'Max', lastName: 'Mustermann', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'max.mustermann@gmail.com' },
        { insuranceId: '2', firstName: 'Hans', lastName: 'Maier', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'hans.maier@gmail.com' },
        { insuranceId: '3', firstName: 'Peter', lastName: 'Schmidt', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'peter.schmidt@gmail.com' },
        { insuranceId: '4', firstName: 'Jan', lastName: 'Müller', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'jan.müller@gmail.com' },
        { insuranceId: '5', firstName: 'Stefen', lastName: 'Burger', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'stefen.burger@gmail.com'}];

    //Mock Data for prescriptions
    const prescriptions = [
        { issuedBy: 'Dr. med. Gerald Stein', expireDate: '01.08.2019', medicine: 'Ibuprofen', amount: '600mg',  medicineId: '7f428de0-87a3-11e9-bc42-526af7764f64', insuranceId: '1', redeemed: true, description: 'Akut bei starken Schmerken einnehmen' },
        { issuedBy: 'Dr. med. Gerald Stein', expireDate: '05.08.2019', medicine: 'Thomapyrin', amount: '300mg', medicineId: '245add5e-87a5-11e9-bc42-526af7764f64', insuranceId: '1', redeemed: false,description: 'Dreimal täglich einnehmen' },
        { issuedBy: 'Dr. med. Gerald Stein', expireDate: '10.08.2019', medicine: 'Asperin', amount: '500mg', medicineId: '2b8530d4-87a5-11e9-bc42-526af7764f64', insuranceId: '1', redeemed: false,description: 'Vor dem Mitagessen einnehmen' },
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '01.08.2019', medicine: 'Mucosolvan', amount: '500ml', medicineId: '3004de84-87a5-11e9-bc42-526af7764f64', insuranceId: '2', redeemed: false, description: 'Zu jeder Malzeit einnehmen' },
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '05.08.2019', medicine: 'Dobendan', amount: '600mg', medicineId: '34bd3570-87a5-11e9-bc42-526af7764f64', insuranceId: '2', redeemed: false, description: 'Vor dem Schlafen einnehmen' },
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '10.08.2019', medicine: 'Snup', amount: '100ml', medicineId: '3948e512-87a5-11e9-bc42-526af7764f64', insuranceId: '2', redeemed: false, description: 'Zum Frühstück einnehmen' },
        { issuedBy: 'Dr. med. Ulrike Stock', expireDate: '01.08.2019', medicine: 'GeloMyrtol 600mg', amount: '400mg', medicineId: '3db895fc-87a5-11e9-bc42-526af7764f64', insuranceId: '3', redeemed: true, description: 'Maximal 5 Täglich einnehmen' },
        { issuedBy: 'Dr. med. Ulrike Stock', expireDate: '05.08.2019', medicine: 'Penicillin', amount: '100mg', medicineId: '429e0d86-87a5-11e9-bc42-526af7764f64', insuranceId: '3', redeemed: true, description: 'Nach dem Mitagessen einnehmen' },
        { issuedBy: 'Dr. med. Ulrike Stock', expireDate: '10.08.2019', medicine: 'Paracetamol', amount: '1200mg', medicineId: '468171e0-87a5-11e9-bc42-526af7764f64', insuranceId: '3', redeemed: false, description: 'Einnahme nach Bedarf' }

    ];


    dbo.collection('user').insertMany(user, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

    dbo.collection('prescriptions').insertMany(prescriptions, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

});
