const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller', // Links to the Seller Profile (Store)
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    originalPrice: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['electronics', 'fashion', 'home-living', 'sports', 'books', 'beauty', 'toys', 'grocery', 'others']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    images: {
        type: [String],
        required: [true, 'Please add at least one image']
    },
    tags: {
        type: [String]
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            userAvatar: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Product', productSchema);
