const mongoose = require('mongoose');

const buyingOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  sizes: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
  },
  colors: {
    type: [String],
    default: [],
  },
  image: {
    type: [String],
  },
  category: {
    type: String,
    trim: true,
  },
  subcategory: {
    type: String,
    trim: true,
  }
}, { _id: false }); // Prevents automatic _id creation for each subdocument

const previewProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  size: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
  },
  colors: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
  },
  category: {
    type: String,
    trim: true,
  },
  subcategory: {
    type: String,
    trim: true,
  },
  buyingOptions: {
    type: [buyingOptionSchema],
    default: [],
  }
}, { timestamps: true });

const PreviewProduct = mongoose.model('PreviewProduct', previewProductSchema);

module.exports = PreviewProduct;