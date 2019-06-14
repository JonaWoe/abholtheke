ObjectId = require('mongodb').ObjectID,

module.exports = {

    getPrescriptionsByInsuranceId: function(dbo, insuranceId) {
       return dbo.collection('prescriptions').find({insuranceId: insuranceId}).toArray();
    },

    getPrescriptionById: function(dbo, _id) {
        return dbo.collection('prescriptions').findOne(ObjectId(_id));
    },

    updatePrescriptionPharmacyId: function (dbo, prescriptionId, pharmacyId) {
        return  dbo.collection('prescriptions').findOneAndUpdate({_id: ObjectId(prescriptionId)}, {$set: {pharmacyId: pharmacyId}});
    }
};
