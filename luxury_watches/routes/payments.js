const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post('/create-payment-intent', protect, [
    body('amount').isFloat({ min: 0.5 }).withMessage('Amount must be at least 0.50'),
    body('currency').optional().isIn(['usd', 'eur', 'gbp', 'chf']).withMessage('Invalid currency'),
    body('description').optional().isString().withMessage('Description must be a string')
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

        const { amount, currency = 'usd', description = 'Luxury Watches Purchase' } = req.body;

        // Convert amount to cents for Stripe
        const amountInCents = Math.round(amount * 100);

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: currency,
            description: description,
            metadata: {
                userId: req.user.id,
                userEmail: req.user.email
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            status: 'success',
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            }
        });
    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Payment intent creation failed',
            error: error.message
        });
    }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', protect, [
    body('paymentIntentId').isString().withMessage('Payment intent ID is required'),
    body('orderId').optional().isMongoId().withMessage('Invalid order ID')
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

        const { paymentIntentId, orderId } = req.body;

        // Retrieve payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (!paymentIntent) {
            return res.status(404).json({
                status: 'error',
                message: 'Payment intent not found'
            });
        }

        // Check if payment intent belongs to user
        if (paymentIntent.metadata.userId !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to access this payment'
            });
        }

        // Check payment status
        if (paymentIntent.status === 'succeeded') {
            res.status(200).json({
                status: 'success',
                message: 'Payment confirmed successfully',
                data: {
                    paymentIntentId: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency,
                    status: paymentIntent.status
                }
            });
        } else if (paymentIntent.status === 'requires_payment_method') {
            res.status(400).json({
                status: 'error',
                message: 'Payment method required',
                data: {
                    paymentIntentId: paymentIntent.id,
                    status: paymentIntent.status
                }
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Payment not completed',
                data: {
                    paymentIntentId: paymentIntent.id,
                    status: paymentIntent.status
                }
            });
        }
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Payment confirmation failed',
            error: error.message
        });
    }
});

// @desc    Get payment methods
// @route   GET /api/payments/payment-methods
// @access  Private
router.get('/payment-methods', protect, async (req, res) => {
    try {
        // Create or retrieve customer
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: req.user.email,
            limit: 1
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: req.user.email,
                name: `${req.user.firstName} ${req.user.lastName}`,
                metadata: {
                    userId: req.user.id
                }
            });
        }

        // Get payment methods
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customer.id,
            type: 'card'
        });

        res.status(200).json({
            status: 'success',
            data: {
                customerId: customer.id,
                paymentMethods: paymentMethods.data.map(pm => ({
                    id: pm.id,
                    brand: pm.card.brand,
                    last4: pm.card.last4,
                    expMonth: pm.card.exp_month,
                    expYear: pm.card.exp_year,
                    isDefault: pm.metadata.isDefault === 'true'
                }))
            }
        });
    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve payment methods',
            error: error.message
        });
    }
});

// @desc    Add payment method
// @route   POST /api/payments/payment-methods
// @access  Private
router.post('/payment-methods', protect, [
    body('paymentMethodId').isString().withMessage('Payment method ID is required'),
    body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
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

        const { paymentMethodId, isDefault = false } = req.body;

        // Get or create customer
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: req.user.email,
            limit: 1
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: req.user.email,
                name: `${req.user.firstName} ${req.user.lastName}`,
                metadata: {
                    userId: req.user.id
                }
            });
        }

        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customer.id,
        });

        // Set as default if requested
        if (isDefault) {
            await stripe.customers.update(customer.id, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });

            // Update metadata for other payment methods
            const paymentMethods = await stripe.paymentMethods.list({
                customer: customer.id,
                type: 'card'
            });

            for (const pm of paymentMethods.data) {
                if (pm.id !== paymentMethodId) {
                    await stripe.paymentMethods.update(pm.id, {
                        metadata: { isDefault: 'false' }
                    });
                }
            }

            await stripe.paymentMethods.update(paymentMethodId, {
                metadata: { isDefault: 'true' }
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Payment method added successfully'
        });
    } catch (error) {
        console.error('Add payment method error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add payment method',
            error: error.message
        });
    }
});

// @desc    Remove payment method
// @route   DELETE /api/payments/payment-methods/:paymentMethodId
// @access  Private
router.delete('/payment-methods/:paymentMethodId', protect, async (req, res) => {
    try {
        const { paymentMethodId } = req.params;

        // Get customer
        const existingCustomers = await stripe.customers.list({
            email: req.user.email,
            limit: 1
        });

        if (existingCustomers.data.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Customer not found'
            });
        }

        const customer = existingCustomers.data[0];

        // Check if payment method belongs to customer
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        if (paymentMethod.customer !== customer.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to remove this payment method'
            });
        }

        // Detach payment method
        await stripe.paymentMethods.detach(paymentMethodId);

        res.status(200).json({
            status: 'success',
            message: 'Payment method removed successfully'
        });
    } catch (error) {
        console.error('Remove payment method error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to remove payment method',
            error: error.message
        });
    }
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private
router.post('/refund', protect, [
    body('paymentIntentId').isString().withMessage('Payment intent ID is required'),
    body('amount').optional().isFloat({ min: 0.5 }).withMessage('Amount must be at least 0.50'),
    body('reason').optional().isIn(['duplicate', 'fraudulent', 'requested_by_customer']).withMessage('Invalid refund reason')
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

        const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;

        // Retrieve payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (!paymentIntent) {
            return res.status(404).json({
                status: 'error',
                message: 'Payment intent not found'
            });
        }

        // Check if payment intent belongs to user
        if (paymentIntent.metadata.userId !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to refund this payment'
            });
        }

        // Check if payment was successful
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                status: 'error',
                message: 'Payment was not successful'
            });
        }

        // Create refund
        const refundData = {
            payment_intent: paymentIntentId,
            reason: reason
        };

        if (amount) {
            refundData.amount = Math.round(amount * 100);
        }

        const refund = await stripe.refunds.create(refundData);

        res.status(200).json({
            status: 'success',
            message: 'Refund processed successfully',
            data: {
                refundId: refund.id,
                amount: refund.amount / 100,
                currency: refund.currency,
                status: refund.status
            }
        });
    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Refund processing failed',
            error: error.message
        });
    }
});

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            // Handle successful payment
            // Update order status, send confirmation email, etc.
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            // Handle failed payment
            // Send failure notification, update order status, etc.
            break;

        case 'charge.refunded':
            const refund = event.data.object;
            console.log('Refund processed:', refund.id);
            // Handle refund
            // Update order status, send refund confirmation, etc.
            break;

        case 'customer.subscription.created':
            const subscription = event.data.object;
            console.log('Subscription created:', subscription.id);
            // Handle subscription creation
            break;

        case 'customer.subscription.updated':
            const updatedSubscription = event.data.object;
            console.log('Subscription updated:', updatedSubscription.id);
            // Handle subscription update
            break;

        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            console.log('Subscription deleted:', deletedSubscription.id);
            // Handle subscription deletion
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get customer
        const existingCustomers = await stripe.customers.list({
            email: req.user.email,
            limit: 1
        });

        if (existingCustomers.data.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: {
                    payments: [],
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: 0,
                        totalItems: 0,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });
        }

        const customer = existingCustomers.data[0];

        // Get payment intents for customer
        const paymentIntents = await stripe.paymentIntents.list({
            customer: customer.id,
            limit: parseInt(limit),
            starting_after: skip > 0 ? skip.toString() : undefined
        });

        // Get charges for payment intents
        const payments = await Promise.all(
            paymentIntents.data.map(async (pi) => {
                const charges = await stripe.charges.list({
                    payment_intent: pi.id,
                    limit: 1
                });

                return {
                    id: pi.id,
                    amount: pi.amount / 100,
                    currency: pi.currency,
                    status: pi.status,
                    description: pi.description,
                    created: new Date(pi.created * 1000),
                    charge: charges.data[0] ? {
                        id: charges.data[0].id,
                        receiptUrl: charges.data[0].receipt_url
                    } : null
                };
            })
        );

        res.status(200).json({
            status: 'success',
            data: {
                payments,
                pagination: {
                    currentPage: parseInt(page),
                    totalItems: paymentIntents.data.length,
                    itemsPerPage: parseInt(limit),
                    hasMore: paymentIntents.has_more
                }
            }
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve payment history',
            error: error.message
        });
    }
});

module.exports = router; 