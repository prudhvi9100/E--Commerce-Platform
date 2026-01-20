const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    updateOrderStatus,
    getSellerOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', addOrderItems);
router.get('/myorders', getMyOrders);
router.get('/seller', authorize('seller', 'admin'), getSellerOrders); // Must be before /:id
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('admin', 'seller'), updateOrderStatus);

module.exports = router;
