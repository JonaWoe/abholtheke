const express = require('express');
const router = express.Router();
const jwt = require('./../authentication/jwt.service');
const boxesService = require('./boxes.service');
const prescriptionService = require('../prescriptions/prescriptions.service');
const request = require('request');

const usernameAndPassword = 'admin:admin';

router.get('/', async function (req, res) {
    console.log('worked');
    res.status(200).json({boxStatus: 'open'});
});


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

router.get('/:pharmacyId/:boxNumber', async function (req, res) {

    const accessToken = req.header('authorization').split(' ')[1];
    const verifiedToken = jwt.verify(accessToken);

    const pharmacyId = req.params.pharmacyId;
    const boxNumber = req.params.boxNumber;

    if (verifiedToken && verifiedToken.role === 2 && verifiedToken.pharmacyId === pharmacyId ) {
        try {
            const dbo = req.app.locals.dbo;
            const box = await boxesService.getBoxByPharmacyIdAndNumber(dbo, pharmacyId, boxNumber);
            res.status(200).json(box);
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
        if (box.status === 'empty') {
            try {
                boxesService.updateBoxPrescriptionIdAndStatus(dbo, boxId, prescriptionId, 'inProcess');
                res.status(201).json({status: "Updated"});
            } catch(err) {
                res.status(503).json({message: 'Keine DB Verbindung!'});
                console.log(err);
            }
        } else {
            res.status(406).json({message: 'Box ist bereits belegt'});
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
            if (box.prescriptionId) {
                try {
                    if (status === 'stored') {
                        boxesService.updateBoxStatus(dbo, box._id, status);
                        prescriptionService.updatePrescriptionReady(dbo, box.prescriptionId, true);
                        res.status(201).json({status: "Updated"});
                    } else if (status === 'pickedUp') {
                        prescriptionService.updatePrescriptionRedeemed(dbo, box.prescriptionId, true);
                        boxesService.updateBoxPrescriptionIdAndStatus(dbo,box._id, '', 'empty');

                        const prescription = await prescriptionService.getPrescriptionById(dbo, box.prescriptionId);

                        const endpointUrl = 'https://camunda-demo-brsk4km66q-uc.a.run.app';
                        const body = {
                            processInstanceId: prescription.processId,
                            messageName: "Message_medizinEntnehmen"
                        };
                        try {
                            request.post({headers: {'content-type' : 'application/json'}, url: endpointUrl + '/engine-rest/message', body: JSON.stringify(body)}, async function (error, response, body) {
                                if (error || response.statusCode !== 204) {
                                    console.log(response.statusCode)
                                }
                            });
                        } catch (error) {
                            console.log(error);
                        }
                        res.status(201).json({status: "Updated"});
                    } else {
                        res.status(404).json({status: "Status not found"});
                    }
                } catch(err) {
                    res.status(503).json({message: 'Keine DB Verbindung!'});
                    console.log(err);
                }
            } else {
                res.status(400).json({message: 'Kein Rezept zugeordnet!'});
            }
        } else {
            res.status(404).json({message: 'Box wurde nicht gefunden!'});
        }
    } else {
       res.status(401).json({message: 'Nutzer nicht authorisiert'  + req.body});
    }
});

module.exports = router;
