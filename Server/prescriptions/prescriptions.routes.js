const express = require('express');
const router = express.Router();
const prescriptionService = require('./prescriptions.service');

router.get('/:insuranceId', async function (req, res) {
    const dbo = req.app.locals.dbo;
    const insuranceId = req.params.insuranceId;
    try {
        const prescriptions = await prescriptionService.getPrescriptionsByInsuranceId(dbo, insuranceId);
        res.status(200).json(prescriptions);
    } catch(err) {
        res.status(503).json({message: 'No DB connection!'});
        console.log(err);
    }
});

module.exports = router;
