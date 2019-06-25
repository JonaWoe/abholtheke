ObjectId = require('mongodb').ObjectID;
const cryptoService = require('./../authentication/crypto.service');

module.exports = {

    getPrescriptionById: function(dbo, _id) {
        return dbo.collection('prescriptions').findOne(ObjectId(_id));
    },

    getPrescriptionsByInsuranceId: function(dbo, insuranceId) {
       return dbo.collection('prescriptions').find({insuranceId: insuranceId}).toArray();
    },

    getPrescriptionsByPharmacyId: function(dbo, pharmacyId) {
        return dbo.collection('prescriptions').find({pharmacyId: pharmacyId}).toArray();
    },

    updatePrescriptionPharmacyId: function (dbo, prescriptionId, pharmacyId) {
        const encryptedDate = cryptoService.encrypt(JSON.stringify(new Date()));
        return  dbo.collection('prescriptions').findOneAndUpdate({_id: ObjectId(prescriptionId)}, {$set: {pharmacyId: pharmacyId, assignedAt: encryptedDate }});
    },

    updatePrescriptionRedeemed: function (dbo, prescriptionId, redeemed) {
        return  dbo.collection('prescriptions').findOneAndUpdate({_id: ObjectId(prescriptionId)}, {$set: {redeemed: redeemed}});
    },

    updatePrescriptionReady: function (dbo, prescriptionId, ready) {
        return  dbo.collection('prescriptions').findOneAndUpdate({_id: ObjectId(prescriptionId)}, {$set: {ready: ready}});
    },

    decryptPrescriptions(prescriptions) {
        let decryptedPrescriptions = [];
        for (let prescription of prescriptions) {
            const decryptedPrescription = {
                _id: prescription._id,
                insuranceId: prescription.insuranceId,
                pharmacyId: prescription.pharmacyId,
                issuedBy: cryptoService.decrypt(prescription.issuedBy),
                expireDate: cryptoService.decrypt(prescription.expireDate),
                medicine: cryptoService.decrypt(prescription.medicine),
                amount: cryptoService.decrypt(prescription.amount),
                medicineId: cryptoService.decrypt(prescription.medicineId),
                redeemed: JSON.parse(cryptoService.decrypt(prescription.redeemed)),
                ready: JSON.parse(cryptoService.decrypt(prescription.ready)),
                time: JSON.parse(cryptoService.decrypt(prescription.time)),
                duration: cryptoService.decrypt(prescription.duration),
                description: cryptoService.decrypt(prescription.description),
                imgUrl: cryptoService.decrypt(prescription.imgUrl),
                assignedAt:JSON.parse(cryptoService.decrypt(prescription.assignedAt))
            };
            decryptedPrescriptions.push(decryptedPrescription);
        }
        return decryptedPrescriptions;
    }
};
