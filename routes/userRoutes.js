const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { signupValidator, loginValidator } = require('../validators/userValidator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/signup', authLimiter, signupValidator, userController.signup);
router.post('/login',  authLimiter, loginValidator,  userController.login);

module.exports = router;
