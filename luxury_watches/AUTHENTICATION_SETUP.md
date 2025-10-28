# Authentication System Setup Guide

## Overview
Your luxury watches website now has a fully functional authentication system with login, signup, logout, and access control features.

## Features Implemented

### ✅ Authentication Features
- **User Registration**: Complete signup form with validation
- **User Login**: Secure login with JWT tokens
- **Password Reset**: Forgot password functionality
- **User Profile**: View and manage user information
- **Logout**: Secure logout with token cleanup
- **Access Control**: Protected features require authentication

### ✅ Security Features
- Password strength validation
- JWT token-based authentication
- Secure token storage in localStorage
- Automatic token expiration handling
- Rate limiting on authentication endpoints
- Email verification system

### ✅ UI/UX Features
- Beautiful modal-based authentication forms
- Responsive design for mobile devices
- User-friendly notifications
- Smooth animations and transitions
- Access control overlays for protected content

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in your project root with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/luxury_watches
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/luxury_watches

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

### 2. Database Setup
Make sure MongoDB is running and accessible at the configured URI.

### 3. Start the Application
```bash
# Install dependencies (if not already done)
npm install

# Start the server
npm run dev
# or
npm start
```

### 4. Access the Website
Open your browser and navigate to `http://localhost:5000`

## How to Use the Authentication System

### For Users

#### Registration
1. Click the "Sign Up" button in the header
2. Fill in the registration form:
   - First Name (required)
   - Last Name (required)
   - Email (required, must be valid)
   - Phone (optional)
   - Password (must be at least 6 characters with uppercase, lowercase, and number)
   - Confirm Password (must match)
3. Click "Sign Up"
4. Check your email for verification link

#### Login
1. Click the "Login" button in the header
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the main page with access to all features

#### Password Reset
1. Click "Forgot Password?" on the login form
2. Enter your email address
3. Check your email for reset link
4. Follow the link to reset your password

#### Profile Management
1. Click on your name in the header (when logged in)
2. Select "Profile" from the dropdown
3. View your account information

#### Logout
1. Click on your name in the header
2. Select "Logout" from the dropdown

### For Developers

#### Protected Features
The following features now require authentication:
- Adding items to cart
- Checkout process
- Viewing user profile
- Accessing orders (coming soon)

#### API Endpoints
The authentication system uses these endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

#### Frontend Functions
Key JavaScript functions available:
- `showLoginForm()` - Open login modal
- `showSignupForm()` - Open signup modal
- `logout()` - Logout user
- `checkAuthStatus()` - Check if user is logged in
- `updateUIForLoggedInUser()` - Update UI for authenticated users
- `updateUIForLoggedOutUser()` - Update UI for non-authenticated users

## Security Considerations

### Password Requirements
- Minimum 6 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number

### Token Management
- JWT tokens are stored in localStorage
- Tokens expire after 7 days (configurable)
- Automatic logout on token expiration
- Secure token transmission via Authorization header

### Rate Limiting
- Login attempts: 5 per 15 minutes per IP
- General API requests: 100 per 15 minutes per IP

## Customization

### Styling
All authentication styles are in `styles.css` under the "Authentication Styles" section. You can customize:
- Colors and themes
- Modal appearance
- Button styles
- Form layouts

### Validation
Password validation can be modified in the `validatePassword()` function in `script.js`.

### API Configuration
The API base URL is configured in `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Troubleshooting

### Common Issues

1. **"Network error" messages**
   - Check if the backend server is running
   - Verify the API_BASE_URL in script.js
   - Check browser console for CORS errors

2. **"Session expired" messages**
   - This is normal behavior when tokens expire
   - User will be automatically logged out
   - They need to login again

3. **Email verification not working**
   - Check email configuration in .env
   - Verify SMTP settings
   - Check spam folder

4. **Database connection issues**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env
   - Verify database permissions

### Testing the System

1. **Test Registration**
   - Try registering with a new email
   - Test password validation
   - Check email verification

2. **Test Login**
   - Login with valid credentials
   - Try invalid credentials
   - Test logout functionality

3. **Test Access Control**
   - Try adding to cart without login
   - Try checkout without login
   - Verify protected features work after login

## Next Steps

### Potential Enhancements
1. **Social Login**: Add Google/Facebook login
2. **Two-Factor Authentication**: Add 2FA support
3. **User Roles**: Implement admin/user role system
4. **Order History**: Complete the orders feature
5. **Wishlist**: Add wishlist functionality
6. **Address Management**: Add shipping address management

### Production Deployment
1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Configure production email service
4. Set up SSL certificates
5. Configure production CORS settings

## Support

If you encounter any issues with the authentication system, check:
1. Browser console for JavaScript errors
2. Server logs for backend errors
3. Network tab for API request failures
4. Environment configuration

The authentication system is now fully functional and ready for use!
