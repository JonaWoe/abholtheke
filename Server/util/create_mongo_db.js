const cryptoService = require('./../authentication/crypto.service');
const {ObjectId} = require("mongodb");
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
        { insuranceId: '1', firstName: 'Max', lastName: 'Mustermann', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'max.mustermann@gmail.com', role: 1 },
        { insuranceId: '2', firstName: 'Hans', lastName: 'Maier', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'hans.maier@gmail.com', role: 1 },
        { insuranceId: '3', firstName: 'Peter', lastName: 'Schmidt', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'peter.schmidt@gmail.com', role: 1 },
        { insuranceId: '4', firstName: 'Jan', lastName: 'Müller', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'jan.müller@gmail.com', role: 1 },
        { insuranceId: '5', firstName: 'Stefen', lastName: 'Burger', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', eMail: 'stefen.burger@gmail.com', role: 1}];

    //Mock Data for prescriptions
    const prescriptions = [
        { issuedBy: 'Dr. med. Gerald Stein',   expireDate: '01.08.2019', medicine: 'Ibuprofen',   amount: '600mg', medicineId: '7f428de0-87a3-11e9-bc42-526af7764f64', insuranceId: '1', pharmacyId: '',                         assignedAt:'', ready: false, redeemed: false, time: [6,12,18],  duration:'3', description:'Mit Wasser schlucken',  imgUrl: 'https://www.oxfordonlinepharmacy.co.uk/images/products/IMG_5707.jpg'},
        { issuedBy: 'Dr. med. Gerald Stein',   expireDate: '05.08.2019', medicine: 'Thomapyrin',  amount: '300mg', medicineId: '245add5e-87a5-11e9-bc42-526af7764f64', insuranceId: '1', pharmacyId: '5d0defbcc340ba37a80f73c0', assignedAt:'', ready: false, redeemed: false, time: [7,13,18],  duration:'2', description:'Nach dem Essen',        imgUrl: 'https://www.europa-apotheek.com/pix/productphotos/0624605.jpg'},
        { issuedBy: 'Dr. med. Gerald Stein',   expireDate: '10.08.2019', medicine: 'Aspirin',     amount: '500mg', medicineId: '2b8530d4-87a5-11e9-bc42-526af7764f64', insuranceId: '1', pharmacyId: '5d0defbcc340ba37a80f73c0', assignedAt:'', ready: true,  redeemed: true,  time: [8,14,18],  duration:'1', description:'In Wasser auflösen',    imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '01.08.2019', medicine: 'Mucosolvan',  amount: '500ml', medicineId: '3004de84-87a5-11e9-bc42-526af7764f64', insuranceId: '1', pharmacyId: '',                         assignedAt:'', ready: false, redeemed: false, time: [9,15,18],  duration:'5', description:'Schlucken',             imgUrl: 'https://www.docmorris.de/images/produkte/large/00057879/MucosolvanRetardkapseln75mg.jpg'},
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '05.08.2019', medicine: 'Dobendan',    amount: '600mg', medicineId: '34bd3570-87a5-11e9-bc42-526af7764f64', insuranceId: '2', pharmacyId: '',                         assignedAt:'', ready: false, redeemed: false, time: [10,16,18], duration:'3', description:'Lutschen',              imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Marcel Schmidt', expireDate: '10.08.2019', medicine: 'Snup',        amount: '100ml', medicineId: '3948e512-87a5-11e9-bc42-526af7764f64', insuranceId: '2', pharmacyId: '',                         assignedAt:'', ready: false, redeemed: false, time: [6,17,20],  duration:'4', description:'Ohne Wasser schlucken', imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Ulrike Stock',   expireDate: '01.08.2019', medicine: 'GeloMyrtol',  amount: '400mg', medicineId: '3db895fc-87a5-11e9-bc42-526af7764f64', insuranceId: '3', pharmacyId: '5d0defbcc340ba37a80f73c1', assignedAt:'', ready: true,  redeemed: true,  time: [7,12,18],  duration:'6', description:'Mit Wasser schlucken',  imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Ulrike Stock',   expireDate: '05.08.2019', medicine: 'Penicillin',  amount: '100mg', medicineId: '429e0d86-87a5-11e9-bc42-526af7764f64', insuranceId: '3', pharmacyId: '5d0defbcc340ba37a80f73c1', assignedAt:'', ready: true,  redeemed: false, time: [8,11,15],  duration:'4', description:'Vor dem Essen',         imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'},
        { issuedBy: 'Dr. med. Ulrike Stock',   expireDate: '10.08.2019', medicine: 'Paracetamol', amount: '120mg', medicineId: '468171e0-87a5-11e9-bc42-526af7764f64', insuranceId: '3', pharmacyId: '',                         assignedAt:'', ready: false, redeemed: false, time: [9,12,18],  duration:'3', description:'Mit Wasser schlucken',  imgUrl: 'https://static.shop-apotheke.com/images/245x245/aspirin-plus-c-brausetabletten-brausetabletten-D01406632-p1.jpg'}

    ];

    let encryptedPrescriptions = [];

    for (let prescription of prescriptions) {
        const encryptedPrescription = {
            issuedBy: cryptoService.encrypt(prescription.issuedBy),
            expireDate: cryptoService.encrypt(prescription.expireDate),
            medicine: cryptoService.encrypt(prescription.medicine),
            amount: cryptoService.encrypt(prescription.amount),
            medicineId: cryptoService.encrypt(prescription.medicineId),
            insuranceId: prescription.insuranceId,
            pharmacyId: prescription.pharmacyId,
            redeemed: cryptoService.encrypt(JSON.stringify(prescription.redeemed)),
            ready: cryptoService.encrypt(JSON.stringify(prescription.ready)),
            time: cryptoService.encrypt(JSON.stringify(prescription.time)),
            duration: cryptoService.encrypt(prescription.duration),
            description: cryptoService.encrypt(prescription.description),
            imgUrl: cryptoService.encrypt(prescription.imgUrl),
            assignedAt: cryptoService.encrypt(JSON.stringify(prescription.assignedAt))
        };
        encryptedPrescriptions.push(encryptedPrescription);
    }

    const pharmacies = [
        { _id: ObjectId('5d0defbcc340ba37a80f73c0'), name:'Zentral Apotheke', address: 'Kaiserstr. 112 76133 Karlsruhe', openingHours: '08:30-20:00', phone: '0721 913330', price: '150,40€', stock: 'true'},
        { _id: ObjectId('5d0defbcc340ba37a80f73c1'), name:'Hauptpost-Apotheke Karlsruhe', address: 'Kaiserstr. 156 76133 Karlsruhe', openingHours: '08:30-19:00', phone: '0721 28603', price: '155,40€', stock: 'false'},
        { _id: ObjectId('5d0defbcc340ba37a80f73c2'), name:'Hof-Apotheke', address: 'Kaiserstr. 201 76133 Karlsruhe', openingHours: '08:30-19:00', phone: '0721 24591', price: '160,70€', stock: 'false'},
        { _id: ObjectId('5d0defbcc340ba37a80f73c3'), name:'Congress Apotheke', address: 'Ettlinger Str. 5 76137 Karlsruhe', openingHours: '08:30-18:00', phone: '0721 356360', price: '139,15', stock:'true'},
    ];

    const pharmacists = [
        { firstName: 'Kai', lastName: 'Uwe', eMail: 'kai.uwe@gmail.com', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', role: 2, pharmacyId: '5d0defbcc340ba37a80f73c0'},
        { firstName: 'Lara', lastName: 'Croft', eMail: 'lara.croft@yahoo.com', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', role: 2, pharmacyId: '5d0defbcc340ba37a80f73c1'},
        { firstName: 'Luke', lastName: 'Skywalker', eMail: 'luke.skywalker@fremail.com', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', role: 2, pharmacyId: '5d0defbcc340ba37a80f73c2'},
        { firstName: 'Jones', lastName: 'Indiana', eMail: 'jones.indiana@googlemail.com', password: '$2a$10$iWGoWqfrJSuzP0PRdRZoEOfgyCl.Zo7T4IKe0zr93JzWJab6Hzvcq', role: 2, pharmacyId: '5d0defbcc340ba37a80f73c3'},
    ];

    const boxes = [
        { pharmacyId: '5d0defbcc340ba37a80f73c0', boxNumber: '1', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c0', boxNumber: '2', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c0', boxNumber: '3', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c1', boxNumber: '1', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c1', boxNumber: '2', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c1', boxNumber: '3', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c2', boxNumber: '1', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c2', boxNumber: '2', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c2', boxNumber: '3', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c3', boxNumber: '1', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c3', boxNumber: '2', prescriptionId:'', status: 'empty', date:'' },
        { pharmacyId: '5d0defbcc340ba37a80f73c3', boxNumber: '3', prescriptionId:'', status: 'empty', date:'' }
    ];



    dbo.collection('users').insertMany(user, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

    dbo.collection('prescriptions').insertMany(encryptedPrescriptions, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

    dbo.collection('pharmacies').insertMany(pharmacies, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

    dbo.collection('pharmacists').insertMany(pharmacists, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

    dbo.collection('boxes').insertMany(boxes, function(err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
    });

});
