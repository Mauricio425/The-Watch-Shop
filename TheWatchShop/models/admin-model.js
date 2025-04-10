const db = require('../db/db');

const addProduct = ({ name, price, description, image_path, category_id }) => {
  const stmt = db.prepare(`
    INSERT INTO products (name, price, description, image_path, category_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(name, price, description, image_path, category_id);
  return { message: 'Product added', product_id: result.lastInsertRowid };
};

const updateProduct = (id, updatedFields) => {
  const fields = Object.keys(updatedFields)
    .map((key) => `${key} = ?`)
    .join(', ');
  const values = Object.values(updatedFields);
  values.push(id);

  const stmt = db.prepare(`UPDATE products SET ${fields} WHERE product_id = ?`);
  const result = stmt.run(...values);
  return { message: 'Product updated', updated: result.changes > 0 };
};

const bulkUploadProducts = (productList) => {
  const stmt = db.prepare(`
    INSERT INTO products (name, price, description, image_path, category_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((products) => {
    for (const p of products) {
      stmt.run(p.name, p.price, p.description, p.image_path, p.category_id);
    }
  });
  insertMany(productList);
  return { message: 'Bulk upload complete', count: productList.length };
};

module.exports = {
  addProduct,
  updateProduct,
  bulkUploadProducts
};
