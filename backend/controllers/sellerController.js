const Seller = require('../models/Seller');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Register a new seller (Create Store)
// @route   POST /api/sellers
// @access  Private (User)
const registerSeller = async (req, res) => {
    try {
        const { storeName, storeDescription, address, returnPolicy } = req.body;

        // Check if user already has a seller profile
        const sellerExists = await Seller.findOne({ user: req.user.id });
        if (sellerExists) {
            return res.status(400).json({ message: 'User already has a seller profile' });
        }

        // Check if store name is unique
        const storeNameExists = await Seller.findOne({ storeName });
        if (storeNameExists) {
            return res.status(400).json({ message: 'Store name already taken' });
        }

        const seller = await Seller.create({
            user: req.user.id,
            storeName,
            storeDescription,
            address,
            returnPolicy
        });

        // Update user role to seller if not already
        if (req.user.role !== 'seller') {
            await User.findByIdAndUpdate(req.user.id, { role: 'seller' });
        }

        res.status(201).json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current seller profile
// @route   GET /api/sellers/me
// @access  Private (Seller)
const getSellerProfile = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) {
            return res.status(404).json({ message: 'Seller profile not found' });
        }
        res.json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update seller profile
// @route   PUT /api/sellers/me
// @access  Private (Seller)
const updateSellerProfile = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });

        if (!seller) {
            // Upsert: Create if not exists
            const newSeller = await Seller.create({
                user: req.user.id,
                storeName: req.body.storeName || `${req.user.name}'s Store`,
                storeDescription: req.body.storeDescription || '',
                address: req.body.address || '',
                returnPolicy: req.body.returnPolicy || '',
                phone: req.body.phone || '',
                logo: req.body.logo || '',
                coverImage: req.body.coverImage || ''
            });

            // Ensure user role is updated
            if (req.user.role !== 'seller') {
                await User.findByIdAndUpdate(req.user.id, { role: 'seller' });
            }

            return res.status(201).json(newSeller);
        }

        // Update existing fields
        seller.storeName = req.body.storeName || seller.storeName;
        seller.storeDescription = req.body.storeDescription || seller.storeDescription;
        seller.returnPolicy = req.body.returnPolicy || seller.returnPolicy;
        seller.phone = req.body.phone || seller.phone;
        seller.address = req.body.address || seller.address;
        seller.logo = req.body.logo || seller.logo;
        seller.coverImage = req.body.coverImage || seller.coverImage;

        const updatedSeller = await seller.save();
        res.json(updatedSeller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get seller analytics
// @route   GET /api/sellers/analytics
// @access  Private (Seller)
const getSellerAnalytics = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

        const products = await Product.find({ seller: seller._id });
        const productIds = products.map(p => p._id.toString());

        const orders = await Order.find({ 'orderItems.product': { $in: productIds } });

        let totalRevenue = 0;

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (productIds.includes(item.product.toString())) {
                    totalRevenue += item.price * item.quantity;
                }
            });
        });

        res.json({
            totalRevenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalCustomers: [...new Set(orders.map(o => o.user.toString()))].length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerSeller,
    getSellerProfile,
    updateSellerProfile,
    getSellerAnalytics
};
