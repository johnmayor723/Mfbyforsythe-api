const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, imageUrl } = req.body;

    // Parse measurements if it's a JSON string
    let measurements = [];
    if (req.body.measurements) {
      measurements = typeof req.body.measurements === 'string'
        ? JSON.parse(req.body.measurements)
        : req.body.measurements;
    }

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      stock,
      imageUrl,
      measurements // Parsed measurements
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, imageUrl } = req.body;

    // Parse measurements if it's a JSON string
    let measurements = [];
    if (req.body.measurements) {
      measurements = typeof req.body.measurements === 'string'
        ? JSON.parse(req.body.measurements)
        : req.body.measurements;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        price,
        stock,
        imageUrl,
        measurements // Parsed measurements
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
