// product-routes.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product-controller');

router.get('/', ProductController.getAllProducts);
router.get('/search',ProductController.searchProducts);
router.get('/category/:category', ProductController.getProductsByCategory);
router.get('/:id', ProductController.getProductById);

module.exports = router;
