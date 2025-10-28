const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('wishlist', 'name brand price images')
            .select('-password');

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
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

        const { firstName, lastName, phone } = req.body;

        const user = await User.findById(req.user.id);

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
router.post('/avatar', protect, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'No image uploaded'
            });
        }

        const user = await User.findById(req.user.id);

        // Delete old avatar if exists
        if (user.avatar.public_id) {
            try {
                await deleteImage(user.avatar.public_id);
            } catch (deleteError) {
                console.error('Avatar delete failed:', deleteError);
            }
        }

        // Upload new avatar
        const result = await uploadImage(req.file.path, 'luxury-watches/avatars');

        user.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Avatar uploaded successfully',
            data: { avatar: user.avatar }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
router.post('/addresses', protect, [
    body('type').isIn(['home', 'work', 'other']).withMessage('Invalid address type'),
    body('street').trim().notEmpty().withMessage('Street is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
    body('country').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
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

        const user = await User.findById(req.user.id);

        // If this is the first address or isDefault is true, set it as default
        if (user.addresses.length === 0 || req.body.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        const newAddress = {
            type: req.body.type,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            country: req.body.country || 'United States',
            isDefault: req.body.isDefault || user.addresses.length === 0
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({
            status: 'success',
            message: 'Address added successfully',
            data: { address: newAddress }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId', protect, [
    body('type').optional().isIn(['home', 'work', 'other']).withMessage('Invalid address type'),
    body('street').optional().trim().notEmpty().withMessage('Street cannot be empty'),
    body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
    body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
    body('zipCode').optional().trim().notEmpty().withMessage('Zip code cannot be empty'),
    body('country').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
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

        const user = await User.findById(req.user.id);
        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === req.params.addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Address not found'
            });
        }

        // If setting as default, unset other addresses
        if (req.body.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        // Update address
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                user.addresses[addressIndex][key] = req.body[key];
            }
        });

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Address updated successfully',
            data: { address: user.addresses[addressIndex] }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === req.params.addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Address not found'
            });
        }

        const deletedAddress = user.addresses.splice(addressIndex, 1)[0];

        // If deleted address was default, set first remaining address as default
        if (deletedAddress.isDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Address deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('wishlist', 'name brand price images category description');

        res.status(200).json({
            status: 'success',
            data: { wishlist: user.wishlist }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const user = await User.findById(req.user.id);

        // Check if product is already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Product already in wishlist'
            });
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Product added to wishlist successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user.id);

        // Check if product is in wishlist
        const productIndex = user.wishlist.indexOf(productId);
        if (productIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found in wishlist'
            });
        }

        user.wishlist.splice(productIndex, 1);
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Product removed from wishlist successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Clear wishlist
// @route   DELETE /api/users/wishlist
// @access  Private
router.delete('/wishlist', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist = [];
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Wishlist cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build filter
        const filter = {};
        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.status(200).json({
            status: 'success',
            data: {
                users,
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

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('wishlist', 'name brand price images');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
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

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it already exists
        if (req.body.email && req.body.email !== user.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already exists'
                });
            }
        }

        // Update user fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                user[key] = req.body[key];
            }
        });

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete your own account'
            });
        }

        // Soft delete - set isActive to false
        user.isActive = false;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
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