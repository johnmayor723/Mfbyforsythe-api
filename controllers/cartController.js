const Cart = require('../models/Cart');

// @desc Add product to cart
// @route POST /api/cart
// @access Private
const addToCart = async (req, res) => {
    const { product, qty, name, image, price } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        // Update cart items if cart exists
        const productExists = cart.cartItems.find(item => item.product.toString() === product);

        if (productExists) {
            productExists.qty += qty;
        } else {
            cart.cartItems.push({ product, qty, name, image, price });
        }

        await cart.save();
        return res.json(cart);
    } else {
        // Create new cart
        const newCart = new Cart({
            user: req.user._id,
            cartItems: [{ product, qty, name, image, price }]
        });

        await newCart.save();
        res.status(201).json(newCart);
    }
};

// @desc Get user's cart
// @route GET /api/cart
// @access Private
const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart);
};

// @desc Remove product from cart
// @route DELETE /api/cart/:id
// @access Private
const removeFromCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== req.params.id);
        await cart.save();
        return res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

// @desc Clear cart after order
// @route DELETE /api/cart
// @access Private
const clearCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = [];
        await cart.save();
        return res.json({ message: 'Cart cleared' });
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
};