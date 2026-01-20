const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Process a new payment (Mock)
// @route   POST /api/payments
// @access  Private
const processPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, amount, paymentResult } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the order
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create Payment Record
        const payment = await Payment.create({
            user: req.user.id,
            order: orderId,
            paymentMethod,
            amount,
            status: 'completed', // Mocking success
            transactionId: paymentResult?.id || `TXN_${Date.now()}`,
            paymentResult
        });

        // Update Order Status
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = paymentResult;
        await order.save();

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user transactions
// @route   GET /api/payments/my-transactions
// @access  Private
const getMyTransactions = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    processPayment,
    getMyTransactions
};
