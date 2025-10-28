const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'Account is deactivated'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized to access this route'
        });
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// Optional authentication - doesn't require token but adds user if available
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });
            
            if (user && user.isActive) {
                req.user = user;
            }
        } catch (error) {
            // Token is invalid, but we don't throw error for optional auth
        }
    }

    next();
};

// Check if user is the owner of the resource
const isOwner = (modelName) => {
    return async (req, res, next) => {
        try {
            const Model = require(`../models/${modelName}`);
            const resource = await Model.findByPk(req.params.id);

            if (!resource) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Resource not found'
                });
            }

            // Check if user is owner
            if (resource.userId && resource.userId !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Not authorized to access this resource'
                });
            }

            req.resource = resource;
            next();
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Server error'
            });
        }
    };
};

// Rate limiting for authentication attempts
const authRateLimit = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    protect,
    authorize,
    optionalAuth,
    isOwner,
    authRateLimit
}; 