const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        
        if (!user.cart) {
            user.cart = [];
            await user.save();
        }

        // Calculate totals
        const cartItems = user.cart.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalPrice: item.product ? item.product.price * item.quantity : 0
        }));

        const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
        const total = subtotal + tax + shipping;

        res.status(200).json({
            status: 'success',
            data: {
                items: cartItems,
                summary: {
                    subtotal,
                    tax,
                    shipping,
                    total,
                    itemCount: cartItems.length
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

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, [
    body('productId').isMongoId().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

        const { productId, quantity } = req.body;

        // Check if product exists and is active
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Check if product is in stock
        if (product.stock.quantity < quantity) {
            return res.status(400).json({
                status: 'error',
                message: `Only ${product.stock.quantity} items available in stock`
            });
        }

        const user = await User.findById(req.user.id);
        
        // Initialize cart if it doesn't exist
        if (!user.cart) {
            user.cart = [];
        }

        // Check if product already exists in cart
        const existingItemIndex = user.cart.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            const newQuantity = user.cart[existingItemIndex].quantity + quantity;
            
            // Check stock again
            if (product.stock.quantity < newQuantity) {
                return res.status(400).json({
                    status: 'error',
                    message: `Cannot add ${quantity} more items. Only ${product.stock.quantity - user.cart[existingItemIndex].quantity} additional items available`
                });
            }
            
            user.cart[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item
            user.cart.push({
                product: productId,
                quantity: quantity
            });
        }

        await user.save();

        // Populate product details for response
        await user.populate('cart.product');

        const cartItems = user.cart.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalPrice: item.product.price * item.quantity
        }));

        const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 1000 ? 0 : 50;
        const total = subtotal + tax + shipping;

        res.status(200).json({
            status: 'success',
            message: 'Item added to cart successfully',
            data: {
                items: cartItems,
                summary: {
                    subtotal,
                    tax,
                    shipping,
                    total,
                    itemCount: cartItems.length
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

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', protect, [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

        const { productId } = req.params;
        const { quantity } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Check stock
        if (product.stock.quantity < quantity) {
            return res.status(400).json({
                status: 'error',
                message: `Only ${product.stock.quantity} items available in stock`
            });
        }

        const user = await User.findById(req.user.id);
        
        if (!user.cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart is empty'
            });
        }

        // Find item in cart
        const itemIndex = user.cart.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Item not found in cart'
            });
        }

        // Update quantity
        user.cart[itemIndex].quantity = quantity;
        await user.save();

        // Populate product details for response
        await user.populate('cart.product');

        const cartItems = user.cart.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalPrice: item.product.price * item.quantity
        }));

        const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 1000 ? 0 : 50;
        const total = subtotal + tax + shipping;

        res.status(200).json({
            status: 'success',
            message: 'Cart updated successfully',
            data: {
                items: cartItems,
                summary: {
                    subtotal,
                    tax,
                    shipping,
                    total,
                    itemCount: cartItems.length
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

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user.id);
        
        if (!user.cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart is empty'
            });
        }

        // Remove item from cart
        user.cart = user.cart.filter(
            item => item.product.toString() !== productId
        );

        await user.save();

        // Populate product details for response
        await user.populate('cart.product');

        const cartItems = user.cart.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalPrice: item.product ? item.product.price * item.quantity : 0
        }));

        const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 1000 ? 0 : 50;
        const total = subtotal + tax + shipping;

        res.status(200).json({
            status: 'success',
            message: 'Item removed from cart successfully',
            data: {
                items: cartItems,
                summary: {
                    subtotal,
                    tax,
                    shipping,
                    total,
                    itemCount: cartItems.length
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

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Cart cleared successfully',
            data: {
                items: [],
                summary: {
                    subtotal: 0,
                    tax: 0,
                    shipping: 0,
                    total: 0,
                    itemCount: 0
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

// @desc    Move item to wishlist
// @route   POST /api/cart/:productId/move-to-wishlist
// @access  Private
router.post('/:productId/move-to-wishlist', protect, async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user.id);
        
        if (!user.cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart is empty'
            });
        }

        // Find item in cart
        const itemIndex = user.cart.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Item not found in cart'
            });
        }

        // Check if product is already in wishlist
        const isInWishlist = user.wishlist.includes(productId);
        if (!isInWishlist) {
            user.wishlist.push(productId);
        }

        // Remove from cart
        user.cart.splice(itemIndex, 1);
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Item moved to wishlist successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        
        if (!user.cart || user.cart.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: {
                    itemCount: 0,
                    subtotal: 0,
                    tax: 0,
                    shipping: 0,
                    total: 0
                }
            });
        }

        const cartItems = user.cart.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalPrice: item.product ? item.product.price * item.quantity : 0
        }));

        const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 1000 ? 0 : 50;
        const total = subtotal + tax + shipping;

        res.status(200).json({
            status: 'success',
            data: {
                itemCount: cartItems.length,
                subtotal,
                tax,
                shipping,
                total
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

// @desc    Validate cart before checkout
// @route   POST /api/cart/validate
// @access  Private
router.post('/validate', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        
        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cart is empty'
            });
        }

        const validationErrors = [];
        const updatedCart = [];

        for (const item of user.cart) {
            const product = item.product;
            
            if (!product || !product.isActive) {
                validationErrors.push({
                    productId: item.product,
                    error: 'Product no longer available'
                });
                continue;
            }

            if (product.stock.quantity < item.quantity) {
                validationErrors.push({
                    productId: product._id,
                    productName: product.name,
                    error: `Only ${product.stock.quantity} items available`,
                    availableQuantity: product.stock.quantity
                });
                
                // Update quantity to available stock
                updatedCart.push({
                    product: product._id,
                    quantity: product.stock.quantity
                });
            } else {
                updatedCart.push({
                    product: product._id,
                    quantity: item.quantity
                });
            }
        }

        // Update cart if there are changes
        if (validationErrors.length > 0) {
            user.cart = updatedCart;
            await user.save();
        }

        res.status(200).json({
            status: 'success',
            data: {
                isValid: validationErrors.length === 0,
                errors: validationErrors,
                updatedCart: validationErrors.length > 0 ? updatedCart : null
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