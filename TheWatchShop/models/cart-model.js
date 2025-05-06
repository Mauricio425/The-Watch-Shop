const db = require('../db/db');


const getOrCreateCartForUser = (userId) => {
  let cart = db.prepare(
    "SELECT * FROM cart WHERE user_id = ? AND status = 'new'"
  ).get(userId);

  if (cart) {
    return cart;
  }

  const existing = db.prepare(
    "SELECT * FROM cart WHERE user_id = ?"
  ).get(userId);

  if (existing) {

    db.prepare(
      "UPDATE cart SET status = 'new', created_at = CURRENT_TIMESTAMP WHERE cart_id = ?"
    ).run(existing.cart_id);
    return { ...existing, status: 'new' };
  }


  const insert = db.prepare(
    "INSERT INTO cart (user_id, status) VALUES (?, 'new')"
  );
  const result = insert.run(userId);
  return { cart_id: result.lastInsertRowid, user_id: userId, status: 'new' };
};


const addToCart = (userId, productId, quantity) => {
  const cart = getOrCreateCartForUser(userId);
  const existingItem = db.prepare(
    "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?"
  ).get(cart.cart_id, productId);

  if (existingItem) {
    db.prepare(
      "UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?"
    ).run(quantity, cart.cart_id, productId);
  } else {
    db.prepare(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)"
    ).run(cart.cart_id, productId, quantity);
  }

  return { message: 'Product added to cart', cart_id: cart.cart_id };
};

const getCartItems = (userId) => {
  const cart = db.prepare(
    "SELECT * FROM cart WHERE user_id = ? AND status = 'new'"
  ).get(userId);
  if (!cart) return [];

  return db.prepare(
    `SELECT
       p.product_id,
       p.name,
       p.price,
       p.image_path,
       ci.quantity,
       (p.price * ci.quantity) AS total
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.product_id
     WHERE ci.cart_id = ?`
  ).all(cart.cart_id);
};


const removeFromCart = (userId, productId) => {
  const cart = db.prepare(
    "SELECT * FROM cart WHERE user_id = ? AND status = 'new'"
  ).get(userId);
  if (!cart) throw new Error('Cart not found');

  const existingItem = db.prepare(
    "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?"
  ).get(cart.cart_id, productId);
  if (!existingItem) {
    return { deleted: false };
  }

  if (existingItem.quantity > 1) {

    db.prepare(
      "UPDATE cart_items SET quantity = quantity - 1 WHERE cart_id = ? AND product_id = ?"
    ).run(cart.cart_id, productId);
    return { message: 'Quantity decremented', product_id: productId, quantity: existingItem.quantity - 1 };
  } else {
    // Quantity is 1, remove the item
    const result = db.prepare(
      "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?"
    ).run(cart.cart_id, productId);
    return { deleted: result.changes > 0 };
  }
};

const checkoutCartFinal = (userId, address) => {
  const cart = db.prepare(
    "SELECT * FROM cart WHERE user_id = ? AND status = 'new'"
  ).get(userId);
  if (!cart) throw new Error("No active cart");

  const items = db.prepare(
    "SELECT * FROM cart_items WHERE cart_id = ?"
  ).all(cart.cart_id);
  if (items.length === 0) throw new Error("Cart is empty");

  const insertOrder = db.prepare(
    "INSERT INTO orders (user_id, address) VALUES (?, ?)"
  );
  const orderResult = insertOrder.run(userId, address);
  const orderId = orderResult.lastInsertRowid;

  const insertItem = db.prepare(
    "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)"
  );
  const insertAll = db.transaction(list => {
    list.forEach(item => insertItem.run(orderId, item.product_id, item.quantity));
  });
  insertAll(items);


  db.prepare(
    "UPDATE cart SET status = 'purchased' WHERE cart_id = ?"
  ).run(cart.cart_id);


  db.prepare(
    "DELETE FROM cart_items WHERE cart_id = ?"
  ).run(cart.cart_id);

  return { message: 'Order placed!', order_id: orderId };
};

module.exports = {
  getOrCreateCartForUser,
  addToCart,
  getCartItems,
  removeFromCart,
  checkoutCartFinal
};
