const Order = require('../models/Order');
const axios = require('axios');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

//email template
const loadEmailTemplate = (filePath, replacements) => {
    let template = fs.readFileSync(filePath, 'utf8');
    for (const [key, value] of Object.entries(replacements)) {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return template;
};


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

        const orderPayload = {
            emailTitle: 'Order Confirmation - FoodDeck',
            greetingMessage: `Hello ${name},<br>Thank you for placing an order!`,
            totalQty: cart.reduce((acc, item) => acc + item.quantity, 0),
            totalAmount,
            orderNotes: 'Please ensure timely delivery',
            itemsRows: cart.map(item => `
                <tr>
                    <td><img src="${item.imageUrl}" alt="${item.name}" width="50"></td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₦${item.price}</td>
                </tr>
            `).join('')
        };

        const userEmailHTML = loadEmailTemplate(path.join(__dirname, 'templates', 'orderEmailTemplate.html'), orderPayload);
        const adminEmailHTML = loadEmailTemplate(path.join(__dirname, 'templates', 'orderEmailTemplate.html'), {
            ...orderPayload,
            emailTitle: 'New Order Notification - FoodDeck',
            greetingMessage: 'A new order was made. Please review the details below.'
        });

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
            html: userEmailHTML
        };

        const adminEmailOptions = {
            from: '"FoodDeck" <fooddeck3@gmail.com>',
            to: 'fooddeck3@gmail.com',
            subject: 'New Order Notification - FoodDeck',
            html: adminEmailHTML
        };

        await transporter.sendMail(userEmailOptions);
        await transporter.sendMail(adminEmailOptions);

        res.status(201).json({ message: 'Order created and emails sent successfully.', order: savedOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order and send emails.' });
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
