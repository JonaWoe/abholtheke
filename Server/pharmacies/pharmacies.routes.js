const express = require('express');
const router = express.Router();
const pharmaciesService = require('./pharmacies.service');
const jwt = require('./../authentication/jwt.service');

router.get('/', async function (req, res) {

    // split and verify token
    const accessToken = req.header('authorization').split(' ')[1];
    const verifiedToken = jwt.verify(accessToken);

    // continue if token ist valid and role is 1 (user)
    if (verifiedToken && verifiedToken.role === 1) {

        const dbo = req.app.locals.dbo;
        try {
            const pharmacies = await pharmaciesService.getPharmacies(dbo);
            res.status(200).json(pharmacies);
        } catch (err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    }
});

module.exports = router;
