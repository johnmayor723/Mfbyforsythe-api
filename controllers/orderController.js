const Order = require('../models/Order');

// @desc Create new order
// @route POST /api/orders
// @access Private
const createOrder = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};

// @desc Get logged-in user's orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc Get all orders (Admin)
// @route GET /api/orders
// @access Private/Admin
const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
};

// @desc Update order status (Admin)
// @route PUT /api/orders/:id/status
// @access Private/Admin

/*const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.orderStatus = req.body.orderStatus || order.orderStatus;
        order.isDelivered = req.body.isDelivered || order.isDelivered;
        order.deliveredAt = req.body.isDelivered ? Date.now() : order.deliveredAt;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};*/

// @desc Update order status
// @route PUT /api/orders/:id/status
// @access Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;  // Get new status from request body

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findById(req.params.id);

    if (order) {
        // Hardcoded logic for different statuses
        if (status === 'Processing') {
            order.orderStatus = 'Processing';
            order.isDelivered = false;
            order.deliveredAt = null; // Ensure deliveredAt is null when processing
        } else if (status === 'Shipped') {
            order.orderStatus = 'Shipped';
            order.isDelivered = false; // Mark as not delivered yet
            order.deliveredAt = null; // Ensure deliveredAt is null when shipped
        } else if (status === 'Delivered') {
            order.orderStatus = 'Delivered';
            order.isDelivered = true; // Mark as delivered
            order.deliveredAt = Date.now(); // Set delivered time to now
        } else {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    
};