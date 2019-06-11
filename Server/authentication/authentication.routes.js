const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userService = require('../users/users.service')
const jwt = require('./jwt.service');


// REST API for authentication
router.post('/', async (req, res) => {
    const user = req.body;
    const dbo = req.app.locals.dbo;

    try {

        let existingUser = await userService.getUserByInsuranceId(dbo, user.insuranceId);

        if (existingUser && existingUser.password && bcrypt.compareSync(user.password, existingUser.password) ) {

            const payload = {
                insuranceId: existingUser.insuranceId,
                firstName:existingUser.firstName,
                lastName: existingUser.lastName,
                eMail: existingUser.eMail,
                role: existingUser.role
            };

            const token = jwt.sign(payload);

            let body = {
                id: existingUser.id,
                insuranceId: existingUser.insuranceId,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                eMail: existingUser.eMail,
                token: token
            };

            res.status(201).json(body);
        } else {
            res.status(400).json({message: 'Versicherungsnummer oder Passwort falsch!'});
        }
    } catch(err) {
        res.status(503).json({message: 'Keine DB Verbindung!'});
        console.log(err);
    }
});

router.post('/google', async (req, res) => {
    const user = req.body;
    const dbo = req.app.locals.dbo;

    try {

        let existingUser = await userService.getUserByGoogleId(dbo, user.googleId);

        if (existingUser && existingUser.googleIdToken &&  bcrypt.compareSync(user.googleIdToken, existingUser.googleIdToken) ) {

            const payload = {
                insuranceId: existingUser.insuranceId,
                firstName:existingUser.firstName,
                lastName: existingUser.lastName,
                eMail: existingUser.eMail,
                role: existingUser.role
            };

            const token = jwt.sign(payload);

            let body = {
                id: existingUser.id,
                insuranceId: existingUser.insuranceId,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                eMail: existingUser.eMail,
                token: token
            };

            res.status(201).json(body);
        } else {
            res.status(400).json({message: ' erforderlich!'});
        }
    } catch(err) {
        res.status(503).json({message: 'Keine DB Verbindung!'});
        console.log(err);
    }
});

module.exports = router;
