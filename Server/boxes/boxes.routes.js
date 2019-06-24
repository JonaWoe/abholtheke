const express = require('express');
const router = express.Router();
const jwt = require('./../authentication/jwt.service');
const boxesService = require('./boxes.service');

const usernameAndPassword = 'admin:admin';

router.get('/:pharmacyId', async function (req, res) {

    const accessToken = req.header('authorization').split(' ')[1];
    const verifiedToken = jwt.verify(accessToken);

    const pharmacyId = req.params.pharmacyId;

    if (verifiedToken && verifiedToken.role === 2 && verifiedToken.pharmacyId === pharmacyId ) {
        try {
            const dbo = req.app.locals.dbo;
            const boxes = await boxesService.getBoxesByPharmacyId(dbo, pharmacyId);
            res.status(200).json(boxes);
        } catch (err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    } else {
        res.status(401).json({message: 'Nutzer nicht authorisiert'});
    }
});

router.post('/prescription', async (req, res) => {

    const accessToken = req.header('authorization').split(' ')[1];
    const verifiedToken = jwt.verify(accessToken);

    const prescriptionId = req.body.prescriptionId;
    const boxId = req.body.boxId;
    const dbo = req.app.locals.dbo;

    const box = await boxesService.getBoxById(dbo, boxId);
    if (verifiedToken && verifiedToken.role === 2 && box && verifiedToken.pharmacyId === box.pharmacyId ) {
        try {
            boxesService.updateBoxPrescriptionId(dbo, boxId, prescriptionId);
            res.status(201).json({status: "Updated"});
        } catch(err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    } else {
        res.status(401).json({message: 'Nutzer nicht authorisiert'});
    }
});

router.post('/status', async (req, res) => {

    const token = req.header('authorization').split(' ')[1];
    const credentials = Buffer.from(token, 'base64').toString('ascii');

    if (credentials === usernameAndPassword) {
        const pharmacyId = req.body.pharmacyId;
        const boxNumber = req.body.boxNumber;
        const status = req.body.status;
        const dbo = req.app.locals.dbo;

        const box = await boxesService.getBoxByPharmacyIdAndNumber(dbo, pharmacyId, boxNumber);

        if (box) {
            try {
                boxesService.updateBoxStatus(dbo, box._id, status);
                res.status(201).json({status: "Updated"});
            } catch(err) {
                res.status(503).json({message: 'Keine DB Verbindung!'});
                console.log(err);
            }
        } else {
            res.status(404).json({message: 'Box wurde nicht gefunden!'});
        }
    } else {
        res.status(401).json({message: 'Nutzer nicht authorisiert'});
    }
});

module.exports = router;
