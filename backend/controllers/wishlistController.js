const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        // Filter out any null products (e.g., if a product was deleted but id remained in wishlist)
        const validWishlist = (user.wishlist || []).filter(item => item !== null);

        // Optional: Update user's wishlist to remove invalid IDs permanently
        if (user.wishlist.length !== validWishlist.length) {
            await User.updateOne(
                { _id: req.user.id },
                { $set: { wishlist: validWishlist.map(item => item._id) } }
            );
        }

        res.json(validWishlist);
    } catch (error) {
        console.error('Get Wishlist Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const mongoose = require('mongoose');

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Use $addToSet to avoid duplicates atomically
        await User.updateOne(
            { _id: req.user.id },
            { $addToSet: { wishlist: productId } }
        );

        // Fetch and return the updated populated wishlist
        const user = await User.findById(req.user.id).populate('wishlist');
        const validWishlist = (user.wishlist || []).filter(item => item !== null);

        // Cleanup if needed (optional here since we just added one, but good for consistency)
        if (user.wishlist.length !== validWishlist.length) {
            await User.updateOne(
                { _id: req.user.id },
                { $set: { wishlist: validWishlist.map(item => item._id) } }
            );
        }

        res.json(validWishlist);
    } catch (error) {
        console.error('Add to Wishlist Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        // Use $pull to remove item atomically
        await User.updateOne(
            { _id: req.user.id },
            { $pull: { wishlist: req.params.id } }
        );

        // Fetch and return updated populated wishlist
        const user = await User.findById(req.user.id).populate('wishlist');
        const validWishlist = (user.wishlist || []).filter(item => item !== null);

        // Cleanup
        if (user.wishlist.length !== validWishlist.length) {
            await User.updateOne(
                { _id: req.user.id },
                { $set: { wishlist: validWishlist.map(item => item._id) } }
            );
        }

        res.json(validWishlist);
    } catch (error) {
        console.error('Remove from Wishlist Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
