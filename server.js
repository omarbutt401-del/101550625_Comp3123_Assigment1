require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// DB Connection
connectDB();

// Security + parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/api/', apiLimiter);

// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms | UserID: ${req.user ? req.user.id : 'Unauthenticated'}`);
    });
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
    });
});

// API routes
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/emp', require('./routes/employeeRoutes'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ status: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Malformed JSON handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: false, message: 'Malformed JSON in request body.' });
    }
    next(err);
});

// Centralized error handler
app.use((err, req, res, next) => {
    logger.error(`Internal Error: ${err.message}`);
    res.status(err.status || 500).json({
        status: false,
        message: err.message || 'An internal server error occurred.'
    });
});

// Process-level safety nets
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
});
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    logger.info(`[Server] Live deployment operational on port ${PORT}`);
    console.log(`[Server] Live deployment operational on port ${PORT}`);
});