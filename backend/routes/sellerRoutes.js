const express = require('express');
const router = express.Router();
const { registerSeller, getSellerProfile, updateSellerProfile, getSellerAnalytics } = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/', protect, registerSeller);
router.get('/me', protect, authorize('seller'), getSellerProfile);
router.put('/me', protect, authorize('seller'), updateSellerProfile);
router.get('/analytics', protect, authorize('seller'), getSellerAnalytics);

module.exports = router;
