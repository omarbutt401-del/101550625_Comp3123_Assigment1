const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        let userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(409).json({ status: false, message: 'Username or Email already registered.' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        return res.status(201).json({
            status: true,
            message: 'User registered successfully.'
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { usernameOrEmail, password } = req.body;

    try {
        //Query matching either username or email
        const user = await User.findOne({
            $or: [{ email: usernameOrEmail.toLowerCase() }, { username: usernameOrEmail }]
        });

        if (!user) {
            return res.status(400).json({ status: false, message: 'Invalid Username/Email or Password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: false, message: 'Invalid Username/Email or Password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        return res.status(200).json({
            status: true,
            message: 'Authentication successful.',
            jwt: token
        });
    } catch (error) {
        next(error);
    }
};