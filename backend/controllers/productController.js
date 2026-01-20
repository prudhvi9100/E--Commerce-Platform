const Product = require('../models/Product');
const Seller = require('../models/Seller');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = {};

        // Filter by Category
        if (category) {
            query.category = category;
        }

        // Search by Title or Description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let productsQuery = Product.find(query).populate('seller', 'storeName logo rating');

        // Sorting
        if (sort === 'price-asc') {
            productsQuery = productsQuery.sort({ price: 1 });
        } else if (sort === 'price-desc') {
            productsQuery = productsQuery.sort({ price: -1 });
        } else {
            productsQuery = productsQuery.sort({ createdAt: -1 }); // Newest first
        }

        const products = await productsQuery;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate('seller', 'storeName logo rating returnPolicy address');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in seller products
// @route   GET /api/products/seller
// @access  Private (Seller)
const getSellerProducts = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) {
            return res.status(404).json({ message: 'Seller profile not found' });
        }

        const products = await Product.find({ seller: seller._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Seller)
const createProduct = async (req, res) => {
    try {
        // Verify if user is a seller
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) {
            return res.status(403).json({ message: 'You must create a seller profile first' });
        }

        let images = [];
        if (req.files) {
            images = req.files.map(file => `/uploads/${file.filename}`);
        }

        // Generate slug from title
        const slug = req.body.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        const product = new Product({
            ...req.body,
            slug,
            seller: seller._id,
            images
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check ownership
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller || (product.seller.toString() !== seller._id.toString() && req.user.role !== 'admin')) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        let updatedData = { ...req.body };

        // Handle Image Update (Append or Replace logic needed - simplifing to append/replace if new files)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            // Option: Replace all images or Append. For now, replacing images if new ones are uploaded.
            // Better UX would be to handle removal separately.
            updatedData.images = newImages;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check ownership
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller || (product.seller.toString() !== seller._id.toString() && req.user.role !== 'admin')) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user.id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user.id,
                userAvatar: req.user.avatar
            };

            product.reviews.push(review);

            product.reviewCount = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts,
    createProductReview
};
