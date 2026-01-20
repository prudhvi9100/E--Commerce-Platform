const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/seller', protect, authorize('seller', 'admin'), getSellerProducts); // Must be before /:slug
router.get('/:slug', getProductBySlug);

// Private routes (Seller/Admin)
router.post('/', protect, authorize('seller', 'admin'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

// Review Route (Any authenticated user)
const { createProductReview } = require('../controllers/productController');
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
