const Order = require('../models/order-model');

const getOrders = (req, res) => {
  try {
    const orders = Order.getOrdersForUser(1); // hardcoded user
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

module.exports = { getOrders };
