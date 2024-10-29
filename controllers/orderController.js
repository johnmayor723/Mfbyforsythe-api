// controllers/orderController.js
const axios = require('axios');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

exports.createOrder = async (req, res) => {
  const { name, email, shippingAddress, totalAmount } = req.body;

  try {
    // Create a new order with "processing" status
    const newOrder = await Order.create({
      name,
      email,
      shippingAddress,
      totalAmount,
      status: 'processing',
    });

    // Initialize Paystack payment session
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: totalAmount * 100, // Convert to kobo
      metadata: {
        orderId: newOrder.orderId,
      },
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      },
    });

    // Send an order confirmation email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Order Confirmation',
      html: `
        <h3>Order Confirmation</h3>
        <p>Thank you for your order, ${name}!</p>
        <p><strong>Order ID:</strong> ${newOrder.orderId}</p>
        <p><strong>Total Amount:</strong> ₦${totalAmount}</p>
        <p><strong>Status:</strong> Processing</p>
        <p>We’ll notify you once your order has been shipped.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Return the Paystack payment URL
    res.json({
      message: 'Order created successfully',
      orderId: newOrder.orderId,
      paymentUrl: response.data.data.authorization_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order.' });
  }
};
