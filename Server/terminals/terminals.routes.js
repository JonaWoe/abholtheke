const express = require('express');
const router = express.Router();
const boxesService = require('../boxes/boxes.service');
const request = require('request');
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

    const endpointUrl = 'https://camunda-demo-brsk4km66q-uc.a.run.app';

    const body = {
        variables : {
            vip : { value : true},
            zahlungseingang : { value : false},
            validesDatum : { value : true},
            urlOpen: {value: 'https://abholtheke-1.appspot.com/terminals/openBox/' + box.pharmacyId + '/' + box.boxNumber, type: 'string'},
            urlClose: {value: 'https://abholtheke-1.appspot.com/terminals/closeBox/' + box.pharmacyId + '/' + box.boxNumber, type: 'string'}

        }
    };

    if (box) {
        request.post({headers: {'content-type' : 'application/json'}, url: endpointUrl + '/engine-rest/process-definition/key/ProzessMedizinAbholen/start', body: JSON.stringify(body)}, async function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const parsedBody = JSON.parse(body);

                try {
                    await prescriptionService.updatePrescriptionProcessId(dbo, prescriptionId, parsedBody.id);
                    res.status(200).json();
                } catch (err) {
                    res.status(503).json({message: 'Keine DB Verbindung!'});
                    console.log(err);
                }

            } else {
                console.log(response.statusCode);
                console.log(error);
                res.status(400).json({message: 'Rezept nicht gefunden'});
            }
        });
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
            boxesService.updateBoxDoorStatus(dbo, box._id, 'closed');
            res.status(201).json({status: "Status Updated"});
        } catch(err) {
            res.status(503).json({message: 'Keine DB Verbindung!'});
            console.log(err);
        }
    } else {
        res.status(400).json({message: 'Box nicht gefunden'});
    }

});

router.post('/status', async function (req, res) {
    console.log('Message received from Camunda');
    res.status(200).json({status: "OK"});
});

module.exports = router;
