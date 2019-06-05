const bcrypt = require('bcryptjs');

// Middleware for user oriented DB operations
module.exports = {

    createUser: function(dbo, user) {

        user.password = bcrypt.hashSync(user.password, 10);

        dbo.collection('user').insertOne(user, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
        });
    },

    getUserByInsuranceId: function(dbo, insuranceId) {
        return dbo.collection('user').findOne({insuranceId: insuranceId});
    }
};
