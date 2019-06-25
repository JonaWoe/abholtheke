const express = require('express');
const router = express.Router();
const prescriptionService = require('./prescriptions.service');
const jwt = require('./../authentication/jwt.service');


router.get('/:insuranceId', async function (req, res) {

    // split and verify token
    const accessToken = req.header('authorization').split(' ')[1];
    const verifiedToken = jwt.verify(accessToken);
    // get insuranceId out of path parameter
    const insuranceId = req.params.insuranceId;

    // continue if token ist valid, role is 1 (user) and same insuranceId
    if (verifiedToken && verifiedToken.role === 1 && verifiedToken.insuranceId === insuranceId ) {
        try {
            const dbo = req.app.locals.dbo;
            const prescriptions = await prescriptionService.getPrescriptionsByInsuranceId(dbo, insuranceId);
            const decryptedPrescriptions = prescriptionService.decryptPrescriptions(prescriptions);
            res.status(200).json(decryptedPrescriptions);
        } catch (err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    } else {
        res.status(401).json({message: 'Nutzer nicht authorisiert'});
    }

});

router.get('/pharmacy/:pharmacyId', async function (req, res) {

    // split and verify token
    const accessToken = req.header('authorization').split(' ')[1];
    const verifiedToken = jwt.verify(accessToken);
    // get insuranceId out of path parameter
    const pharmacyId = req.params.pharmacyId;

    // continue if token ist valid, role is 1 (user) and same insuranceId

    if (verifiedToken && verifiedToken.role === 2 && verifiedToken.pharmacyId === pharmacyId ) {
        try {
            const dbo = req.app.locals.dbo;
            const prescriptions = await prescriptionService.getPrescriptionsByPharmacyId(dbo, pharmacyId);
            const decryptedPrescriptions = prescriptionService.decryptPrescriptions(prescriptions);
            res.status(200).json(decryptedPrescriptions);
        } catch (err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    } else {
        res.status(401).json({message: 'Nutzer nicht authorisiert'});
    }

});

router.post('/', async (req, res) => {

    // split and verify token
    const accessToken = req.header('authorization').split(' ')[1];
    const verifiedToken = jwt.verify(accessToken);

    if (verifiedToken && verifiedToken.role === 1) {

        const prescriptionId = req.body.prescriptionId;
        const pharmacyId = req.body.pharmacyId;
        const dbo = req.app.locals.dbo;

        // Load prescription
        const prescription = await prescriptionService.getPrescriptionById(dbo, prescriptionId);

        // Check for same insuranceId and update after
        if (prescription.insuranceId  === verifiedToken.insuranceId) {
            try {
                prescriptionService.updatePrescriptionPharmacyId(dbo, prescriptionId, pharmacyId);
                res.status(201).json({status: "Updated"});
            } catch(err) {
                res.status(503).json({message: 'Keine DB Verbindung!'});
                console.log(err);
            }
        } else {
            res.status(401).json({message: 'Nutzer nicht authorisiert'});
        }
    } else {
        res.status(401).json({message: 'Nutzer nicht authorisiert'});
    }
});

module.exports = router;
