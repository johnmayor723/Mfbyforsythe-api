const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending'
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'  // Default status when order is created
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);