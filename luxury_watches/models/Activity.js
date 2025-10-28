const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // User Information
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    sessionId: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ipAddress: {
        type: DataTypes.STRING(45), // IPv6 support
        allowNull: false
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    
    // Activity Details
    activityType: {
        type: DataTypes.ENUM(
            // Authentication Activities
            'user_register',
            'user_login',
            'user_logout',
            'user_profile_view',
            'user_profile_update',
            'password_reset_request',
            'password_reset_complete',
            'email_verification',
            
            // Product Activities
            'product_view',
            'product_search',
            'product_filter',
            'product_add_to_cart',
            'product_remove_from_cart',
            'product_add_to_wishlist',
            'product_remove_from_wishlist',
            
            // Cart Activities
            'cart_view',
            'cart_update_quantity',
            'cart_clear',
            'cart_checkout_start',
            'cart_checkout_complete',
            'cart_checkout_abandoned',
            
            // Order Activities
            'order_create',
            'order_update',
            'order_cancel',
            'order_complete',
            'order_refund',
            
            // Payment Activities
            'payment_initiated',
            'payment_success',
            'payment_failed',
            'payment_refund',
            
            // Navigation Activities
            'page_view',
            'page_leave',
            'navigation_click',
            'menu_click',
            'footer_click',
            
            // Contact Activities
            'contact_form_submit',
            'newsletter_signup',
            'support_request',
            
            // Error Activities
            'error_occurred',
            'api_error',
            'validation_error',
            
            // System Activities
            'system_startup',
            'system_shutdown',
            'database_backup',
            'cache_clear'
        ),
        allowNull: false
    },
    
    // Activity Data
    activityData: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Product Information (if applicable)
    productId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    
    // Order Information (if applicable)
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    
    // Page Information
    page: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Device and Browser Information
    device: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Geographic Information
    location: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Performance Metrics
    performance: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Error Information (if applicable)
    error: {
        type: DataTypes.JSON,
        defaultValue: null
    },
    
    // Status
    status: {
        type: DataTypes.ENUM('success', 'failed', 'pending', 'cancelled'),
        defaultValue: 'success'
    },
    
    // Metadata
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Timestamps
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    
    // Expiration (for automatic cleanup)
    expiresAt: {
        type: DataTypes.DATE,
        defaultValue: function() {
            // Keep activities for 2 years by default
            return new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000);
        }
    }
}, {
    tableName: 'activities',
    indexes: [
        { fields: ['userId', 'timestamp'] },
        { fields: ['activityType', 'timestamp'] },
        { fields: ['sessionId', 'timestamp'] },
        { fields: ['ipAddress', 'timestamp'] },
        { fields: ['productId', 'timestamp'] },
        { fields: ['orderId', 'timestamp'] },
        { fields: ['status', 'timestamp'] },
        { fields: ['timestamp'] },
        { fields: ['expiresAt'] }
    ]
});

// Static methods for analytics
Activity.getUserActivity = async function(userId, limit = 50) {
    return await this.findAll({
        where: { userId },
        order: [['timestamp', 'DESC']],
        limit,
        include: [
            {
                model: sequelize.models.Product,
                as: 'product',
                attributes: ['id', 'name', 'brand', 'price']
            },
            {
                model: sequelize.models.Order,
                as: 'order',
                attributes: ['id', 'orderNumber', 'total', 'status']
            }
        ]
    });
};

Activity.getActivityStats = async function(startDate, endDate) {
    const { QueryTypes } = require('sequelize');
    
    const query = `
        SELECT 
            activity_type as activityType,
            COUNT(*) as count,
            COUNT(DISTINCT user_id) as uniqueUserCount,
            COUNT(DISTINCT session_id) as uniqueSessionCount
        FROM activities 
        WHERE timestamp BETWEEN :startDate AND :endDate
        GROUP BY activity_type
        ORDER BY count DESC
    `;
    
    return await sequelize.query(query, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
    });
};

Activity.getPopularProducts = async function(limit = 10) {
    const { QueryTypes } = require('sequelize');
    
    const query = `
        SELECT 
            product_id as productId,
            SUM(CASE WHEN activity_type = 'product_view' THEN 1 ELSE 0 END) as viewCount,
            SUM(CASE WHEN activity_type = 'product_add_to_cart' THEN 1 ELSE 0 END) as cartAddCount,
            SUM(CASE WHEN activity_type = 'product_add_to_wishlist' THEN 1 ELSE 0 END) as wishlistCount,
            COUNT(*) as totalInteractions
        FROM activities 
        WHERE product_id IS NOT NULL
        GROUP BY product_id
        ORDER BY totalInteractions DESC
        LIMIT :limit
    `;
    
    return await sequelize.query(query, {
        replacements: { limit },
        type: QueryTypes.SELECT
    });
};

Activity.getUserJourney = async function(sessionId) {
    return await this.findAll({
        where: { sessionId },
        order: [['timestamp', 'ASC']],
        include: [
            {
                model: sequelize.models.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }
        ]
    });
};

Activity.getErrorStats = async function(startDate, endDate) {
    const { QueryTypes } = require('sequelize');
    
    const query = `
        SELECT 
            JSON_EXTRACT(error, '$.message') as errorMessage,
            COUNT(*) as count,
            JSON_EXTRACT(error, '$.severity') as severity,
            MAX(timestamp) as lastOccurrence
        FROM activities 
        WHERE activity_type = 'error_occurred' 
        AND timestamp BETWEEN :startDate AND :endDate
        GROUP BY JSON_EXTRACT(error, '$.message')
        ORDER BY count DESC
    `;
    
    return await sequelize.query(query, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
    });
};

// Instance methods
Activity.prototype.toAnalyticsFormat = function() {
    return {
        id: this.id,
        user: this.userId,
        sessionId: this.sessionId,
        activityType: this.activityType,
        timestamp: this.timestamp,
        page: this.page,
        device: this.device,
        location: this.location,
        status: this.status,
        activityData: this.activityData,
        product: this.productId,
        order: this.orderId
    };
};

// Virtual for activity duration (if applicable)
Activity.prototype.getDuration = function() {
    if (this.activityData && this.activityData.startTime && this.activityData.endTime) {
        return this.activityData.endTime - this.activityData.startTime;
    }
    return null;
};

module.exports = Activity;
