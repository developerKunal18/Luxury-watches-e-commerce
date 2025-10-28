const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sort').optional().isIn(['price', '-price', 'name', '-name', 'createdAt', '-createdAt', 'ratings.average', '-ratings.average']).withMessage('Invalid sort parameter'),
    query('brand').optional().isString().withMessage('Brand must be a string'),
    query('category').optional().isString().withMessage('Category must be a string'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('inStock').optional().isBoolean().withMessage('In stock must be a boolean'),
    query('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
    query('onSale').optional().isBoolean().withMessage('On sale must be a boolean')
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

        const {
            page = 1,
            limit = 12,
            sort = '-createdAt',
            brand,
            category,
            minPrice,
            maxPrice,
            search,
            inStock,
            featured,
            onSale
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (brand) filter.brand = brand;
        if (category) filter.category = category;
        if (featured !== undefined) filter.isFeatured = featured === 'true';
        if (onSale !== undefined) filter.isOnSale = onSale === 'true';
        if (inStock !== undefined) {
            if (inStock === 'true') {
                filter['stock.quantity'] = { $gt: 0 };
            } else {
                filter['stock.quantity'] = { $lte: 0 };
            }
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Search functionality
        if (search) {
            filter.$text = { $search: search };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        let sortObj = {};
        if (sort.startsWith('-')) {
            sortObj[sort.slice(1)] = -1;
        } else {
            sortObj[sort] = 1;
        }

        // Execute query
        const products = await Product.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('reviews.user', 'firstName lastName');

        // Get total count for pagination
        const total = await Product.countDocuments(filter);

        // Calculate pagination info
        const totalPages = Math.ceil(total / parseInt(limit));
        const hasNextPage = parseInt(page) < totalPages;
        const hasPrevPage = parseInt(page) > 1;

        res.status(200).json({
            status: 'success',
            data: {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit),
                    hasNextPage,
                    hasPrevPage
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('reviews.user', 'firstName lastName avatar')
            .populate('createdBy', 'firstName lastName');

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        if (!product.isActive) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
    body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
    body('brand').isIn(['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Cartier', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin', 'Breguet', 'A. Lange & Söhne']).withMessage('Invalid brand'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('reference').trim().notEmpty().withMessage('Reference is required'),
    body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isIn(['Diving', 'Chronograph', 'Dress', 'Sports', 'Pilot', 'GMT', 'Moon Phase', 'Perpetual Calendar', 'Tourbillon', 'Skeleton']).withMessage('Invalid category'),
    body('movement.type').isIn(['Automatic', 'Manual', 'Quartz']).withMessage('Invalid movement type'),
    body('case.material').isIn(['Stainless Steel', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Titanium', 'Ceramic']).withMessage('Invalid case material'),
    body('stock.quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
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

        // Check if reference already exists
        const existingProduct = await Product.findOne({ reference: req.body.reference });
        if (existingProduct) {
            return res.status(400).json({
                status: 'error',
                message: 'Product with this reference already exists'
            });
        }

        const product = await Product.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: { product }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Check if reference is being changed and if it already exists
        if (req.body.reference && req.body.reference !== product.reference) {
            const existingProduct = await Product.findOne({ reference: req.body.reference });
            if (existingProduct) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Product with this reference already exists'
                });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: { product: updatedProduct }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Soft delete - set isActive to false
        product.isActive = false;
        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private/Admin
router.post('/:id/images', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No images uploaded'
            });
        }

        const uploadedImages = [];

        for (const file of req.files) {
            try {
                const result = await uploadImage(file.path, 'luxury-watches/products');
                
                uploadedImages.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                    alt: file.originalname
                });
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
            }
        }

        // Add images to product
        product.images.push(...uploadedImages);
        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Images uploaded successfully',
            data: { images: uploadedImages }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
router.delete('/:id/images/:imageId', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const image = product.images.id(req.params.imageId);
        if (!image) {
            return res.status(404).json({
                status: 'error',
                message: 'Image not found'
            });
        }

        // Delete from cloudinary
        try {
            await deleteImage(image.public_id);
        } catch (deleteError) {
            console.error('Cloudinary delete failed:', deleteError);
        }

        // Remove from product
        image.remove();
        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
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

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const existingReview = product.reviews.find(
            review => review.user.toString() === req.user.id
        );

        if (existingReview) {
            return res.status(400).json({
                status: 'error',
                message: 'You have already reviewed this product'
            });
        }

        // Add review
        product.reviews.push({
            user: req.user.id,
            rating: req.body.rating,
            comment: req.body.comment
        });

        // Recalculate average rating
        await product.calculateAverageRating();

        res.status(201).json({
            status: 'success',
            message: 'Review added successfully',
            data: { product }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
router.put('/:id/reviews/:reviewId', protect, [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
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

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const review = product.reviews.id(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                status: 'error',
                message: 'Review not found'
            });
        }

        // Check if user owns this review
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to update this review'
            });
        }

        // Update review
        if (req.body.rating) review.rating = req.body.rating;
        if (req.body.comment !== undefined) review.comment = req.body.comment;

        await product.save();

        // Recalculate average rating
        await product.calculateAverageRating();

        res.status(200).json({
            status: 'success',
            message: 'Review updated successfully',
            data: { product }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const review = product.reviews.id(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                status: 'error',
                message: 'Review not found'
            });
        }

        // Check if user owns this review or is admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this review'
            });
        }

        // Remove review
        review.remove();
        await product.save();

        // Recalculate average rating
        await product.calculateAverageRating();

        res.status(200).json({
            status: 'success',
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get product statistics
// @route   GET /api/products/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    activeProducts: { $sum: { $cond: ['$isActive', 1, 0] } },
                    totalValue: { $sum: { $multiply: ['$price', '$stock.quantity'] } },
                    averagePrice: { $avg: '$price' },
                    lowStockProducts: { $sum: { $cond: [{ $lte: ['$stock.quantity', '$stock.lowStockThreshold'] }, 1, 0] } },
                    outOfStockProducts: { $sum: { $cond: [{ $eq: ['$stock.quantity', 0] }, 1, 0] } }
                }
            }
        ]);

        const brandStats = await Product.aggregate([
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const categoryStats = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                overview: stats[0] || {},
                brandBreakdown: brandStats,
                categoryBreakdown: categoryStats
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