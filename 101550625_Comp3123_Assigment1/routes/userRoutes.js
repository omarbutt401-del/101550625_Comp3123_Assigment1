const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/signup', authLimiter, [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], userController.signup);

router.post('/login', authLimiter, [
    check('usernameOrEmail', 'Username or Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty()
], userController.login);

module.exports = router;