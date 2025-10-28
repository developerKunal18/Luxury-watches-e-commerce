const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (filePath, folder = 'luxury-watches') => {
    try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration not found');
        }

        // Optimize image before upload
        const optimizedPath = await optimizeImage(filePath);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(optimizedPath, {
            folder: folder,
            resource_type: 'image',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ],
            eager: [
                { width: 800, height: 600, crop: 'fill', quality: 'auto:good' },
                { width: 400, height: 300, crop: 'fill', quality: 'auto:good' },
                { width: 200, height: 150, crop: 'fill', quality: 'auto:good' }
            ],
            eager_async: true,
            eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL
        });

        // Clean up optimized file
        if (optimizedPath !== filePath) {
            fs.unlinkSync(optimizedPath);
        }

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration not found');
        }

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

// Optimize image using Sharp
const optimizeImage = async (filePath) => {
    try {
        const ext = path.extname(filePath).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);

        if (!isImage) {
            return filePath; // Return original if not an image
        }

        const optimizedPath = filePath.replace(ext, `_optimized${ext}`);
        
        await sharp(filePath)
            .resize(1200, 1200, { 
                fit: 'inside', 
                withoutEnlargement: true 
            })
            .jpeg({ quality: 85, progressive: true })
            .png({ quality: 85, progressive: true })
            .webp({ quality: 85 })
            .toFile(optimizedPath);

        return optimizedPath;
    } catch (error) {
        console.error('Image optimization error:', error);
        return filePath; // Return original if optimization fails
    }
};

// Generate image transformations
const generateImageTransformations = (publicId, options = {}) => {
    const {
        width = 800,
        height = 600,
        crop = 'fill',
        quality = 'auto:good',
        format = 'auto'
    } = options;

    const transformations = [
        { width, height, crop, quality },
        { fetch_format: format }
    ];

    return cloudinary.url(publicId, {
        transformation: transformations
    });
};

// Generate responsive images
const generateResponsiveImages = (publicId) => {
    const sizes = [
        { width: 1200, height: 900, suffix: 'large' },
        { width: 800, height: 600, suffix: 'medium' },
        { width: 400, height: 300, suffix: 'small' },
        { width: 200, height: 150, suffix: 'thumbnail' }
    ];

    const responsiveImages = {};

    sizes.forEach(size => {
        responsiveImages[size.suffix] = cloudinary.url(publicId, {
            transformation: [
                { width: size.width, height: size.height, crop: 'fill', quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });
    });

    return responsiveImages;
};

// Upload multiple images
const uploadMultipleImages = async (files, folder = 'luxury-watches') => {
    try {
        const uploadPromises = files.map(file => uploadImage(file.path, folder));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('Multiple image upload error:', error);
        throw error;
    }
};

// Get image info from Cloudinary
const getImageInfo = async (publicId) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration not found');
        }

        const result = await cloudinary.api.resource(publicId);
        return result;
    } catch (error) {
        console.error('Get image info error:', error);
        throw error;
    }
};

// Search images in Cloudinary
const searchImages = async (query = '', options = {}) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration not found');
        }

        const {
            max_results = 10,
            next_cursor = null,
            folder = 'luxury-watches'
        } = options;

        const searchParams = {
            expression: `folder:${folder}${query ? ` AND ${query}` : ''}`,
            max_results,
            next_cursor
        };

        const result = await cloudinary.search(searchParams);
        return result;
    } catch (error) {
        console.error('Search images error:', error);
        throw error;
    }
};

// Create image collage
const createCollage = async (publicIds, options = {}) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration not found');
        }

        const {
            width = 800,
            height = 600,
            columns = 2,
            rows = 2
        } = options;

        const result = await cloudinary.image(publicIds.join(','), {
            transformation: [
                { width, height, crop: 'fill' },
                { flags: 'layer_apply' },
                { flags: 'flatten' }
            ]
        });

        return result;
    } catch (error) {
        console.error('Create collage error:', error);
        throw error;
    }
};

// Add watermark to image
const addWatermark = async (publicId, watermarkText = 'Luxury Watches', options = {}) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration not found');
        }

        const {
            position = 'south_east',
            font_size = 20,
            font_family = 'Arial',
            color = 'white',
            opacity = 70
        } = options;

        const result = await cloudinary.url(publicId, {
            transformation: [
                { overlay: { text: watermarkText, font_family, font_size, color } },
                { flags: 'layer_apply', gravity: position, opacity }
            ]
        });

        return result;
    } catch (error) {
        console.error('Add watermark error:', error);
        throw error;
    }
};

module.exports = {
    uploadImage,
    deleteImage,
    optimizeImage,
    generateImageTransformations,
    generateResponsiveImages,
    uploadMultipleImages,
    getImageInfo,
    searchImages,
    createCollage,
    addWatermark
}; 