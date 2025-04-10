// models/product-model.js
const db = require('../db/db'); //needed to access the databse
const { get } = require('../routes/product-routes');

const getAllProducts = () => {
  const stmt = db.prepare('SELECT * FROM products');
  const products = stmt.all(); // returns an array of product objects
  return products;
};

const getProductById = (id) => {
  const stmt = db.prepare('SELECT * FROM products WHERE product_id = ?');
  const product = stmt.get(id); // returns a single product object or undefined if not found
  return product;
}


const searchForProducts = (searchTerm) => {
  const stmt = db.prepare(`
    SELECT products.*, categories.name AS category_name
    FROM products
    JOIN categories ON products.category_id = categories.category_id
    WHERE products.name LIKE ?
       OR products.description LIKE ?
       OR categories.name LIKE ?
  `);

  const results = stmt.all(
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    `%${searchTerm}%`
  );

  return results;
};

const getProductsByCategory = (categoryName) => {
  const stmt = db.prepare(`
    SELECT products.*, categories.name AS category_name
    FROM products
    JOIN categories ON products.category_id = categories.category_id
    WHERE LOWER(categories.name) = LOWER(?)
  `);

  return stmt.all(categoryName);
};


module.exports = { getAllProducts, getProductById, searchForProducts, getProductsByCategory };
