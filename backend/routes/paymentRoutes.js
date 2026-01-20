const express = require('express');
const router = express.Router();
const { processPayment, getMyTransactions } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', processPayment);
router.get('/my-transactions', getMyTransactions);

module.exports = router;
