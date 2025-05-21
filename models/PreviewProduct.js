const mongoose = require('mongoose');

const previewProductSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  description: {
    type: String,
    
  },
  size: {
    type: [String],
    
  },
  price: {
    type: Number
    
  },
  colors: {
    type: [String]
    
  },
 images: {
    type: [String],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
    
  }
}, { timestamps: true });


const PreviewProduct = mongoose.model('PreviewProduct', previewProductSchema);

module.exports = PreviewProduct;