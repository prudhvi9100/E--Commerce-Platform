const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    },
    slug: {
        type: String, // e.g., "home-living"
        unique: true,
        lowercase: true,
        trim: true
    },
    icon: {
        type: String, // Stores the Lucide React icon name (e.g., "Smartphone")
        default: 'Package'
    },
    image: {
        type: String,
        default: '/placeholder-category.png'
    },
    description: {
        type: String
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Auto-generate slug from name
categorySchema.pre('save', function (next) {
    if (!this.isModified('name')) {
        next();
    }
    // Only generate slug if not manually provided
    if (!this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
