const express = require('express');
const router = express.Router();
const pharmaciesService = require('./pharmacies.service');

router.get('/', async function (req, res) {
    const dbo = req.app.locals.dbo;
    try {
        const pharmacies = await pharmaciesService.getPharmacies(dbo);
        res.status(200).json(pharmacies);
    } catch(err) {
        res.status(503).json({message: 'No DB connection!'});
        console.log(err);
    }
});

module.exports = router;
