const express = require('express');
const bcripty = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/user');

const router = express.Router();

router.post('/register', async(req, res) => {
    const { email } = req.body;
    
    try {
        if (await User.findOne({ email }))
            return res.status(400).send( { error: 'User already existis' });

        const user = await User.create(req.body);

        user.password = undefined; 

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400,         
        });

        return res.send({ user, token });

    } catch (err) {
        return res.status(400).send( { error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
 
    if (!user) {
        return res.status(400).send({ error: 'User not found' });
    }

    if (!await bcripty.compare(password, user.password )) {
        return res.status(400).send({ error: 'Invalid password' });
    }
});

module.exports = app => app.use('/auth', router);