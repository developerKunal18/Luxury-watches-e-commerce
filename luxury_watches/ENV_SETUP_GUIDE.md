# Environment Variables Setup Guide

## 🚀 **Quick Setup Options**

### **Option 1: Automated Setup (Recommended)**
Run the interactive setup script:
```bash
node setup-env.js
```

### **Option 2: Manual Setup**
Create a `.env` file in your project root with the following content:

## 📝 **Manual .env File Creation**

Create a file named `.env` in your project root directory (`C:\Users\Kunal\Desktop\luxury_watches\.env`) with this content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=luxury_watches
DB_USER=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure-for-production
JWT_EXPIRE=7d

# Stripe Configuration (for payments - optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (Gmail - optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration (for image uploads - optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Activity Tracking Configuration
ACTIVITY_RETENTION_DAYS=730
ACTIVITY_CLEANUP_INTERVAL=24
ENABLE_ACTIVITY_TRACKING=true
```

## 🔧 **Configuration Details**

### **Required Settings (Must Configure)**

#### **Database Configuration**
```env
DB_HOST=localhost          # Your MySQL server host
DB_PORT=3306              # MySQL port (usually 3306)
DB_NAME=luxury_watches    # Your database name
DB_USER=root              # MySQL username
DB_PASSWORD=              # MySQL password (leave empty if no password)
```

#### **JWT Security**
```env
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure-for-production
```
**⚠️ Important**: Change this to a unique, long, random string for security!

### **Optional Settings (Can Configure Later)**

#### **Email Configuration (for user verification)**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```
- Use Gmail with App Password (not your regular password)
- Enable 2-factor authentication first
- Generate App Password in Gmail settings

#### **Stripe Configuration (for payments)**
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```
- Get these from your Stripe dashboard
- Use test keys for development

#### **Cloudinary Configuration (for image uploads)**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- Sign up at cloudinary.com
- Get these from your Cloudinary dashboard

## 🎯 **Minimum Required Configuration**

For basic functionality, you only need to configure:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=luxury_watches
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure-for-production
```

## 🔐 **Security Best Practices**

### **JWT Secret Generation**
Generate a secure JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use an online generator
# https://generate-secret.vercel.app/64
```

### **Password Security**
- Use strong, unique passwords
- Never use default passwords in production
- Consider using environment-specific passwords

### **File Security**
- Never commit `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use different configurations for development/production

## 🚀 **Quick Start Steps**

1. **Create .env file** (using one of the methods above)

2. **Set up MySQL database**:
   ```bash
   mysql -u root -p
   CREATE DATABASE luxury_watches;
   EXIT;
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create database tables**:
   ```bash
   node scripts/createTables.js
   ```

5. **Start your application**:
   ```bash
   npm run dev
   ```

## 🔍 **Verification**

After creating your `.env` file, verify it's working:

```bash
# Check if .env file exists
ls -la .env

# Test database connection
node -e "
require('dotenv').config();
const { testConnection } = require('./config/database');
testConnection().then(() => console.log('✅ Database connection successful')).catch(console.error);
"
```

## 🆘 **Troubleshooting**

### **Common Issues**

1. **"Cannot find module 'dotenv'"**
   ```bash
   npm install dotenv
   ```

2. **Database connection failed**
   - Check if MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

3. **JWT errors**
   - Make sure JWT_SECRET is set
   - Use a long, random string

4. **File not found**
   - Ensure `.env` file is in project root
   - Check file name (should be exactly `.env`)

### **Environment Variables Not Loading**
```javascript
// Add this at the top of your main file
require('dotenv').config();
console.log('Environment loaded:', process.env.NODE_ENV);
```

## 📋 **Production Checklist**

Before deploying to production:

- [ ] Change JWT_SECRET to a secure random string
- [ ] Use production database credentials
- [ ] Set NODE_ENV=production
- [ ] Configure proper email settings
- [ ] Set up SSL certificates
- [ ] Use environment-specific URLs
- [ ] Enable proper logging
- [ ] Set up monitoring

Your `.env` file is now ready! 🎉
