const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart-controller');

router.post('/', CartController.addToCart);
router.get('/checkout-preview', CartController.getCheckoutPreview);
router.get('/', CartController.getCart);
router.delete('/:product_id', CartController.removeFromCart);
router.post('/checkout', CartController.checkoutFinal);




module.exports = router;
