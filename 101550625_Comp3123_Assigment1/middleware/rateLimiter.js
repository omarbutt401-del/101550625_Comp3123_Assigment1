const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 min
    max: 20, // Limit each IP to 20 auth requests per window
    message: {
        status: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 mim
    max: 100, //Limit general request
    message: {
        status: false,
        message: 'Too many requests. Rate limit exceeded.'
    }
});

module.exports = { authLimiter, apiLimiter };