const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:admin@abholtheke-inim5.gcp.mongodb.net/test?retryWrites=true&w=majority";
//const url = "mongodb://localhost:27017";
const dbName = "Abholtheke";


// Example MongoDB connection, can be used to create initial DB entrys
MongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
    if (err) throw err;

    const dbo = db.db(dbName);

    dbo.dropDatabase();

    //Mock Data for customers --> pw is "1"
    const user = [
        { insuranceId: '1', firstName: 'Max', lastName: 'Mustermann', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'max.mustermann@gmail.com' },
        { insuranceId: '2', firstName: 'Hans', lastName: 'Maier', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'hans.maier@gmail.com' },
        { insuranceId: '3', firstName: 'Peter', lastName: 'Schmidt', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'peter.schmidt@gmail.com' },
        { insuranceId: '4', firstName: 'Jan', lastName: 'Müller', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'jan.müller@gmail.com' },
        { insuranceId: '5', firstName: 'Stefen', lastName: 'Burger', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'stefen.burger@gmail.com'}];

    //Mock Data for prescriptions
    const prescriptions = [
        { issuedBy: 'Dr. med. Gerald Stein', expireDate: '01.08.2019', medicine: 'Ibuprofen', amount: '600mg',  medicineId: '7f428de0-87a3-11e9-bc42-526af7764f64', insuranceId: '1', pharmacyId: '', redeemed: false, description: 'Akut bei starken Schmerken einnehmen', imgUrl: 'https://www.oxfordonlinepharmacy.co.uk/images/products/IMG_5707.jpg'},
        { issuedBy: 'Dr. med. Gerald Stein', expireDate: '05.08.2019', medicine: 'Thomapyrin', amount: '300mg', medicineId: '245add5e-87a5-11e9-bc42-526af7764f64', insuranceId: '1', pharmacyId: '1', redeemed: false,description: 'Dreimal täglich einnehmen', imgUrl: 'https://www.europa-apotheek.com/pix/productphotos/0624605.jpg'},
        { issuedBy: 'Dr. med. Gerald Stein', expireDate: '10.08.2019', medicine: 'Aspirin', amount: '500mg', medicineId: '2b8530d4-87a5-11e9-bc42-526af7764f64', insuranceId: '1', pharmacyId: '1', redeemed: true,description: 'Vor dem Mitagessen einnehmen', imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '01.08.2019', medicine: 'Mucosolvan', amount: '500ml', medicineId: '3004de84-87a5-11e9-bc42-526af7764f64', insuranceId: '1', pharmacyId: '', redeemed: true, description: 'Zu jeder Malzeit einnehmen', imgUrl: 'https://www.docmorris.de/images/produkte/large/00057879/MucosolvanRetardkapseln75mg.jpg'},
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '05.08.2019', medicine: 'Dobendan', amount: '600mg', medicineId: '34bd3570-87a5-11e9-bc42-526af7764f64', insuranceId: '2', pharmacyId: '', redeemed: false, description: 'Vor dem Schlafen einnehmen', imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '10.08.2019', medicine: 'Snup', amount: '100ml', medicineId: '3948e512-87a5-11e9-bc42-526af7764f64', insuranceId: '2', pharmacyId: '', redeemed: false, description: 'Zum Frühstück einnehmen', imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Ulrike Stock', expireDate: '01.08.2019', medicine: 'GeloMyrtol 600mg', amount: '400mg', medicineId: '3db895fc-87a5-11e9-bc42-526af7764f64', insuranceId: '3', pharmacyId: '', redeemed: true, description: 'Maximal 5 Täglich einnehmen', imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Ulrike Stock', expireDate: '05.08.2019', medicine: 'Penicillin', amount: '100mg', medicineId: '429e0d86-87a5-11e9-bc42-526af7764f64', insuranceId: '3', pharmacyId: '', redeemed: true, description: 'Nach dem Mitagessen einnehmen', imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Ulrike Stock', expireDate: '10.08.2019', medicine: 'Paracetamol', amount: '1200mg', medicineId: '468171e0-87a5-11e9-bc42-526af7764f64', insuranceId: '3', pharmacyId: '', redeemed: false, description: 'Einnahme nach Bedarf', imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'}

    ];

    // TODO
    const pharmacies = [
        { insuranceId: '1', pharmacyId: 1},
        { insuranceId: '1', pharmacyId: 2},
        { insuranceId: '1', pharmacyId: 4},
        { insuranceId: '1', pharmacyId: 5},
    ];

    dbo.collection('user').insertMany(user, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

    dbo.collection('prescriptions').insertMany(prescriptions, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

    dbo.collection('pharmacies').insertMany(pharmacies, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

});
