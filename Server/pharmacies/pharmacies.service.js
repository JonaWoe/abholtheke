module.exports = {

    getPharmacies: function(dbo) {
       return dbo.collection('pharmacies').find().toArray();
    }

};
