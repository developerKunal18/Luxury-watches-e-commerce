const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'First name is required'
            },
            len: {
                args: [2, 50],
                msg: 'First name must be between 2 and 50 characters'
            }
        }
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Last name is required'
            },
            len: {
                args: [2, 50],
                msg: 'Last name must be between 2 and 50 characters'
            }
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'Password must be at least 6 characters'
            }
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^[\+]?[1-9][\d]{0,15}$/,
                msg: 'Please enter a valid phone number'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('user'),
        defaultValue: 'user'
    },
    avatar: {
        type: DataTypes.JSON,
        defaultValue: {
            public_id: null,
            url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
        }
    },
    addresses: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    wishlist: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    emailVerificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    emailVerificationExpire: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resetPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    resetPasswordExpire: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance methods
User.prototype.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.getJwtToken = function() {
    return jwt.sign(
        { id: this.id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
};

User.prototype.getEmailVerificationToken = function() {
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    
    // Hash and set to emailVerificationToken
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    
    // Set expire
    this.emailVerificationExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    return verificationToken;
};

User.prototype.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Set expire
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    return resetToken;
};

module.exports = User; 