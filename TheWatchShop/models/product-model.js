
const db = require('../db/db'); 
const { get } = require('../routes/product-routes');

const getAllProducts = () =>
  db.prepare(`SELECT * FROM products WHERE active = 1`).all();


const getAllProductsAdmin = () =>
  db.prepare(`SELECT product_id, name, description, category_id, image_path, price, color, sex, active
              FROM products
              ORDER BY product_id`).all();

const getProductById = (id) => {
  const stmt = db.prepare('SELECT * FROM products WHERE product_id = ?');
  const product = stmt.get(id); 
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

const createProduct = ({ name, description, category_id, price, image_path, color, sex }) => {
  const stmt = db.prepare(`
    INSERT INTO products
      (name, description, category_id, price, image_path, color, sex)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(name, description, category_id, price, image_path, color, sex);
};

const updateProduct = (id, { name, description, category_id, price, image_path, color, sex, active }) => {
  const stmt = db.prepare(`
    UPDATE products
    SET name = ?,
        description = ?,
        category_id = ?,
        price = ?,
        image_path = ?,
        color = ?,
        sex = ?,
        active = ?
    WHERE product_id = ?
  `);
  return stmt.run(name, description, category_id, price, image_path, color, sex, active, id);
};

/**
 *
 * @param {number} id
 * @returns {boolean}
 */
function deactivateProduct(id) {
  const result = db.prepare(`
    UPDATE products
    SET active = 0
    WHERE product_id = ?
  `).run(id);
  return result.changes > 0;
}

function activateProduct(id) {
  const result = db.prepare(`
    UPDATE products
    SET active = 1
    WHERE product_id = ?
  `).run(id);
  return result.changes > 0;
}



module.exports = { getAllProducts, getAllProductsAdmin, getProductById, searchForProducts, getProductsByCategory, createProduct, updateProduct,deactivateProduct, activateProduct };
