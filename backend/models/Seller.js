const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // One user can have only one seller profile
    },
    storeName: {
        type: String,
        required: [true, 'Please add a store name'],
        unique: true,
        trim: true
    },
    storeDescription: {
        type: String,
        required: [true, 'Please add a store description']
    },
    logo: {
        type: String,
        default: '/placeholder-store.png'
    },
    coverImage: {
        type: String,
        default: '/placeholder-cover.png'
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String }
    },
    contactEmail: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid contact email'
        ]
    },
    phone: {
        type: String
    },
    returnPolicy: {
        type: String,
        default: 'No return policy provided.'
    },
    isVerified: {
        type: Boolean,
        default: false // Requires admin approval
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Seller', sellerSchema);
