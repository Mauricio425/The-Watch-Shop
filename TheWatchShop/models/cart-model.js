const db = require('../db/db');

const getOrCreateCartForUser = (userId) => {
    let cart = db.prepare("SELECT * FROM cart WHERE user_id = ? AND status = 'new'").get(userId);

    if (!cart) {
        const insert = db.prepare("INSERT INTO cart (user_id, status) VALUES (?, 'new')");
        const result = insert.run(userId);
        cart = { cart_id: result.lastInsertRowid, user_id: userId, status: 'new' };
    }

    return cart;
};

const addToCart = (userId, productId, quantity) => {
    const cart = getOrCreateCartForUser(userId);

    const existingItem = db.prepare(`
    SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?
  `).get(cart.cart_id, productId);

    if (existingItem) {
        // Update quantity
        db.prepare(`
      UPDATE cart_items SET quantity = quantity + ?
      WHERE cart_id = ? AND product_id = ?
    `).run(quantity, cart.cart_id, productId);
    } else {
        // Insert new cart item
        db.prepare(`
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES (?, ?, ?)
    `).run(cart.cart_id, productId, quantity);
    }

    return { message: 'Product added to cart', cart_id: cart.cart_id };
};

const getCartItems = (userId) => {
    const cart = db.prepare("SELECT * FROM cart WHERE user_id = ? AND status = 'new'").get(userId);

    if (!cart) return [];

    const stmt = db.prepare(`
        SELECT 
          products.product_id,
          products.name,
          products.price,
          products.image_path,
          cart_items.quantity,
          (products.price * cart_items.quantity) AS total
        FROM cart_items
        JOIN products ON cart_items.product_id = products.product_id
        WHERE cart_items.cart_id = ?
      `);

    return stmt.all(cart.cart_id);

};

const removeFromCart = (userId, productId) => {
    const cart = db.prepare("SELECT * FROM cart WHERE user_id = ? AND status = 'new'").get(userId);
    if (!cart) throw new Error('Cart not found');

    const stmt = db.prepare(`
      DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?
    `);

    const result = stmt.run(cart.cart_id, productId);
    return { deleted: result.changes > 0 };
};

const checkoutCartFinal = (userId, address) => {
  const cart = db.prepare("SELECT * FROM cart WHERE user_id = ? AND status = 'new'").get(userId);
  if (!cart) throw new Error("No active cart");

  const items = db.prepare("SELECT * FROM cart_items WHERE cart_id = ?").all(cart.cart_id);
  if (items.length === 0) throw new Error("Cart is empty");

  // 1. Insert order
  const insertOrder = db.prepare(`
    INSERT INTO orders (user_id, address)
    VALUES (?, ?)
  `);
  const orderResult = insertOrder.run(userId, address);
  const orderId = orderResult.lastInsertRowid;

  // 2. Insert order items
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity)
    VALUES (?, ?, ?)
  `);

  const insertAll = db.transaction((items) => {
    for (const item of items) {
      insertItem.run(orderId, item.product_id, item.quantity);
    }
  });

  insertAll(items);

  // 3. Update cart status
  db.prepare("UPDATE cart SET status = 'purchased' WHERE cart_id = ?").run(cart.cart_id);

  return { message: 'Order placed!', order_id: orderId };
};





module.exports = { addToCart, getCartItems, getOrCreateCartForUser, removeFromCart, checkoutCartFinal };
