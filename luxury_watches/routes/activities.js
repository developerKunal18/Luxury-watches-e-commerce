const express = require('express');
const { body, validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const { protect, authorize } = require('../middleware/auth');
const { trackActivity } = require('../middleware/activityTracker');
const router = express.Router();

// @desc    Track frontend activity
// @route   POST /api/activities/track
// @access  Public (but requires session)
router.post('/track', [
    body('activityType').notEmpty().withMessage('Activity type is required'),
    body('activityData').optional().isObject(),
    body('page').optional().isObject(),
    body('device').optional().isObject(),
    body('performance').optional().isObject()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            activityType,
            activityData = {},
            page = {},
            device = {},
            performance = {},
            productId,
            orderId,
            error
        } = req.body;

        // Get session ID from cookie or generate new one
        let sessionId = req.cookies.sessionId;
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            res.cookie('sessionId', sessionId, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
        }

        // Create activity record
        const activity = new Activity({
            user: req.user ? req.user._id : null,
            sessionId,
            ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
            userAgent: req.get('User-Agent'),
            activityType,
            activityData,
            product: productId || null,
            order: orderId || null,
            page: {
                url: page.url || req.originalUrl,
                title: page.title || '',
                referrer: page.referrer || req.get('Referer') || '',
                path: page.path || req.path
            },
            device: {
                type: device.type || 'desktop',
                browser: device.browser || 'Unknown',
                os: device.os || 'Unknown',
                screenResolution: device.screenResolution || '',
                language: device.language || 'en',
                timezone: device.timezone || 'UTC'
            },
            performance: {
                pageLoadTime: performance.pageLoadTime || null,
                apiResponseTime: null
            },
            error: error || null,
            status: error ? 'failed' : 'success',
            metadata: {
                method: req.method,
                headers: {
                    'content-type': req.get('Content-Type'),
                    'accept': req.get('Accept'),
                    'accept-language': req.get('Accept-Language')
                }
            }
        });

        await activity.save();

        res.status(200).json({
            status: 'success',
            message: 'Activity tracked successfully'
        });
    } catch (error) {
        console.error('Activity tracking error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to track activity',
            error: error.message
        });
    }
});

// @desc    Get user activity history
// @route   GET /api/activities/user/:userId
// @access  Private (Admin or own user)
router.get('/user/:userId', protect, async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, page = 1, activityType } = req.query;

        // Check if user can access this data
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to access this user\'s activities'
            });
        }

        const query = { user: userId };
        if (activityType) {
            query.activityType = activityType;
        }

        const activities = await Activity.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('product', 'name brand price image')
            .populate('order', 'orderNumber total status');

        const total = await Activity.countDocuments(query);

        res.status(200).json({
            status: 'success',
            data: {
                activities,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    total
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user activities',
            error: error.message
        });
    }
});







module.exports = router;
