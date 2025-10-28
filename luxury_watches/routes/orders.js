const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');
const router = express.Router();

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')
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

        const { page = 1, limit = 10, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build filter
        const filter = { user: req.user.id };
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate('items.product', 'name brand reference images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(filter);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.status(200).json({
            status: 'success',
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name brand reference images description')
            .populate('user', 'firstName lastName email phone');

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { order }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
    body('shippingAddress.firstName').trim().notEmpty().withMessage('Shipping first name is required'),
    body('shippingAddress.lastName').trim().notEmpty().withMessage('Shipping last name is required'),
    body('shippingAddress.street').trim().notEmpty().withMessage('Shipping street is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('Shipping city is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('Shipping state is required'),
    body('shippingAddress.zipCode').trim().notEmpty().withMessage('Shipping zip code is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Shipping phone is required'),
    body('paymentInfo.method').isIn(['stripe', 'paypal', 'bank_transfer', 'cash_on_delivery']).withMessage('Invalid payment method'),
    body('paymentInfo.paymentIntentId').optional().isString().withMessage('Payment intent ID must be a string'),
    body('shipping.method').optional().isIn(['standard', 'express', 'overnight', 'international']).withMessage('Invalid shipping method')
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

        const user = await User.findById(req.user.id).populate('cart.product');
        
        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cart is empty'
            });
        }

        // Validate cart items
        const cartItems = [];
        let subtotal = 0;

        for (const item of user.cart) {
            const product = item.product;
            
            if (!product || !product.isActive) {
                return res.status(400).json({
                    status: 'error',
                    message: `Product ${product ? product.name : 'Unknown'} is no longer available`
                });
            }

            if (product.stock.quantity < item.quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: `Only ${product.stock.quantity} items available for ${product.name}`
                });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            cartItems.push({
                product: product._id,
                name: product.name,
                brand: product.brand,
                reference: product.reference,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0] ? product.images[0].url : null,
                totalPrice: itemTotal
            });
        }

        // Calculate totals
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
        const total = subtotal + tax + shipping;

        // Create order
        const orderData = {
            user: req.user.id,
            items: cartItems,
            shippingAddress: req.body.shippingAddress,
            billingAddress: req.body.billingAddress || req.body.shippingAddress,
            paymentInfo: {
                method: req.body.paymentInfo.method,
                paymentIntentId: req.body.paymentInfo.paymentIntentId,
                status: req.body.paymentInfo.paymentIntentId ? 'paid' : 'pending'
            },
            pricing: {
                subtotal,
                tax,
                shipping,
                total,
                currency: 'USD'
            },
            shipping: {
                method: req.body.shipping?.method || 'standard'
            },
            notes: req.body.notes || {}
        };

        const order = await Order.create(orderData);

        // Update product stock
        for (const item of user.cart) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { 'stock.quantity': -item.quantity }
            });
        }

        // Clear user's cart
        user.cart = [];
        await user.save();

        // Populate order for response
        await order.populate('items.product');

        // Send order confirmation email
        try {
            const emailData = emailTemplates.orderConfirmation(order, user);
            await sendEmail({
                email: user.email,
                subject: emailData.subject,
                message: emailData.message
            });
        } catch (emailError) {
            console.error('Order confirmation email failed:', emailError);
        }

        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: { order }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), [
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
    body('trackingNumber').optional().isString().withMessage('Tracking number must be a string'),
    body('note').optional().isString().withMessage('Note must be a string')
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

        const { status, trackingNumber, note } = req.body;

        const order = await Order.findById(req.params.id)
            .populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        // Update order status
        await order.updateStatus(status, note, req.user.id);

        // Add shipping information if provided
        if (trackingNumber) {
            await order.addShippingInfo({
                trackingNumber,
                carrier: req.body.carrier || 'Standard Shipping'
            });
        }

        // Send email notifications based on status
        try {
            if (status === 'shipped' && trackingNumber) {
                const emailData = emailTemplates.orderShipped(order, order.user, trackingNumber);
                await sendEmail({
                    email: order.user.email,
                    subject: emailData.subject,
                    message: emailData.message
                });
            }
        } catch (emailError) {
            console.error('Status update email failed:', emailError);
        }

        res.status(200).json({
            status: 'success',
            message: 'Order status updated successfully',
            data: { order }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
    body('reason').optional().isString().withMessage('Reason must be a string')
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

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Cancel order
        await order.cancelOrder(req.body.reason || 'Cancelled by customer');

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { 'stock.quantity': item.quantity }
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Order cancelled successfully',
            data: { order }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
    try {
        const stats = await Order.getStats();

        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
    query('sort').optional().isIn(['createdAt', '-createdAt', 'total', '-total']).withMessage('Invalid sort parameter')
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

        const { page = 1, limit = 20, status, sort = '-createdAt' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build filter
        const filter = {};
        if (status) filter.status = status;

        // Build sort object
        let sortObj = {};
        if (sort.startsWith('-')) {
            sortObj[sort.slice(1)] = -1;
        } else {
            sortObj[sort] = 1;
        }

        const orders = await Order.find(filter)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name brand reference')
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(filter);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.status(200).json({
            status: 'success',
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
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

module.exports = router; 