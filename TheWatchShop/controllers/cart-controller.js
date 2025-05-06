const Cart = require('../models/cart-model');

const addToCart = (req, res) => {
    try {
      console.log("Received body:", req.body);
  
      const { product_id, quantity } = req.body;
      if (!product_id || !quantity) {
          return res.status(400).json({ error: 'Missing product_id or quantity' });
      }
  
      const result = Cart.addToCart(1, product_id, quantity);
      res.json(result);
    } catch (err) {
      console.error("Add to cart error:", err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  };
  
  const getCart = (req, res) => {
    try {
      const items = Cart.getCartItems(1); 
      console.log('Cart items:', items);
      res.json(items);
    } catch (err) {
      console.error("Cart fetch error:", err); 
      res.status(500).json({ error: 'Failed to fetch cart', details: err.message });
    }
  };

  const removeFromCart = (req, res) => {
    try {
      const productId = parseInt(req.params.product_id);
      const result = Cart.removeFromCart(1, productId); 
      if (result.deleted) {
        res.json({ message: 'Item removed from cart' });
      } else {
        res.status(404).json({ error: 'Item not found in cart' });
      }
    } catch (err) {
      console.error('Remove from cart error:', err);
      res.status(500).json({ error: 'Failed to remove item', details: err.message });
    }
  };

  const getCheckoutPreview = (req, res) => {
    try {
      const items = Cart.getCartItems(1); 
      res.json({
        user_id: 1,
        items: items
      });
    } catch (err) {
      console.error('Checkout preview error:', err);
      res.status(500).json({ error: 'Failed to load checkout preview' });
    }
  };

  const checkoutFinal = (req, res) => {
    try {
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ error: 'Missing address' });
      }
  
      const result = Cart.checkoutCartFinal(1, address); 
      res.json(result);
    } catch (err) {
      console.error('Checkout error:', err);
      res.status(500).json({ error: 'Checkout failed', details: err.message });
    }
  };
  
  
  
  


module.exports = {addToCart, getCart, removeFromCart, getCheckoutPreview, checkoutFinal};
