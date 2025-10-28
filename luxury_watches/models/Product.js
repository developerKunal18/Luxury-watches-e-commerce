const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        enum: ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Cartier', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin', 'Breguet', 'A. Lange & Söhne']
    },
    model: {
        type: String,
        required: [true, 'Model is required'],
        trim: true
    },
    reference: {
        type: String,
        unique: true,
        required: [true, 'Reference number is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'CHF']
    },
    images: [{
        public_id: String,
        url: {
            type: String,
            required: true
        },
        alt: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Diving', 'Chronograph', 'Dress', 'Sports', 'Pilot', 'GMT', 'Moon Phase', 'Perpetual Calendar', 'Tourbillon', 'Skeleton']
    },
    movement: {
        type: {
            type: String,
            enum: ['Automatic', 'Manual', 'Quartz'],
            required: true
        },
        caliber: String,
        powerReserve: String,
        frequency: String
    },
    case: {
        material: {
            type: String,
            enum: ['Stainless Steel', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Titanium', 'Ceramic'],
            required: true
        },
        diameter: Number, // in mm
        thickness: Number, // in mm
        waterResistance: String
    },
    dial: {
        color: String,
        material: String,
        indices: String,
        hands: String
    },
    bracelet: {
        material: String,
        type: String,
        clasp: String
    },
    crystal: {
        type: String,
        enum: ['Sapphire', 'Mineral', 'Acrylic'],
        default: 'Sapphire'
    },
    features: [{
        type: String,
        enum: ['Date', 'Day-Date', 'Chronograph', 'GMT', 'Moon Phase', 'Perpetual Calendar', 'Annual Calendar', 'Tourbillon', 'Skeleton', 'Luminous', 'Tachymeter', 'Telemeter', 'Pulsometer']
    }],
    specifications: {
        caseDiameter: Number,
        caseThickness: Number,
        lugWidth: Number,
        waterResistance: String,
        powerReserve: String,
        frequency: String,
        jewels: Number
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Excellent', 'Very Good', 'Good'],
        default: 'New'
    },
    yearOfManufacture: {
        type: Number,
        min: [1900, 'Year must be after 1900'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    warranty: {
        hasWarranty: {
            type: Boolean,
            default: true
        },
        duration: String,
        type: String
    },
    boxAndPapers: {
        hasBox: {
            type: Boolean,
            default: true
        },
        hasPapers: {
            type: Boolean,
            default: true
        },
        hasCard: {
            type: Boolean,
            default: true
        }
    },
    stock: {
        quantity: {
            type: Number,
            required: true,
            min: [0, 'Stock cannot be negative'],
            default: 0
        },
        lowStockThreshold: {
            type: Number,
            default: 5
        }
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            maxlength: [500, 'Review comment cannot exceed 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    isOnSale: {
        type: Boolean,
        default: false
    },
    salePercentage: {
        type: Number,
        min: 0,
        max: 100
    },
    seo: {
        title: String,
        description: String,
        keywords: [String]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for search functionality
productSchema.index({
    name: 'text',
    brand: 'text',
    model: 'text',
    description: 'text',
    tags: 'text'
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
    return this.stock.quantity > 0;
};

// Method to check if stock is low
productSchema.methods.isLowStock = function() {
    return this.stock.quantity <= this.stock.lowStockThreshold && this.stock.quantity > 0;
};

// Method to update stock
productSchema.methods.updateStock = function(quantity) {
    this.stock.quantity += quantity;
    if (this.stock.quantity < 0) {
        this.stock.quantity = 0;
    }
    return this.save();
};

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.ratings.average = 0;
        this.ratings.count = 0;
    } else {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.ratings.average = totalRating / this.reviews.length;
        this.ratings.count = this.reviews.length;
    }
    return this.save();
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema); 