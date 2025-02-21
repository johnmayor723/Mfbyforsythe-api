const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  size: {
    type: [String], // Changed from Number to String (since fashion sizes vary)
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  colors: {
    type: [String], // Array of color options
    required: true
  },
  images: {
    type: [String], // Array of image URLs
    required: true
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
