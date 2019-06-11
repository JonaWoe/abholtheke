const express = require('express');
const router = express.Router();
const userService = require('./users.service');

// REST API for user registration
router.post('/', async (req, res) => {
    const user = req.body;
    const dbo = req.app.locals.dbo;
    try {
        let existingUser = await userService.getUserByInsuranceId(dbo, user.insuranceId);
        if (!existingUser) {
            userService.createUser(dbo, user);
            res.status(201).json({status: "Erstellt"});
        } else {
            res.status(400).json({message: 'Versicherungsnummer "' + user.insuranceId + '" bereits vergeben.'});
        }
    } catch(err) {
        res.status(503).json({message: 'Keine DB Verbindung!'});
        console.log(err);
    }
});

module.exports = router;

