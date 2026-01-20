const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyReviewed = await Review.findOne({
            user: req.user.id,
            product: productId
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = await Review.create({
            user: req.user.id,
            product: productId,
            rating: Number(rating),
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete review (Admin/Owner)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only review owner or admin can delete
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getProductReviews,
    addReview,
    deleteReview
};
