const express = require('express');
const user = require('../models/user');
const router = express.Router();

router.post('/register', async(req, res) => {
    try {
        const user = await user.create(req.body);

        return res.send({ user });

    } catch (err) {
        return res.status(400).send( { error: 'Registration failed' });
    }
});

module.exports = app => app.use('/auth', router);