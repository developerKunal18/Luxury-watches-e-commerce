const Activity = require('../models/Activity');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Generate session ID
const generateSessionId = () => {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get client IP address
const getClientIP = (req) => {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.headers['x-forwarded-for']?.split(',')[0] ||
           '127.0.0.1';
};

// Parse user agent
const parseUserAgent = (userAgent) => {
    const ua = userAgent || '';
    
    // Simple device detection
    let deviceType = 'desktop';
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        deviceType = 'mobile';
    } else if (/iPad|Android.*Tablet|Windows.*Touch/i.test(ua)) {
        deviceType = 'tablet';
    }
    
    // Browser detection
    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';
    
    // OS detection
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';
    
    return {
        type: deviceType,
        browser,
        os,
        userAgent: ua
    };
};

// Main activity tracking middleware
const trackActivity = (activityType, options = {}) => {
    return async (req, res, next) => {
        try {
            const startTime = Date.now();
            
            // Get session ID from cookie or generate new one
            let sessionId = req.cookies.sessionId;
            if (!sessionId) {
                sessionId = generateSessionId();
                res.cookie('sessionId', sessionId, {
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });
            }
            
            // Prepare activity data
            const activityData = {
                user: req.user ? req.user._id : null,
                sessionId,
                ipAddress: getClientIP(req),
                userAgent: req.get('User-Agent'),
                activityType,
                activityData: options.activityData || {},
                product: options.productId || null,
                order: options.orderId || null,
                page: {
                    url: req.originalUrl,
                    title: options.pageTitle || '',
                    referrer: req.get('Referer') || '',
                    path: req.path
                },
                device: parseUserAgent(req.get('User-Agent')),
                location: options.location || {},
                performance: {
                    pageLoadTime: options.pageLoadTime || null,
                    apiResponseTime: null // Will be set after response
                },
                error: options.error || null,
                status: 'success',
                metadata: {
                    method: req.method,
                    headers: {
                        'content-type': req.get('Content-Type'),
                        'accept': req.get('Accept'),
                        'accept-language': req.get('Accept-Language')
                    },
                    ...options.metadata
                }
            };
            
            // Store original res.json and res.send methods
            const originalJson = res.json;
            const originalSend = res.send;
            
            // Override res.json to track response time
            res.json = function(data) {
                activityData.performance.apiResponseTime = Date.now() - startTime;
                
                // Track the activity asynchronously
                trackActivityAsync(activityData);
                
                return originalJson.call(this, data);
            };
            
            // Override res.send to track response time
            res.send = function(data) {
                activityData.performance.apiResponseTime = Date.now() - startTime;
                
                // Track the activity asynchronously
                trackActivityAsync(activityData);
                
                return originalSend.call(this, data);
            };
            
            next();
        } catch (error) {
            console.error('Activity tracking error:', error);
            next(); // Continue even if tracking fails
        }
    };
};

// Async function to save activity to database
const trackActivityAsync = async (activityData) => {
    try {
        const activity = new Activity(activityData);
        await activity.save();
    } catch (error) {
        console.error('Failed to save activity:', error);
    }
};

// Specific tracking functions for different activities
const trackUserActivity = (activityType, options = {}) => {
    return trackActivity(activityType, {
        ...options,
        requireAuth: true
    });
};

const trackProductActivity = (activityType, options = {}) => {
    return trackActivity(activityType, {
        ...options,
        productId: options.productId
    });
};

const trackOrderActivity = (activityType, options = {}) => {
    return trackActivity(activityType, {
        ...options,
        orderId: options.orderId
    });
};

const trackPageView = (pageTitle) => {
    return trackActivity('page_view', {
        pageTitle,
        activityData: {
            timestamp: new Date()
        }
    });
};

const trackError = (error, severity = 'medium') => {
    return trackActivity('error_occurred', {
        error: {
            message: error.message,
            stack: error.stack,
            code: error.code || 'UNKNOWN_ERROR',
            severity
        },
        status: 'failed'
    });
};

// Frontend activity tracking helper
const trackFrontendActivity = async (activityType, activityData = {}, options = {}) => {
    try {
        const response = await fetch('/api/activities/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': options.token ? `Bearer ${options.token}` : ''
            },
            body: JSON.stringify({
                activityType,
                activityData,
                page: {
                    url: window.location.href,
                    title: document.title,
                    referrer: document.referrer,
                    path: window.location.pathname
                },
                device: {
                    type: getDeviceType(),
                    browser: getBrowserInfo(),
                    os: getOSInfo(),
                    screenResolution: `${screen.width}x${screen.height}`,
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                performance: {
                    pageLoadTime: performance.timing ? 
                        performance.timing.loadEventEnd - performance.timing.navigationStart : null
                },
                ...options
            })
        });
        
        if (!response.ok) {
            console.warn('Failed to track frontend activity:', response.statusText);
        }
    } catch (error) {
        console.warn('Frontend activity tracking error:', error);
    }
};

// Helper functions for frontend tracking
const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
};

const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
};

const getOSInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
};

// Batch tracking for performance
const batchTrackActivities = async (activities) => {
    try {
        await Activity.insertMany(activities, { ordered: false });
    } catch (error) {
        console.error('Batch activity tracking error:', error);
    }
};

// Cleanup old activities (run periodically)
const cleanupOldActivities = async (daysToKeep = 730) => { // 2 years default
    try {
        const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
        const result = await Activity.deleteMany({
            timestamp: { $lt: cutoffDate }
        });
        console.log(`Cleaned up ${result.deletedCount} old activities`);
        return result.deletedCount;
    } catch (error) {
        console.error('Activity cleanup error:', error);
        return 0;
    }
};

module.exports = {
    trackActivity,
    trackUserActivity,
    trackProductActivity,
    trackOrderActivity,
    trackPageView,
    trackError,
    trackFrontendActivity,
    batchTrackActivities,
    cleanupOldActivities,
    generateSessionId,
    getClientIP,
    parseUserAgent
};
