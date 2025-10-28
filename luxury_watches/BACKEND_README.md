# Luxury Watches E-commerce Backend API

A complete Node.js/Express backend for the Luxury Watches e-commerce website with full CRUD operations, authentication, payment processing, and more.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Email verification
  - Password reset functionality
  - Rate limiting for security

- **Product Management**
  - Full CRUD operations for products
  - Advanced filtering and search
  - Image upload with Cloudinary
  - Product reviews and ratings
  - Stock management
  - Category and brand filtering

- **Shopping Cart System**
  - Add/remove items
  - Update quantities
  - Cart validation
  - Move items to wishlist
  - Cart persistence

- **Order Management**
  - Complete order lifecycle
  - Order status tracking
  - Shipping information
  - Order history
  - Invoice generation

- **Payment Processing**
  - Stripe integration
  - Multiple payment methods
  - Secure payment handling
  - Webhook support

- **Email Notifications**
  - Order confirmations
  - Shipping updates
  - Password reset emails
  - Welcome emails
  - Contact form notifications

- **Security Features**
  - Input validation
  - SQL injection prevention
  - XSS protection
  - CORS configuration
  - Rate limiting
  - Helmet security headers

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Stripe account (for payments)
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxury_watches
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/luxury_watches
   MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/luxury_watches

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+1234567890"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /auth/reset-password/:token
Content-Type: application/json

{
  "password": "NewPassword123"
}
```

### Product Endpoints

#### Get All Products
```http
GET /products?page=1&limit=12&sort=-createdAt&brand=Rolex&category=Diving&minPrice=1000&maxPrice=10000&search=submariner&inStock=true&featured=true&onSale=false
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Submariner Date",
  "brand": "Rolex",
  "model": "126610LN",
  "reference": "126610LN-0001",
  "description": "Iconic diving watch with date function",
  "price": 8500,
  "category": "Diving",
  "movement": {
    "type": "Automatic",
    "caliber": "3235",
    "powerReserve": "70 hours"
  },
  "case": {
    "material": "Stainless Steel",
    "diameter": 41,
    "thickness": 12.5,
    "waterResistance": "300m"
  },
  "stock": {
    "quantity": 5
  }
}
```

#### Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 9000,
  "stock": {
    "quantity": 3
  }
}
```

#### Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <admin_token>
```

#### Add Product Review
```http
POST /products/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent watch, highly recommended!"
}
```

### Cart Endpoints

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Add Item to Cart
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "quantity": 1
}
```

#### Update Cart Item
```http
PUT /cart/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Remove Item from Cart
```http
DELETE /cart/:productId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /cart
Authorization: Bearer <token>
```

#### Validate Cart
```http
POST /cart/validate
Authorization: Bearer <token>
```

### Order Endpoints

#### Get User Orders
```http
GET /orders
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States",
    "phone": "+1234567890"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "paymentInfo": {
    "method": "stripe",
    "paymentIntentId": "pi_1234567890"
  },
  "shipping": {
    "method": "express"
  }
}
```

#### Update Order Status (Admin Only)
```http
PUT /orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890"
}
```

### Payment Endpoints

#### Create Payment Intent
```http
POST /payments/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 8500,
  "currency": "usd"
}
```

#### Confirm Payment
```http
POST /payments/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_1234567890",
  "orderId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

### Contact Endpoints

#### Submit Contact Form
```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about your products."
}
```

### User Endpoints

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

#### Get User Wishlist
```http
GET /users/wishlist
Authorization: Bearer <token>
```

#### Add to Wishlist
```http
POST /users/wishlist/:productId
Authorization: Bearer <token>
```

#### Remove from Wishlist
```http
DELETE /users/wishlist/:productId
Authorization: Bearer <token>
```

## 🔧 Database Models

### User Model
- Authentication fields (email, password)
- Personal information (firstName, lastName, phone)
- Addresses array
- Wishlist array
- Cart array
- Role-based access control

### Product Model
- Basic information (name, brand, model, reference)
- Detailed specifications (movement, case, dial, bracelet)
- Pricing and stock information
- Images array with Cloudinary integration
- Reviews and ratings
- SEO fields

### Order Model
- Order items with product references
- Shipping and billing addresses
- Payment information
- Order status tracking
- Shipping details
- Warranty and insurance information

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Express-validator for all inputs
- **Rate Limiting**: Configurable rate limits for API endpoints
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input sanitization

## 📧 Email System

The backend includes a comprehensive email system with:

- **Welcome Emails**: Sent to new users
- **Order Confirmations**: Sent when orders are placed
- **Shipping Updates**: Sent when orders ship
- **Password Reset**: Secure password reset emails
- **Contact Form Notifications**: Admin notifications

## 🖼️ Image Management

- **Cloudinary Integration**: Cloud-based image storage
- **Image Optimization**: Sharp library for optimization
- **Multiple Formats**: Support for JPG, PNG, WebP
- **Responsive Images**: Auto-generated thumbnails
- **Watermarking**: Optional watermark addition

## 💳 Payment Processing

- **Stripe Integration**: Secure payment processing
- **Multiple Payment Methods**: Credit cards, digital wallets
- **Webhook Support**: Real-time payment updates
- **Payment Intent**: Secure payment flow
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Environment Variables
Ensure all environment variables are properly configured for production.

### Database
- Use MongoDB Atlas for production
- Configure proper indexes for performance
- Set up database backups

### Security
- Use strong JWT secrets
- Configure proper CORS origins
- Set up SSL/TLS certificates
- Use environment-specific configurations

### Performance
- Enable compression
- Configure proper caching headers
- Use CDN for static assets
- Monitor API performance

## 📊 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Error Handling**: Comprehensive error catching
- **Health Checks**: API health monitoring
- **Performance Monitoring**: Response time tracking

## 🔄 API Versioning

The API supports versioning through URL prefixes:
```
/api/v1/auth/register
/api/v2/auth/register
```

## 📝 Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📈 Performance Optimization

- Database indexing for frequently queried fields
- Pagination for large datasets
- Image optimization and compression
- Caching strategies
- Rate limiting to prevent abuse

## 🔧 Customization

The backend is highly customizable:

- **Email Templates**: Modify email templates in `utils/email.js`
- **Payment Methods**: Add new payment providers
- **Image Processing**: Customize image transformations
- **Validation Rules**: Modify input validation
- **Security Policies**: Adjust security settings

## 📞 Support

For support and questions:
- Check the API documentation
- Review error logs
- Test endpoints with Postman or similar tools
- Monitor server logs for debugging

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This backend is designed to work seamlessly with the frontend. Make sure to configure the frontend to use the correct API endpoints and handle authentication properly. 