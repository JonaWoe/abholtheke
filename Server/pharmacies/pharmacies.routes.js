const express = require('express');
const router = express.Router();
const pharmaciesService = require('./pharmacies.service');

router.get('/:insuranceId', async function (req, res) {
    const dbo = req.app.locals.dbo;
    const insuranceId = req.params.insuranceId;
    try {
        const pharmacies = await pharmaciesService.getPharmaciesByInsuranceId(dbo, insuranceId);
        res.status(200).json(pharmacies);
    } catch(err) {
        res.status(503).json({message: 'No DB connection!'});
        console.log(err);
    }
});

module.exports = router;
