module.exports = {

    getPharmacistByEmail: function(dbo, eMail) {
        return dbo.collection('pharmacists').findOne({eMail: eMail});
    }

};
