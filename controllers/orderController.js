const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const Order = require('../models/Order'); // Adjust path to your Order model

// Function to create a new Paystack session
exports.createPaystackSession = async (req, res) => {
  const { email, amount } = req.body;
  const key = "sk_test_d754fb2a648e8d822b09aa425d13fc62059ca08e";

  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount,
    }, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    res.json({ paymentUrl: response.data.data.authorization_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Paystack session.' });
  }
};

// Function to create an order and send confirmation emails in plain text
exports.createOrder = async (req, res) => {
    const { name, email, shippingAddress, paymentReference, totalAmount, cart } = req.body;

    const newOrder = new Order({
        name,
        email,
        shippingAddress,
        totalAmount,
        paymentReference,
        status: 'processing',
        uniqueId: uuidv4(),
    });

    try {
        const savedOrder = await newOrder.save();

        // Generate items list as a plain text string
        const itemsList = cart.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₦${item.price}`).join('\n');

        // Prepare plain text email content
        const userEmailText = `
Order Confirmation - FoodDeck

Hello ${name},

Thank you for placing an order with FoodDeck! Here are your order details:

Items:
${itemsList}

Total Quantity: ${cart.reduce((acc, item) => acc + item.quantity, 0)}
Total Amount: ₦${totalAmount}

Notes: Please ensure timely delivery.

Thank you,
FoodDeck Team
        `;

        const adminEmailText = `
New Order Notification - FoodDeck

A new order has been placed. Please review the details below:

Customer: ${name}
Email: ${email}

Shipping Address: ${shippingAddress}

Items:
${itemsList}

Total Quantity: ${cart.reduce((acc, item) => acc + item.quantity, 0)}
Total Amount: ₦${totalAmount}

Please process this order as soon as possible.

Best,
FoodDeck Team
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fooddeck3@gmail.com',
                pass: 'xyca sbvx hifi amzs'  // Replace with actual password
            },
        });

        const userEmailOptions = {
            from: '"FoodDeck" <fooddeck3@gmail.com>',
            to: email,
            subject: 'Order Confirmation - FoodDeck',
            text: userEmailText
        };

        const adminEmailOptions = {
            from: '"FoodDeck" <fooddeck3@gmail.com>',
            to: 'fooddeck3@gmail.com',
            subject: 'New Order Notification - FoodDeck',
            text: adminEmailText
        };

        await transporter.sendMail(userEmailOptions);
        await transporter.sendMail(adminEmailOptions);

        res.status(201).json({ message: 'Order created and emails sent successfully.', order: savedOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order and send emails.' });
    }
};

// Function to update the order status by ID
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Allowed values are shipped, delivered, or cancelled.' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

// Function to track an order by unique ID
exports.trackOrder = async (req, res) => {
  const { uniqueId } = req.params;

  try {
    const order = await Order.findOne({ uniqueId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.json({ status: order.status, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track order.' });
  }
};
