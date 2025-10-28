const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payments');
const activityRoutes = require('./routes/activities');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');

// Import database
const { sequelize, testConnection } = require('./config/database');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', auth, cartRoutes);
app.use('/api/orders', auth, orderRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/activities', activityRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Luxury Watches API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Example data (replace with your database logic)
const maleWatches = [
  { id: 1, name: "Rolex Submariner", gender: "male" },
  { id: 2, name: "Omega Seamaster", gender: "male" }
];
const femaleWatches = [
  { id: 3, name: "Cartier Tank", gender: "female" },
  { id: 4, name: "Chanel J12", gender: "female" }
];

// Endpoint for male watches
app.get('/api/watches/male', (req, res) => {
  res.json(maleWatches);
});

// Endpoint for female watches
app.get('/api/watches/female', (req, res) => {
  res.json(femaleWatches);
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
    });
});

// Database connection
const connectDB = async () => {
    try {
        await testConnection();
        console.log('✅ MySQL database connected successfully');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
        console.log(`💳 Payment service: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}`);
        console.log(`☁️  Cloud storage: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}`);
    });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

module.exports = app;