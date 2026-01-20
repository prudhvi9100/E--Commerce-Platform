const Order = require('../models/Order');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // 1. Check Stock Availability
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Out of stock: ${item.name}. Only ${product.stock} left.` });
            }
        }

        const order = new Order({
            user: req.user.id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        });

        const createdOrder = await order.save();

        // 2. Reduce Stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // 3. Send Confirmation Email
        try {
            const message = `Thank you for your order! \n\nOrder ID: ${createdOrder._id} \nTotal: ₹${totalPrice}`;
            const html = `
                <h1>Order Confirmed!</h1>
                <p>Hi ${req.user.name},</p>
                <p>Thank you for shopping with us. Your order has been placed successfully.</p>
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${createdOrder._id}</p>
                <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
                <p>You can track your order status in your account.</p>
            `;

            await sendEmail({
                email: req.user.email,
                subject: 'Order Confirmation - VaultHub',
                message,
                html
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the order if email fails, just log it
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only Admin or Order Owner can view
        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in seller orders (Orders containing seller's products)
// @route   GET /api/orders/seller
// @access  Private (Seller)
const getSellerOrders = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

        // Find all products belonging to this seller
        const products = await Product.find({ seller: seller._id }).select('_id');
        const productIds = products.map(p => p._id);

        if (productIds.length === 0) {
            return res.json([]);
        }

        // Find orders containing any of these products
        const orders = await Order.find({ 'orderItems.product': { $in: productIds } })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Seller) - Ideally Admin handles central updates, or complex logic for multi-vendor
const updateOrderStatus = async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;
        const order = await Order.findById(req.params.id).populate('user', 'name email'); // Populate user for email

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const previousStatus = order.status;
        order.status = status || order.status;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();

        // Send Email if status changed
        if (status && status !== previousStatus) {
            console.log(`[OrderController] Status changed from ${previousStatus} to ${status}. Sending email to ${order.user.email}...`);
            try {
                const message = `Your order status has been updated to: ${status}`;
                const html = `
                    <h1>Order Update</h1>
                    <p>Hi ${order.user.name},</p>
                    <p>Your order <strong>#${order._id}</strong> status has been updated.</p>
                    <h2>New Status: <span style="color: blue">${status.toUpperCase()}</span></h2>
                    ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
                    <p>Thank you for shopping with us!</p>
                `;

                await sendEmail({
                    email: order.user.email,
                    subject: `Order Status Update - ${status.toUpperCase()}`,
                    message,
                    html
                });
                console.log('[OrderController] Status email sent successfully.');
            } catch (emailError) {
                console.error('[OrderController] Status email failed:', emailError);
            }
        } else {
            console.log(`[OrderController] No status change detected (Old: ${previousStatus}, New: ${status}) or status undefined. Skipping email.`);
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    updateOrderStatus,
    getSellerOrders
};
