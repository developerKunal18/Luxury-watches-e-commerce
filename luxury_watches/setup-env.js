const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 Setting up your .env file for Luxury Watches...\n');

// Default values
const defaultConfig = {
    PORT: '5000',
    NODE_ENV: 'development',
    DB_HOST: 'localhost',
    DB_PORT: '3306',
    DB_NAME: 'luxury_watches',
    DB_USER: 'root',
    DB_PASSWORD: '',
    JWT_SECRET: 'your-super-secret-jwt-key-here-make-it-very-long-and-secure-for-production',
    JWT_EXPIRE: '7d',
    STRIPE_SECRET_KEY: 'sk_test_your_stripe_secret_key_here',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_publishable_key_here',
    STRIPE_WEBHOOK_SECRET: 'whsec_your_webhook_secret_here',
    EMAIL_HOST: 'smtp.gmail.com',
    EMAIL_PORT: '587',
    EMAIL_USER: 'your-email@gmail.com',
    EMAIL_PASS: 'your-app-password',
    CLOUDINARY_CLOUD_NAME: 'your_cloud_name',
    CLOUDINARY_API_KEY: 'your_api_key',
    CLOUDINARY_API_SECRET: 'your_api_secret',
    MAX_FILE_SIZE: '5242880',
    UPLOAD_PATH: './uploads',
    BCRYPT_ROUNDS: '12',
    RATE_LIMIT_WINDOW: '15',
    RATE_LIMIT_MAX: '100',
    FRONTEND_URL: 'http://localhost:3000',
    ACTIVITY_RETENTION_DAYS: '730',
    ACTIVITY_CLEANUP_INTERVAL: '24',
    ENABLE_ACTIVITY_TRACKING: 'true'
};

const config = { ...defaultConfig };

function askQuestion(question, defaultValue) {
    return new Promise((resolve) => {
        const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
        rl.question(prompt, (answer) => {
            resolve(answer.trim() || defaultValue);
        });
    });
}

async function setupEnvironment() {
    try {
        console.log('📝 Please provide the following configuration details:\n');
        console.log('💡 Press Enter to use default values (shown in brackets)\n');

        // Database Configuration
        console.log('🗄️  DATABASE CONFIGURATION:');
        config.DB_HOST = await askQuestion('MySQL Host', config.DB_HOST);
        config.DB_PORT = await askQuestion('MySQL Port', config.DB_PORT);
        config.DB_NAME = await askQuestion('Database Name', config.DB_NAME);
        config.DB_USER = await askQuestion('MySQL Username', config.DB_USER);
        config.DB_PASSWORD = await askQuestion('MySQL Password (leave empty if no password)', config.DB_PASSWORD);

        // JWT Configuration
        console.log('\n🔐 JWT CONFIGURATION:');
        config.JWT_SECRET = await askQuestion('JWT Secret Key (keep this secure!)', config.JWT_SECRET);

        // Server Configuration
        console.log('\n🖥️  SERVER CONFIGURATION:');
        config.PORT = await askQuestion('Server Port', config.PORT);
        config.FRONTEND_URL = await askQuestion('Frontend URL (for CORS)', config.FRONTEND_URL);

        // Optional configurations
        console.log('\n📧 EMAIL CONFIGURATION (Optional - for user verification):');
        const setupEmail = await askQuestion('Do you want to configure email? (y/n)', 'n');
        if (setupEmail.toLowerCase() === 'y') {
            config.EMAIL_USER = await askQuestion('Gmail Address', config.EMAIL_USER);
            config.EMAIL_PASS = await askQuestion('Gmail App Password', config.EMAIL_PASS);
        }

        console.log('\n💳 STRIPE CONFIGURATION (Optional - for payments):');
        const setupStripe = await askQuestion('Do you want to configure Stripe? (y/n)', 'n');
        if (setupStripe.toLowerCase() === 'y') {
            config.STRIPE_SECRET_KEY = await askQuestion('Stripe Secret Key', config.STRIPE_SECRET_KEY);
            config.STRIPE_PUBLISHABLE_KEY = await askQuestion('Stripe Publishable Key', config.STRIPE_PUBLISHABLE_KEY);
        }

        console.log('\n☁️  CLOUDINARY CONFIGURATION (Optional - for image uploads):');
        const setupCloudinary = await askQuestion('Do you want to configure Cloudinary? (y/n)', 'n');
        if (setupCloudinary.toLowerCase() === 'y') {
            config.CLOUDINARY_CLOUD_NAME = await askQuestion('Cloudinary Cloud Name', config.CLOUDINARY_CLOUD_NAME);
            config.CLOUDINARY_API_KEY = await askQuestion('Cloudinary API Key', config.CLOUDINARY_API_KEY);
            config.CLOUDINARY_API_SECRET = await askQuestion('Cloudinary API Secret', config.CLOUDINARY_API_SECRET);
        }

        // Generate .env content
        const envContent = `# Server Configuration
PORT=${config.PORT}
NODE_ENV=${config.NODE_ENV}

# Database Configuration (MySQL)
DB_HOST=${config.DB_HOST}
DB_PORT=${config.DB_PORT}
DB_NAME=${config.DB_NAME}
DB_USER=${config.DB_USER}
DB_PASSWORD=${config.DB_PASSWORD}

# JWT Configuration
JWT_SECRET=${config.JWT_SECRET}
JWT_EXPIRE=${config.JWT_EXPIRE}

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=${config.STRIPE_SECRET_KEY}
STRIPE_PUBLISHABLE_KEY=${config.STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=${config.STRIPE_WEBHOOK_SECRET}

# Email Configuration (Gmail)
EMAIL_HOST=${config.EMAIL_HOST}
EMAIL_PORT=${config.EMAIL_PORT}
EMAIL_USER=${config.EMAIL_USER}
EMAIL_PASS=${config.EMAIL_PASS}

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=${config.CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${config.CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${config.CLOUDINARY_API_SECRET}

# File Upload Configuration
MAX_FILE_SIZE=${config.MAX_FILE_SIZE}
UPLOAD_PATH=${config.UPLOAD_PATH}

# Security
BCRYPT_ROUNDS=${config.BCRYPT_ROUNDS}
RATE_LIMIT_WINDOW=${config.RATE_LIMIT_WINDOW}
RATE_LIMIT_MAX=${config.RATE_LIMIT_MAX}

# Frontend URL (for CORS)
FRONTEND_URL=${config.FRONTEND_URL}

# Activity Tracking Configuration
ACTIVITY_RETENTION_DAYS=${config.ACTIVITY_RETENTION_DAYS}
ACTIVITY_CLEANUP_INTERVAL=${config.ACTIVITY_CLEANUP_INTERVAL}
ENABLE_ACTIVITY_TRACKING=${config.ENABLE_ACTIVITY_TRACKING}
`;

        // Write .env file
        fs.writeFileSync('.env', envContent);
        
        console.log('\n✅ .env file created successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Make sure MySQL is running');
        console.log('2. Create your database: mysql -u root -p');
        console.log('3. Run: CREATE DATABASE luxury_watches;');
        console.log('4. Run: node scripts/createTables.js');
        console.log('5. Start your app: npm run dev');
        
        console.log('\n🔐 Security Note:');
        console.log('- Never commit your .env file to version control');
        console.log('- Keep your JWT_SECRET secure and unique');
        console.log('- Use strong passwords for production');

    } catch (error) {
        console.error('❌ Error creating .env file:', error.message);
    } finally {
        rl.close();
    }
}

// Run the setup
setupEnvironment();
