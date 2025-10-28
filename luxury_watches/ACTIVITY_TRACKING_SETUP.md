# Activity Tracking System Setup Guide

## Overview
Your luxury watches website now has a comprehensive activity tracking system that monitors all user interactions, system events, and business metrics. This system provides detailed analytics and insights into user behavior, site performance, and business operations.

## 🎯 **Features Implemented**

### ✅ **Database Tracking**
- **Activity Model**: Comprehensive MongoDB schema for tracking all activities
- **User Activities**: Login, registration, profile updates, password resets
- **Product Interactions**: Views, cart additions, wishlist operations
- **E-commerce Activities**: Cart operations, checkout process, orders
- **Navigation Tracking**: Page views, clicks, menu interactions
- **Error Monitoring**: JavaScript errors, API errors, validation errors
- **Performance Metrics**: Page load times, API response times
- **Device Information**: Browser, OS, screen resolution, device type

### ✅ **Backend Tracking**
- **Middleware Integration**: Automatic activity tracking for all API endpoints
- **Session Management**: Unique session IDs for user journey tracking
- **IP and Location Tracking**: Geographic and network information
- **Error Handling**: Comprehensive error logging and monitoring
- **Performance Monitoring**: Response time tracking for all requests

### ✅ **Frontend Tracking**
- **Real-time Tracking**: Automatic tracking of user interactions
- **Page Analytics**: Page views, time on page, navigation patterns
- **User Behavior**: Clicks, searches, form submissions
- **Error Monitoring**: JavaScript errors and promise rejections
- **Device Detection**: Automatic browser and device identification

### ✅ **Analytics Dashboard**
- **Admin Dashboard**: Beautiful, responsive analytics interface
- **Real-time Monitoring**: Live activity feed
- **Visual Charts**: Interactive charts for activity types and popular products
- **Statistics**: Key metrics and performance indicators
- **Data Export**: CSV and JSON export capabilities
- **Date Range Filtering**: Customizable time periods for analysis

## 📊 **What Gets Tracked**

### **User Activities**
- User registration and login/logout
- Profile views and updates
- Password reset requests
- Email verification

### **Product Interactions**
- Product page views
- Product searches and filters
- Add to cart/remove from cart
- Wishlist operations
- Product recommendations

### **E-commerce Activities**
- Cart views and modifications
- Checkout process initiation
- Order creation and updates
- Payment processing
- Order completion and cancellations

### **Navigation & Behavior**
- Page views and time on page
- Navigation clicks and menu interactions
- Footer and header interactions
- Search queries and results
- Form submissions

### **System & Performance**
- API response times
- Page load performance
- Error occurrences and severity
- Device and browser information
- Geographic location data

## 🚀 **Setup Instructions**

### 1. **Database Setup**
The Activity model is already created and will be automatically used when you start your server. Make sure MongoDB is running.

### 2. **Environment Configuration**
Add these optional environment variables to your `.env` file:

```env
# Activity Tracking Configuration
ACTIVITY_RETENTION_DAYS=730  # Keep activities for 2 years (default)
ACTIVITY_CLEANUP_INTERVAL=24 # Run cleanup every 24 hours (in hours)
ENABLE_ACTIVITY_TRACKING=true # Enable/disable tracking
```

### 3. **Start the Application**
```bash
# Start your server
npm run dev
# or
npm start
```

### 4. **Access the Analytics Dashboard**
1. Open `admin-dashboard.html` in your browser
2. Login with an admin account (user with role: 'admin')
3. View real-time analytics and activity data

## 📈 **Using the Analytics Dashboard**

### **Dashboard Features**

#### **Statistics Overview**
- **Total Users**: Number of unique users
- **Page Views**: Total page views in selected period
- **Cart Additions**: Number of products added to cart
- **Checkouts**: Number of checkout processes started

#### **Visual Analytics**
- **Activity Types Chart**: Doughnut chart showing distribution of activity types
- **Popular Products Chart**: Bar chart showing most interacted products
- **Real-time Activity Feed**: Live stream of recent user activities

#### **Date Range Filtering**
- Select custom date ranges for analysis
- Default shows last 30 days
- Update data with the "Update" button

### **Admin Access**
To access the dashboard, you need a user account with `role: 'admin'`. You can create one by:

1. Registering a normal user account
2. Manually updating the user's role in the database:
```javascript
// In MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🔧 **API Endpoints**

### **Activity Tracking**
- `POST /api/activities/track` - Track frontend activities
- `GET /api/activities/user/:userId` - Get user activity history
- `GET /api/activities/stats` - Get activity statistics (Admin only)
- `GET /api/activities/realtime` - Get real-time activity feed (Admin only)
- `GET /api/activities/journey/:sessionId` - Get user journey (Admin only)
- `GET /api/activities/pages` - Get page analytics (Admin only)
- `GET /api/activities/devices` - Get device analytics (Admin only)
- `GET /api/activities/export` - Export activity data (Admin only)

### **Example API Usage**

#### **Track Custom Activity**
```javascript
// Frontend
trackActivity('custom_event', {
    customData: 'value',
    timestamp: new Date()
});

// Backend
const { trackActivity } = require('./middleware/activityTracker');
app.post('/api/custom-endpoint', trackActivity('custom_activity'), (req, res) => {
    // Your endpoint logic
});
```

#### **Get User Activity**
```javascript
// Get user's last 50 activities
const response = await fetch('/api/activities/user/USER_ID?limit=50', {
    headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
```

## 📊 **Analytics Data Structure**

### **Activity Record**
```javascript
{
    user: ObjectId,           // User ID (if logged in)
    sessionId: String,        // Unique session identifier
    ipAddress: String,        // Client IP address
    userAgent: String,        // Browser user agent
    activityType: String,     // Type of activity
    activityData: Object,     // Activity-specific data
    product: ObjectId,        // Product ID (if applicable)
    order: ObjectId,          // Order ID (if applicable)
    page: {                   // Page information
        url: String,
        title: String,
        referrer: String,
        path: String
    },
    device: {                 // Device information
        type: String,         // mobile, tablet, desktop
        browser: String,      // Chrome, Firefox, etc.
        os: String,           // Windows, macOS, etc.
        screenResolution: String,
        language: String,
        timezone: String
    },
    performance: {            // Performance metrics
        pageLoadTime: Number,
        apiResponseTime: Number
    },
    error: {                  // Error information (if applicable)
        message: String,
        stack: String,
        code: String,
        severity: String      // low, medium, high, critical
    },
    status: String,           // success, failed, pending, cancelled
    timestamp: Date,          // When the activity occurred
    expiresAt: Date           // Automatic cleanup date
}
```

## 🎯 **Business Insights**

### **User Behavior Analysis**
- **Popular Products**: Which watches get the most attention
- **User Journey**: How users navigate through your site
- **Conversion Funnel**: From product view to checkout
- **Geographic Distribution**: Where your users are located
- **Device Preferences**: Mobile vs desktop usage patterns

### **Performance Monitoring**
- **Page Load Times**: Identify slow-loading pages
- **API Response Times**: Monitor backend performance
- **Error Rates**: Track and resolve issues quickly
- **User Experience**: Time spent on pages and interactions

### **E-commerce Analytics**
- **Cart Abandonment**: Track where users leave the checkout process
- **Product Performance**: Which products drive the most engagement
- **Search Patterns**: What users are looking for
- **Seasonal Trends**: Activity patterns over time

## 🔒 **Privacy & Security**

### **Data Protection**
- **Anonymous Tracking**: Activities are tracked even for non-logged users
- **Session Management**: Unique session IDs for user journey tracking
- **Data Retention**: Automatic cleanup of old data (configurable)
- **IP Anonymization**: Consider implementing IP hashing for privacy

### **Access Control**
- **Admin Only**: Analytics dashboard requires admin privileges
- **API Security**: All analytics endpoints require authentication
- **Data Export**: Controlled access to data export features

## 🛠 **Customization**

### **Adding New Activity Types**
1. **Update Activity Model**: Add new activity types to the enum in `models/Activity.js`
2. **Add Tracking**: Use the tracking functions in your code
3. **Update Dashboard**: Add new activity types to the dashboard display

### **Custom Analytics**
```javascript
// Track custom business metrics
trackActivity('custom_business_event', {
    metric: 'value',
    category: 'business',
    timestamp: new Date()
});
```

### **Performance Optimization**
- **Batch Tracking**: Use `batchTrackActivities()` for bulk operations
- **Async Processing**: All tracking is non-blocking
- **Database Indexing**: Optimized indexes for fast queries
- **Data Cleanup**: Automatic cleanup of old data

## 📱 **Mobile & Responsive**
- **Mobile Tracking**: Full mobile device detection and tracking
- **Responsive Dashboard**: Analytics dashboard works on all devices
- **Touch Interactions**: Mobile-specific interaction tracking
- **Performance Monitoring**: Mobile-specific performance metrics

## 🚨 **Monitoring & Alerts**

### **Error Monitoring**
- **JavaScript Errors**: Automatic frontend error tracking
- **API Errors**: Backend error logging and monitoring
- **Performance Issues**: Slow page loads and API responses
- **User Experience**: Failed interactions and abandoned processes

### **Business Metrics**
- **Conversion Rates**: Track user journey completion
- **Popular Content**: Identify high-performing products
- **User Engagement**: Time spent and interaction patterns
- **Geographic Insights**: Location-based user behavior

## 🔄 **Maintenance**

### **Regular Tasks**
1. **Monitor Dashboard**: Check analytics regularly for insights
2. **Review Errors**: Address any recurring errors or issues
3. **Performance Check**: Monitor page load times and API performance
4. **Data Cleanup**: Ensure old data is being cleaned up properly

### **Database Maintenance**
```javascript
// Manual cleanup (if needed)
const { cleanupOldActivities } = require('./middleware/activityTracker');
const deletedCount = await cleanupOldActivities(365); // Keep 1 year
console.log(`Cleaned up ${deletedCount} old activities`);
```

## 📞 **Support & Troubleshooting**

### **Common Issues**

1. **Dashboard Not Loading**
   - Check if user has admin role
   - Verify authentication token
   - Check browser console for errors

2. **Activities Not Tracking**
   - Check if tracking is enabled
   - Verify API endpoints are accessible
   - Check browser console for tracking errors

3. **Performance Issues**
   - Monitor database query performance
   - Check for large activity collections
   - Ensure proper indexing

### **Debugging**
```javascript
// Check if tracking is working
console.log('Tracking status:', window.trackActivity ? 'Enabled' : 'Disabled');

// View recent activities in console
fetch('/api/activities/realtime?limit=5')
  .then(res => res.json())
  .then(data => console.log('Recent activities:', data));
```

## 🎉 **Next Steps**

### **Advanced Features**
1. **Real-time Notifications**: Set up alerts for important events
2. **A/B Testing**: Track different versions of pages
3. **Heatmaps**: Visual user interaction tracking
4. **Conversion Optimization**: Detailed funnel analysis
5. **Predictive Analytics**: Machine learning insights

### **Integration Options**
1. **Google Analytics**: Export data to Google Analytics
2. **Email Reports**: Automated analytics reports
3. **Slack Integration**: Real-time activity notifications
4. **Custom Dashboards**: Build specialized analytics views

Your activity tracking system is now fully operational and will provide valuable insights into user behavior, site performance, and business metrics. The system is designed to scale with your business and can be easily extended with additional tracking capabilities as needed.
