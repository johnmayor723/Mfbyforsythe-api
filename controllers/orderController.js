const Order = require('../models/Order');
const axios = require('axios');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Function to create a new Paystack session
exports.createPaystackSession = async (req, res) => {
  const { email, amount } = req.body;

  const key ="sk_test_d754fb2a648e8d822b09aa425d13fc62059ca08e"
  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount,
    }, {
      headers: {
        Authorization: `Bearer ${key}',
      },
    });

    res.json({ paymentUrl: response.data.data.authorization_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Paystack session.' });
  }
};

// Function to create a new order after payment is completed
exports.createOrder = async (req, res) => {
  const { name, email, shippingAddress, paymentReference, totalAmount, cart } = req.body;
// Function to generate order email HTML content
const generateOrderEmailHTML = (cartItems, orderDetails, isAdmin = false) => {
    const itemsRows = cartItems.map(item => `
        <tr style="border: 1px solid gray;">
            <td style="padding: 10px; text-align: center;"><img src="${item.imageUrl}" alt="${item.name}" width="50"></td>
            <td style="padding: 10px; text-align: center;">${item.name}</td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: center;">₦${item.price}</td>
        </tr>
    `).join('');

    return `
        <div style="text-align: center; padding: 20px;">
            <h1><img src="https://firebasestorage.googleapis.com/v0/b/fooddeck-fc840.appspot.com/o/Logo-removebg-preview%20(3).png?alt=media&token=e3635a63-8ba2-40c8-a3fc-1d068979c172" alt="Company Logo" width="100"></h1>
        </div>
        <div style="padding: 20px;">
            <h3>${isAdmin ? 'New Order Notification' : 'Order Confirmation'}</h3>
            <p>Order Details:</p>
            
            <div style="margin:20px 0;color:#FE9801;font-size:15px; font-style:italic">
                <p>
                    ${isAdmin 
                        ? 'A new order was made. Please review the order details below:' 
                        : `Hello ${orderDetails.name},<br>
                           Thank you for placing an order! Your order has been successfully placed. You can review your order details below. Our sales agent will contact you soon for confirmation.`
                    }
                </p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border: 1px solid gray;">
                        <th style="padding: 10px; text-align: center;">Image</th>
                        <th style="padding: 10px; text-align: center;">Name</th>
                        <th style="padding: 10px; text-align: center;">Quantity</th>
                        <th style="padding: 10px; text-align: center;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>
            <p><strong>Total Quantity:</strong> ${orderDetails.totalQty}</p>
            <p><strong>Total Amount:</strong> ₦${orderDetails.totalAmount}</p>
            <p><strong>Order Notes:</strong> ${orderDetails.ordernotes}</p>
        </div>
        <div style="text-align: center; padding: 20px; border-top: 1px solid gray;">
            <p>Contact us: info@fooddeck.com | Website: www.fooddeck.com.ng</p>
        </div>
    `;
};

//_____<<<<<<<<<<>>>>>>>>>>>>>>_____\\
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

    // Send confirmation email with order details
const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fooddeck3@gmail.com',
        pass: 'xyca sbvx hifi amzs'  // Replace with actual password
    },
    });
const userEmailOptions = {
    from: '"FoodDeck" <fooddeck3@gmail.com>', // Display name with email in brackets
    to: email,
    subject: 'Order Confirmation - FoodDeck',
    html: generateOrderEmailHTML(cart, orderPayload)
};

const adminEmailOptions = {
    from: '"FoodDeck" <fooddeck3@gmail.com>',
    to: 'fooddeck3@gmail.com',
    subject: 'New Order Notification - FoodDeck',
    html: generateOrderEmailHTML(cart, orderPayload, true)
};

    
    
// Send emails 
await transporter.sendMail(userEmailOptions);
await transporter.sendMail(adminEmailOptions);

// Function to get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
};

// Function to get and update order status by ID
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
