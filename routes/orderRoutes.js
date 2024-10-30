// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to create a Paystack session
router.post('/create-paystack-session', orderController.createPaystackSession);

// Route to create an order after successful payment
router.post('/api/orders', orderController.createOrder);

// Route to get all orders
router.get('/api/orders', orderController.getAllOrders);

// Route to update order status
router.put('/api/orders/:orderId', orderController.updateOrderStatus);

// Route to track an order by unique ID
router.get('/api/orders/track/:uniqueId', orderController.trackOrder);

module.exports = router;
