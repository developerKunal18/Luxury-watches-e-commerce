const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        brand: String,
        reference: String,
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: String,
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    shippingAddress: {
        firstName: String,
        lastName: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'United States'
        },
        phone: String
    },
    billingAddress: {
        firstName: String,
        lastName: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'United States'
        }
    },
    paymentInfo: {
        id: String,
        status: String,
        method: {
            type: String,
            enum: ['stripe', 'paypal', 'bank_transfer', 'cash_on_delivery'],
            required: true
        },
        transactionId: String,
        paidAt: Date
    },
    pricing: {
        subtotal: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            default: 0
        },
        shipping: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    shipping: {
        method: {
            type: String,
            enum: ['standard', 'express', 'overnight', 'international'],
            default: 'standard'
        },
        carrier: String,
        trackingNumber: String,
        estimatedDelivery: Date,
        shippedAt: Date,
        deliveredAt: Date
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    notes: {
        customer: String,
        internal: String
    },
    isGift: {
        type: Boolean,
        default: false
    },
    giftMessage: String,
    warranty: {
        hasWarranty: {
            type: Boolean,
            default: true
        },
        duration: String,
        startDate: Date
    },
    insurance: {
        hasInsurance: {
            type: Boolean,
            default: false
        },
        amount: Number,
        provider: String
    },
    returnPolicy: {
        allowed: {
            type: Boolean,
            default: true
        },
        days: {
            type: Number,
            default: 30
        },
        conditions: String
    },
    cancellation: {
        allowed: {
            type: Boolean,
            default: true
        },
        deadline: Date,
        reason: String
    }
}, {
    timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Get count of orders for today
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const orderCount = await this.constructor.countDocuments({
            createdAt: { $gte: today }
        });
        
        const sequence = (orderCount + 1).toString().padStart(4, '0');
        this.orderNumber = `LW${year}${month}${day}${sequence}`;
    }
    next();
});

// Calculate totals
orderSchema.pre('save', function(next) {
    if (this.items && this.items.length > 0) {
        // Calculate subtotal
        this.pricing.subtotal = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        // Calculate total
        this.pricing.total = this.pricing.subtotal + this.pricing.tax + this.pricing.shipping - this.pricing.discount;
    }
    next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date()
        });
    }
    next();
});

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
    return {
        orderNumber: this.orderNumber,
        totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: this.pricing.total,
        status: this.status,
        createdAt: this.createdAt
    };
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        note,
        updatedBy
    });
    return this.save();
};

// Method to add shipping information
orderSchema.methods.addShippingInfo = function(shippingData) {
    this.shipping = { ...this.shipping, ...shippingData };
    if (shippingData.trackingNumber) {
        this.status = 'shipped';
        this.shipping.shippedAt = new Date();
    }
    return this.save();
};

// Method to mark as delivered
orderSchema.methods.markAsDelivered = function() {
    this.status = 'delivered';
    this.shipping.deliveredAt = new Date();
    return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason = '') {
    this.status = 'cancelled';
    this.cancellation.reason = reason;
    return this.save();
};

// Method to process refund
orderSchema.methods.processRefund = function(amount = null) {
    this.status = 'refunded';
    if (amount) {
        this.pricing.refundAmount = amount;
    }
    return this.save();
};

// Static method to get order statistics
orderSchema.statics.getStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$pricing.total' },
                averageOrderValue: { $avg: '$pricing.total' }
            }
        }
    ]);
    
    const statusStats = await this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
    
    return {
        ...stats[0],
        statusBreakdown: statusStats
    };
};

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema); 