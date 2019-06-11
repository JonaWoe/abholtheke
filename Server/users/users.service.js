const bcrypt = require('bcryptjs');

// Middleware for user oriented DB operations
module.exports = {

    createUser: function(dbo, user) {

        if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
        }

        if (user.googleIdToken) {
            user.googleIdToken = bcrypt.hashSync(user.googleIdToken, 10);
        }

        dbo.collection('user').insertOne(user, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
        });
    },

    getUserByInsuranceId: function(dbo, insuranceId) {
        return dbo.collection('user').findOne({insuranceId: insuranceId});
    },

    getUserByGoogleId: function(dbo, googleId) {
        return dbo.collection('user').findOne({googleId: googleId});
    }
};
