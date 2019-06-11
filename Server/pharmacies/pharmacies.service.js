module.exports = {

    getPharmaciesByInsuranceId: function(dbo, insuranceId) {
       return dbo.collection('pharmacies').find({insuranceId: insuranceId}).toArray();
    }

};
