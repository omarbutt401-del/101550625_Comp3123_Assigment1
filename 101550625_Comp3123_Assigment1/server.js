require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

//Establish DB Connection
connectDB();

// Security Enhancements
app.use(helmet());
app.use(express.json());
app.use('/api/', apiLimiter);

//Local File Logger Middleware
const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'app.log'), { flags: 'a' });
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLine = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms | UserID: ${req.user ? req.user.id : 'Unauthenticated'}\n`;
        logStream.write(logLine);
    });
    next();
});

// Mounting API Core Routes
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/emp', require('./routes/employeeRoutes'));

// Mandatory Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
    });
});

//Centralized Error handling Middleware
app.use((err, req, res, next) => {
    const errorMessage = `[${new Date().toISOString()}] Internal Error: ${err.message}\n${err.stack}\n`;
    logStream.write(errorMessage);

    res.status(500).json({
        status: false,
        message: 'An internal server error occurred.'
    });
});

//Bind Port
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`[Server] Live deployment operational on port ${PORT}`);
});