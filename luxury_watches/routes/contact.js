const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendEmail, emailTemplates } = require('../utils/email');
const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('subject').optional().trim().isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
    body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number')
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

        const { name, email, subject, message, phone } = req.body;

        // Prepare contact data
        const contactData = {
            name,
            email,
            subject: subject || 'General Inquiry',
            message,
            phone: phone || 'Not provided',
            timestamp: new Date().toISOString()
        };

        // Send notification email to admin
        try {
            const emailData = emailTemplates.contactForm(contactData);
            await sendEmail({
                email: process.env.EMAIL_USER,
                subject: emailData.subject,
                message: emailData.message
            });
        } catch (emailError) {
            console.error('Contact form email failed:', emailError);
        }

        // Send confirmation email to user
        try {
            await sendEmail({
                email: email,
                subject: 'Thank you for contacting Luxury Watches',
                message: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                            <h1 style="color: #333; margin: 0;">Luxury Watches</h1>
                        </div>
                        <div style="padding: 30px;">
                            <h2 style="color: #333;">Thank you for contacting us!</h2>
                            <p>Dear ${name},</p>
                            <p>We have received your message and will get back to you as soon as possible.</p>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                                <h3>Your Message Details</h3>
                                <p><strong>Subject:</strong> ${contactData.subject}</p>
                                <p><strong>Message:</strong></p>
                                <p style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                                    ${message}
                                </p>
                            </div>
                            
                            <p>We typically respond within 24 hours during business days.</p>
                            <p>If you have any urgent questions, please call us at +1 (555) 123-4567.</p>
                            <p>Best regards,<br>Luxury Watches Team</p>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                            <p>© 2024 Luxury Watches. All rights reserved.</p>
                        </div>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('User confirmation email failed:', emailError);
        }

        res.status(200).json({
            status: 'success',
            message: 'Thank you for your message. We will get back to you soon!'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Submit support ticket
// @route   POST /api/contact/support
// @access  Public
router.post('/support', [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('orderNumber').optional().isString().withMessage('Order number must be a string'),
    body('issueType').isIn(['technical', 'billing', 'shipping', 'product', 'other']).withMessage('Invalid issue type'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
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

        const { name, email, orderNumber, issueType, priority, message } = req.body;

        // Prepare support ticket data
        const ticketData = {
            name,
            email,
            orderNumber: orderNumber || 'Not provided',
            issueType,
            priority: priority || 'medium',
            message,
            ticketNumber: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            timestamp: new Date().toISOString()
        };

        // Send notification email to admin
        try {
            await sendEmail({
                email: process.env.EMAIL_USER,
                subject: `Support Ticket: ${ticketData.ticketNumber} - ${issueType.toUpperCase()}`,
                message: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                            <h1 style="color: #333; margin: 0;">Luxury Watches Support</h1>
                        </div>
                        <div style="padding: 30px;">
                            <h2 style="color: #333;">New Support Ticket</h2>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                                <h3>Ticket Information</h3>
                                <p><strong>Ticket Number:</strong> ${ticketData.ticketNumber}</p>
                                <p><strong>Priority:</strong> ${ticketData.priority.toUpperCase()}</p>
                                <p><strong>Issue Type:</strong> ${ticketData.issueType.toUpperCase()}</p>
                                <p><strong>Customer:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Order Number:</strong> ${ticketData.orderNumber}</p>
                                <p><strong>Submitted:</strong> ${new Date(ticketData.timestamp).toLocaleString()}</p>
                            </div>

                            <h3>Customer Message</h3>
                            <p style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                                ${message}
                            </p>
                            
                            <p>Please respond to this ticket as soon as possible.</p>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                            <p>© 2024 Luxury Watches. All rights reserved.</p>
                        </div>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Support ticket email failed:', emailError);
        }

        // Send confirmation email to user
        try {
            await sendEmail({
                email: email,
                subject: `Support Ticket Confirmation - ${ticketData.ticketNumber}`,
                message: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                            <h1 style="color: #333; margin: 0;">Luxury Watches Support</h1>
                        </div>
                        <div style="padding: 30px;">
                            <h2 style="color: #333;">Support Ticket Received</h2>
                            <p>Dear ${name},</p>
                            <p>We have received your support ticket and will address it as soon as possible.</p>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                                <h3>Ticket Details</h3>
                                <p><strong>Ticket Number:</strong> ${ticketData.ticketNumber}</p>
                                <p><strong>Issue Type:</strong> ${ticketData.issueType.toUpperCase()}</p>
                                <p><strong>Priority:</strong> ${ticketData.priority.toUpperCase()}</p>
                                <p><strong>Order Number:</strong> ${ticketData.orderNumber}</p>
                            </div>
                            
                            <p><strong>Response Time:</strong></p>
                            <ul>
                                <li>Urgent: Within 2 hours</li>
                                <li>High: Within 4 hours</li>
                                <li>Medium: Within 24 hours</li>
                                <li>Low: Within 48 hours</li>
                            </ul>
                            
                            <p>Please keep this ticket number for reference: <strong>${ticketData.ticketNumber}</strong></p>
                            <p>Best regards,<br>Luxury Watches Support Team</p>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                            <p>© 2024 Luxury Watches. All rights reserved.</p>
                        </div>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Support confirmation email failed:', emailError);
        }

        res.status(200).json({
            status: 'success',
            message: 'Support ticket submitted successfully',
            data: {
                ticketNumber: ticketData.ticketNumber,
                estimatedResponseTime: getEstimatedResponseTime(ticketData.priority)
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Submit feedback
// @route   POST /api/contact/feedback
// @access  Public
router.post('/feedback', [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('category').isIn(['website', 'product', 'service', 'shipping', 'overall']).withMessage('Invalid feedback category'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
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

        const { name, email, rating, category, message } = req.body;

        // Prepare feedback data
        const feedbackData = {
            name,
            email,
            rating,
            category,
            message,
            timestamp: new Date().toISOString()
        };

        // Send notification email to admin
        try {
            const stars = '⭐'.repeat(rating);
            await sendEmail({
                email: process.env.EMAIL_USER,
                subject: `Customer Feedback - ${category.toUpperCase()} - ${stars}`,
                message: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                            <h1 style="color: #333; margin: 0;">Luxury Watches Feedback</h1>
                        </div>
                        <div style="padding: 30px;">
                            <h2 style="color: #333;">Customer Feedback Received</h2>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                                <h3>Feedback Details</h3>
                                <p><strong>Customer:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Category:</strong> ${category.toUpperCase()}</p>
                                <p><strong>Rating:</strong> ${stars} (${rating}/5)</p>
                                <p><strong>Submitted:</strong> ${new Date(feedbackData.timestamp).toLocaleString()}</p>
                            </div>

                            <h3>Customer Message</h3>
                            <p style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                                ${message}
                            </p>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                            <p>© 2024 Luxury Watches. All rights reserved.</p>
                        </div>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Feedback email failed:', emailError);
        }

        // Send thank you email to user
        try {
            const stars = '⭐'.repeat(rating);
            await sendEmail({
                email: email,
                subject: 'Thank you for your feedback - Luxury Watches',
                message: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                            <h1 style="color: #333; margin: 0;">Luxury Watches</h1>
                        </div>
                        <div style="padding: 30px;">
                            <h2 style="color: #333;">Thank you for your feedback!</h2>
                            <p>Dear ${name},</p>
                            <p>We appreciate you taking the time to share your thoughts with us.</p>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                                <h3>Your Feedback Summary</h3>
                                <p><strong>Category:</strong> ${category.toUpperCase()}</p>
                                <p><strong>Rating:</strong> ${stars} (${rating}/5)</p>
                            </div>
                            
                            <p>Your feedback helps us improve our products and services. We value your input and will use it to enhance the customer experience.</p>
                            <p>Best regards,<br>Luxury Watches Team</p>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                            <p>© 2024 Luxury Watches. All rights reserved.</p>
                        </div>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Feedback thank you email failed:', emailError);
        }

        res.status(200).json({
            status: 'success',
            message: 'Thank you for your feedback!'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// Helper function to get estimated response time
function getEstimatedResponseTime(priority) {
    const responseTimes = {
        urgent: 'Within 2 hours',
        high: 'Within 4 hours',
        medium: 'Within 24 hours',
        low: 'Within 48 hours'
    };
    return responseTimes[priority] || 'Within 24 hours';
}

module.exports = router; 