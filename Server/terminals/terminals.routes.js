const express = require('express');
const router = express.Router();
const boxesService = require('../boxes/boxes.service');
const prescriptionService = require('../prescriptions/prescriptions.service');


router.get('/:prescriptionId', async function (req, res) {

    const prescriptionId = req.params.prescriptionId;
    try {
        const dbo = req.app.locals.dbo;
        const box = await boxesService.getBoxByPrescriptionId(dbo, prescriptionId);
        if (box) {
            res.status(200).json(box);
        } else {
            res.status(404).json({message: 'Rezept nicht gefunden'});
        }
    } catch (err) {
        res.status(503).json({message: 'Keine DB Verbindung!'});
        console.log(err);
    }

});

router.post('/startProcess/:prescriptionId', async function (req, res) {

    const prescriptionId = req.params.prescriptionId;
    const dbo = req.app.locals.dbo;

    const box = await boxesService.getBoxByPrescriptionId(dbo, prescriptionId);

    if (box) {
        // TODO
        // get infos to Prescription
        // start Process
        res.status(200).json();
    } else {
        res.status(400).json({message: 'Rezept nicht gefunden'});
    }

});

router.post('/openBox/:pharmacyId/:boxNumber', async function (req, res) {

    const pharmacyId = req.params.pharmacyId;
    const boxNumber = req.params.boxNumber;

    const dbo = req.app.locals.dbo;

    const box = await boxesService.getBoxByPharmacyIdAndNumber(dbo, pharmacyId, boxNumber);

    if (box) {
        try {
            boxesService.updateBoxDoorStatus(dbo, box._id, 'open');
            res.status(201).json({status: "Status Updated"});
        } catch(err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    } else {
        res.status(400).json({message: 'Box nicht gefunden'});
    }

});

router.post('/closeBox/:pharmacyId/:boxNumber', async function (req, res) {

    const pharmacyId = req.params.pharmacyId;
    const boxNumber = req.params.boxNumber;

    const dbo = req.app.locals.dbo;

    const box = await boxesService.getBoxByPharmacyIdAndNumber(dbo, pharmacyId, boxNumber);

    if (box) {
        try {
            boxesService.updateBoxDoorStatus(dbo, box._id, 'close');
            res.status(201).json({status: "Status Updated"});
        } catch(err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    } else {
        res.status(400).json({message: 'Box nicht gefunden'});
    }

});

module.exports = router;
