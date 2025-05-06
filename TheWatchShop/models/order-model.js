const db = require('../db/db');

const getOrdersForUser = (userId) => {

  const orders = db.prepare(`
    SELECT order_id, date_ordered, address
    FROM orders
    WHERE user_id = ?
    ORDER BY date_ordered DESC
  `).all(userId);


  const itemStmt = db.prepare(`
    SELECT p.product_id, p.name, p.price, oi.quantity, (p.price * oi.quantity) AS total
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
  `);

  return orders.map(order => ({
    order_id: order.order_id,
    date_ordered: order.date_ordered,
    address: order.address,
    items: itemStmt.all(order.order_id),
    subtotal: itemStmt.all(order.order_id).reduce((sum, i) => sum + i.total, 0)
  }));
};

module.exports = { getOrdersForUser };
