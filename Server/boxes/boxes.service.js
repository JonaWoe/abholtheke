ObjectId = require('mongodb').ObjectID,

module.exports = {

    getBoxById: function(dbo, _id) {
        return dbo.collection('boxes').findOne(ObjectId(_id));
    },

    getBoxesByPharmacyId: function(dbo, pharmacyId) {
       return dbo.collection('boxes').find({pharmacyId: pharmacyId}).toArray();
    },

    getBoxByPharmacyIdAndNumber: function(dbo, pharmacyId, boxNumber) {
        return dbo.collection('boxes').findOne({pharmacyId: pharmacyId, boxNumber: boxNumber});
    },

    updateBoxPrescriptionIdAndStatus: function (dbo, _id, prescriptionId, status) {
        return  dbo.collection('boxes').findOneAndUpdate({_id: ObjectId(_id)}, {$set: {prescriptionId: prescriptionId, status: status, date: new Date()}});
    },

    updateBoxStatus: function (dbo, _id, status) {
        return  dbo.collection('boxes').findOneAndUpdate({_id: ObjectId(_id)}, {$set: {status:status, date: new Date()}});
    }
};
