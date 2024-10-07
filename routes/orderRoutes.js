const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Route to create a new order
router.post('/', createOrder);

// Route to get user's orders
router.get('/myorders', getMyOrders);

// Admin routes
router.get('/',  getAllOrders);
router.put('/:id/status',  updateOrderStatus);

module.exports = router;