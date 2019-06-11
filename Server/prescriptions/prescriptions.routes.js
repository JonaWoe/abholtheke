const express = require('express');
const router = express.Router();
const prescriptionService = require('./prescriptions.service');
const jwt = require('./../authentication/jwt.service');

router.get('/:insuranceId', async function (req, res) {

    // split and verify token
    const accessToken = req.header('authorization').split(' ')[1];
    const verifiedToken = jwt.verify(accessToken);


    // continue if token ist valid and role is 1 (user)
    if (verifiedToken && verifiedToken.role === 1) {
        const dbo = req.app.locals.dbo;
        const insuranceId = req.params.insuranceId;
        try {
            const prescriptions = await prescriptionService.getPrescriptionsByInsuranceId(dbo, insuranceId);
            res.status(200).json(prescriptions);
        } catch (err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    } else {
        res.status(401).json({message: 'Nutzer nicht authorisiert'});
    }

});

module.exports = router;
