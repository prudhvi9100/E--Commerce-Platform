const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        // Filter out null products
        const validCart = (user.cart || []).filter(item => item.product !== null);

        // Optional cleanup
        if (user.cart && user.cart.length !== validCart.length) {
            await User.updateOne(
                { _id: req.user.id },
                { $set: { cart: validCart } }
            );
        }

        res.json(validCart);
    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const user = await User.findById(req.user.id);

        // Ensure cart exists
        if (!user.cart) user.cart = [];

        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            // Product exists in cart, update quantity
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            // Product does not exist in cart, add it
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        // Return full cart with details
        const updatedUser = await User.findById(req.user.id).populate('cart.product');
        const validCart = (updatedUser.cart || []).filter(item => item.product !== null);
        res.json(validCart);

    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user.cart) user.cart = [];

        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            if (quantity > 0) {
                user.cart[cartItemIndex].quantity = quantity;
            } else {
                // If quantity is 0 or less, remove item
                user.cart.splice(cartItemIndex, 1);
            }
            await user.save();
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const updatedUser = await User.findById(req.user.id).populate('cart.product');
        const validCart = (updatedUser.cart || []).filter(item => item.product !== null);
        res.json(validCart);

    } catch (error) {
        console.error('Update Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
const removeFromCart = async (req, res) => {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        await User.updateOne(
            { _id: req.user.id },
            { $pull: { cart: { product: productId } } }
        );

        const updatedUser = await User.findById(req.user.id).populate('cart.product');
        const validCart = (updatedUser.cart || []).filter(item => item.product !== null);
        res.json(validCart);

    } catch (error) {
        console.error('Remove from Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
    try {
        await User.updateOne(
            { _id: req.user.id },
            { $set: { cart: [] } }
        );
        res.json([]);
    } catch (error) {
        console.error('Clear Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
