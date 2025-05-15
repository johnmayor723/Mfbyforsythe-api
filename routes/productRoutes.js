const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createPreviewProduct,
  getPreviewProducts,
  publishPreviewProducts,
  getOneProductPreview,
  deleteProductPreview
} = require('../controllers/productController');

const router = express.Router();

// Final Product Routes
router.post('/', createProduct);               // Direct create to live (optional)
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Preview (Staging) Product Routes
router.post('/preview', createPreviewProduct);       // Create preview product
router.get('/preview', getPreviewProducts);          // List preview products
router.get('/preview/:id', getOneProductPreview);    // Get one preview product by id
router.delete('/preview/:id', deleteProductPreview); // Delete preview product by id
router.post('/publish', publishPreviewProducts);     // Publish all preview products

module.exports = router;