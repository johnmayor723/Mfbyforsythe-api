const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

router.post('/',  addToCart);
router.get('/',  getCart);
router.delete('/:id',  removeFromCart);
router.delete('/',  clearCart);

module.exports = router;