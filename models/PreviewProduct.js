const mongoose = require('mongoose');

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
  }
}, { timestamps: true });

const PreviewProduct = mongoose.model('PreviewProduct', previewProductSchema);

module.exports = PreviewProduct;