# MySQL Database Setup Guide

## Overview
Your luxury watches website has been successfully converted to use MySQL database instead of MongoDB. This guide will help you set up and configure MySQL for your application.

## 🗄️ **What's Been Updated**

### ✅ **Database Migration**
- **Sequelize ORM**: Replaced Mongoose with Sequelize for MySQL
- **User Model**: Converted to Sequelize with proper MySQL data types
- **Activity Model**: Full activity tracking system for MySQL
- **Database Configuration**: MySQL connection setup
- **Migration Scripts**: Automated table creation and setup

### ✅ **Models Converted**
- **User Model**: Authentication, profiles, and user management
- **Activity Model**: Comprehensive activity tracking with analytics
- **Database Relations**: Proper foreign key relationships
- **Indexes**: Optimized database indexes for performance

## 🚀 **Setup Instructions**

### 1. **Install MySQL**
Make sure MySQL is installed and running on your system:

**Windows:**
```bash
# Download MySQL from https://dev.mysql.com/downloads/mysql/
# Or use XAMPP/WAMP for easy setup
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. **Create Database**
Connect to MySQL and create your database:

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE luxury_watches;

-- Create a dedicated user (optional but recommended)
CREATE USER 'luxury_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON luxury_watches.* TO 'luxury_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. **Install Dependencies**
Install the new MySQL dependencies:

```bash
npm install sequelize mysql2
```

### 4. **Environment Configuration**
Create a `.env` file with your MySQL configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=luxury_watches
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 5. **Create Database Tables**
Run the database setup script:

```bash
# Create tables and indexes
node scripts/createTables.js
```

This script will:
- Create all necessary tables
- Set up proper indexes for performance
- Create a default admin user
- Verify database connection

### 6. **Start the Application**
```bash
npm run dev
# or
npm start
```

## 📊 **Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar JSON,
    addresses JSON DEFAULT ('[]'),
    wishlist JSON DEFAULT ('[]'),
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expire DATETIME,
    reset_password_token VARCHAR(255),
    reset_password_expire DATETIME,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Activities Table**
```sql
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    activity_type ENUM(
        'user_register', 'user_login', 'user_logout',
        'product_view', 'product_search', 'product_filter',
        'product_add_to_cart', 'product_remove_from_cart',
        'cart_view', 'cart_checkout_start',
        'page_view', 'navigation_click', 'menu_click',
        'contact_form_submit', 'error_occurred'
        -- ... and many more activity types
    ) NOT NULL,
    activity_data JSON DEFAULT ('{}'),
    product_id INT,
    order_id INT,
    page JSON DEFAULT ('{}'),
    device JSON DEFAULT ('{}'),
    location JSON DEFAULT ('{}'),
    performance JSON DEFAULT ('{}'),
    error JSON,
    status ENUM('success', 'failed', 'pending', 'cancelled') DEFAULT 'success',
    metadata JSON DEFAULT ('{}'),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_activity_type (activity_type, timestamp),
    INDEX idx_session (session_id, timestamp)
);
```

## 🔧 **Key Features**

### **Activity Tracking**
- **40+ Activity Types**: Comprehensive tracking of all user interactions
- **Real-time Analytics**: Live activity monitoring
- **Performance Metrics**: Page load times, API response times
- **Error Monitoring**: JavaScript errors, API errors
- **User Journeys**: Complete session tracking

### **Authentication System**
- **Secure Login/Logout**: JWT-based authentication
- **User Registration**: Email verification system
- **Password Reset**: Secure password recovery
- **Role Management**: User and admin roles
- **Session Management**: Secure session handling

### **Analytics Dashboard**
- **Real-time Monitoring**: Live activity feed
- **Visual Charts**: Interactive analytics charts
- **Data Export**: CSV and JSON export
- **Performance Insights**: Site performance metrics
- **User Behavior**: Detailed user interaction analysis

## 📈 **Analytics Capabilities**

### **User Analytics**
- User registration and login patterns
- User journey tracking
- Geographic distribution
- Device and browser analytics
- Session duration and behavior

### **Product Analytics**
- Product view counts
- Cart addition rates
- Popular products
- Search patterns
- Filter usage

### **Performance Analytics**
- Page load times
- API response times
- Error rates and types
- User experience metrics
- System performance

### **Business Analytics**
- Conversion funnels
- Revenue tracking
- Customer behavior
- Marketing effectiveness
- Operational insights

## 🛠 **Database Management**

### **Backup and Restore**
```bash
# Backup database
mysqldump -u root -p luxury_watches > backup.sql

# Restore database
mysql -u root -p luxury_watches < backup.sql
```

### **Performance Optimization**
```sql
-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'luxury_watches';

-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';
```

### **Data Cleanup**
```sql
-- Clean up old activities (older than 2 years)
DELETE FROM activities 
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- Optimize tables
OPTIMIZE TABLE users, activities;
```

## 🔒 **Security Features**

### **Data Protection**
- **Password Hashing**: bcrypt with configurable rounds
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Sequelize ORM protection
- **Rate Limiting**: API rate limiting

### **Access Control**
- **Role-based Access**: User and admin roles
- **API Authentication**: Protected endpoints
- **Session Management**: Secure session handling
- **Data Privacy**: Automatic data expiration

## 📱 **Admin Dashboard**

### **Access the Dashboard**
1. Open `admin-dashboard.html` in your browser
2. Login with admin credentials:
   - **Email**: admin@luxurywatches.com
   - **Password**: Admin123!

### **Dashboard Features**
- **Real-time Activity Feed**: Live user interactions
- **Statistics Overview**: Key metrics and KPIs
- **Visual Charts**: Activity types and popular products
- **Date Range Filtering**: Custom time periods
- **Data Export**: Download analytics data

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   ```bash
   # Check MySQL service
   sudo systemctl status mysql
   
   # Check connection
   mysql -u root -p -e "SELECT 1"
   ```

2. **Table Creation Failed**
   ```bash
   # Check database exists
   mysql -u root -p -e "SHOW DATABASES"
   
   # Check user permissions
   mysql -u root -p -e "SHOW GRANTS FOR 'your_user'@'localhost'"
   ```

3. **Authentication Issues**
   ```bash
   # Check JWT secret in .env
   # Verify user exists in database
   mysql -u root -p luxury_watches -e "SELECT * FROM users WHERE role='admin'"
   ```

### **Performance Issues**
```sql
-- Check slow queries
SHOW PROCESSLIST;

-- Check table indexes
SHOW INDEX FROM activities;

-- Analyze query performance
EXPLAIN SELECT * FROM activities WHERE user_id = 1 ORDER BY timestamp DESC LIMIT 10;
```

## 🔄 **Migration from MongoDB**

If you were previously using MongoDB, the following data migration might be needed:

### **User Data Migration**
```javascript
// Example migration script (if needed)
const migrateUsers = async () => {
    // Your MongoDB to MySQL migration logic
    // This would be custom based on your existing data
};
```

### **Activity Data Migration**
```javascript
// Example activity data migration
const migrateActivities = async () => {
    // Migrate existing activity data if any
    // This would be custom based on your existing data
};
```

## 📞 **Support**

### **Getting Help**
1. **Check Logs**: Review server and database logs
2. **Verify Configuration**: Ensure all environment variables are set
3. **Test Connection**: Verify MySQL connection
4. **Check Permissions**: Ensure database user has proper permissions

### **Useful Commands**
```bash
# Check MySQL status
sudo systemctl status mysql

# Connect to database
mysql -u root -p luxury_watches

# View tables
SHOW TABLES;

# Check table structure
DESCRIBE users;
DESCRIBE activities;

# View recent activities
SELECT * FROM activities ORDER BY timestamp DESC LIMIT 10;
```

## 🎉 **Next Steps**

### **Production Deployment**
1. **Set up Production MySQL**: Use managed MySQL service
2. **Configure SSL**: Enable SSL for database connections
3. **Set up Monitoring**: Database performance monitoring
4. **Backup Strategy**: Automated backup system
5. **Security Hardening**: Production security measures

### **Advanced Features**
1. **Real-time Analytics**: WebSocket-based real-time updates
2. **Advanced Reporting**: Custom analytics reports
3. **Data Visualization**: Enhanced dashboard features
4. **API Rate Limiting**: Advanced rate limiting strategies
5. **Caching**: Redis integration for performance

Your MySQL-based activity tracking system is now fully operational and ready to provide comprehensive insights into your luxury watches website's performance and user behavior!
