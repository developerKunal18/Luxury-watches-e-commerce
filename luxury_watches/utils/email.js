const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send email function
const sendEmail = async ({ email, subject, message, attachments = [] }) => {
    try {
        // Check if email configuration is available
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email configuration not found. Skipping email send.');
            return { success: false, message: 'Email configuration not found' };
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: `"Luxury Watches" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: message,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Email templates
const emailTemplates = {
    // Welcome email
    welcome: (userName) => ({
        subject: 'Welcome to Luxury Watches!',
        message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #333; margin: 0;">Luxury Watches</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #333;">Welcome, ${userName}!</h2>
                    <p>Thank you for joining Luxury Watches. We're excited to have you as part of our community of watch enthusiasts.</p>
                    <p>Here's what you can do with your account:</p>
                    <ul>
                        <li>Browse our exclusive collection of luxury timepieces</li>
                        <li>Save your favorite watches to your wishlist</li>
                        <li>Track your orders and view order history</li>
                        <li>Receive updates on new arrivals and special offers</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/products" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Start Shopping
                        </a>
                    </div>
                    <p>If you have any questions, feel free to contact our customer support team.</p>
                    <p>Best regards,<br>Luxury Watches Team</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2024 Luxury Watches. All rights reserved.</p>
                </div>
            </div>
        `
    }),

    // Order confirmation
    orderConfirmation: (order, user) => ({
        subject: `Order Confirmation - ${order.orderNumber}`,
        message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #333; margin: 0;">Luxury Watches</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #333;">Order Confirmation</h2>
                    <p>Dear ${user.firstName} ${user.lastName},</p>
                    <p>Thank you for your order! We're excited to process your purchase.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3>Order Details</h3>
                        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> $${order.pricing.total.toFixed(2)}</p>
                    </div>

                    <h3>Items Ordered:</h3>
                    ${order.items.map(item => `
                        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                            <p><strong>${item.name}</strong> - ${item.brand}</p>
                            <p>Reference: ${item.reference}</p>
                            <p>Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}</p>
                        </div>
                    `).join('')}

                    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3>Shipping Address</h3>
                        <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                        <p>${order.shippingAddress.street}</p>
                        <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
                        <p>${order.shippingAddress.country}</p>
                    </div>

                    <p>We'll send you tracking information once your order ships.</p>
                    <p>If you have any questions, please contact our customer support.</p>
                    <p>Best regards,<br>Luxury Watches Team</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2024 Luxury Watches. All rights reserved.</p>
                </div>
            </div>
        `
    }),

    // Order shipped
    orderShipped: (order, user, trackingNumber) => ({
        subject: `Your Order Has Shipped - ${order.orderNumber}`,
        message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #333; margin: 0;">Luxury Watches</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #333;">Your Order Has Shipped!</h2>
                    <p>Dear ${user.firstName} ${user.lastName},</p>
                    <p>Great news! Your order has been shipped and is on its way to you.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3>Shipping Information</h3>
                        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                        <p><strong>Shipped Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>

                    <p>You can track your package using the tracking number above.</p>
                    <p>We hope you love your new timepiece!</p>
                    <p>Best regards,<br>Luxury Watches Team</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2024 Luxury Watches. All rights reserved.</p>
                </div>
            </div>
        `
    }),

    // Password reset
    passwordReset: (resetUrl, userName) => ({
        subject: 'Password Reset Request - Luxury Watches',
        message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #333; margin: 0;">Luxury Watches</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hi ${userName},</p>
                    <p>You requested a password reset for your Luxury Watches account.</p>
                    <p>Click the button below to reset your password:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
                    
                    <p><strong>Important:</strong> This link will expire in 10 minutes for security reasons.</p>
                    <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                    <p>Best regards,<br>Luxury Watches Team</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2024 Luxury Watches. All rights reserved.</p>
                </div>
            </div>
        `
    }),

    // Contact form notification
    contactForm: (contactData) => ({
        subject: 'New Contact Form Submission - Luxury Watches',
        message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h1 style="color: #333; margin: 0;">Luxury Watches</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #333;">New Contact Form Submission</h2>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3>Contact Information</h3>
                        <p><strong>Name:</strong> ${contactData.name}</p>
                        <p><strong>Email:</strong> ${contactData.email}</p>
                        <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
                        <p><strong>Subject:</strong> ${contactData.subject || 'General Inquiry'}</p>
                        <p><strong>Message:</strong></p>
                        <p style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                            ${contactData.message}
                        </p>
                    </div>
                    
                    <p>Please respond to this inquiry as soon as possible.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2024 Luxury Watches. All rights reserved.</p>
                </div>
            </div>
        `
    })
};

module.exports = {
    sendEmail,
    emailTemplates
}; 