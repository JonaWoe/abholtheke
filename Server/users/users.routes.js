const express = require('express');
const router = express.Router();
const userService = require('./users.service');

router.get('/', function (req, res) {
    res.send('Hello World!');
});

// REST API for user registration
router.post('/', async (req, res) => {
    const user = req.body;
    const dbo = req.app.locals.dbo;
    try {
        let existingUser = await userService.getUserByInsuranceId(dbo, user.insuranceId);
        if (!existingUser) {
            userService.createUser(dbo, user);
            res.status(201).json({status: "created"});
        } else {
            res.status(400).json({message: 'Insurance ID "' + user.insuranceId + '" is already taken.'});
        }
    } catch(err) {
        res.status(503).json({message: 'No DB connection!'});
        console.log(err);
    }
});

router.post('/google', async (req, res) => {
    const user = req.body;
    const dbo = req.app.locals.dbo;
    try {
        let existingUser = await userService.getUserByInsuranceId(dbo, user.insuranceId);
        if (!existingUser) {
            userService.createUser(dbo, user);
            res.status(201).json({status: "created"});
        } else {
            res.status(400).json({message: 'Insurance ID "' + user.insuranceId + '" is already taken.'});
        }
    } catch(err) {
        res.status(503).json({message: 'No DB connection!'});
        console.log(err);
    }
});

module.exports = router;

