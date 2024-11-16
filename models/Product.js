const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  id: {
    type: String, // Use a string for the unique ID instead of MongoDB's default _id
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: false
  }
  
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  measurements: [measurementSchema] // Embedding the measurements schema as an array
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
