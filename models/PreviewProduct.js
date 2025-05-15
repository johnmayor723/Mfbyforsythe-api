// const mongoose = require('mongoose');

const previewProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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
}, { timestamps: true });

const PreviewProduct = mongoose.model('PreviewProduct', previewProductSchema);

module.exports = PreviewProduct;