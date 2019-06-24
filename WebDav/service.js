module.exports = {

    getPrescriptionsByInsuranceId: function(dbo, insuranceId) {
        return dbo.collection('prescriptions').find({insuranceId: insuranceId}).toArray();
    },

    getUsers: function(dbo) {
        return dbo.collection('users').find().toArray();
    }

};
