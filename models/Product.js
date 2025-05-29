const mongoose = require('mongoose');

const buyingOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  colors: {
    type: [String],
    required: true
  },
  images: {
    type: [String],
    required: true
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  colors: {
    type: [String],
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  buyingOptions: {
    type: [buyingOptionSchema],
    default: [],
    validate: {
      validator: function(arr) {
        return Array.isArray(arr);
      },
      message: 'Buying options must be an array'
    }
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;