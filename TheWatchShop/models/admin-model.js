const db = require('../db/db');

exports.getAllProductsAdmin = () => {
  return db.prepare(`
    SELECT
      product_id,
      name,
      description,
      category_id,
      image_path,
      price,
      color,
      sex,
      active
    FROM products
    ORDER BY product_id
  `).all();
};

exports.addProduct = ({ name, price, description, image_path, category_id, color, sex }) => {
  const stmt = db.prepare(`
    INSERT INTO products
      (name, price, description, image_path, category_id, color, sex, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);
  const r = stmt.run(name, price, description, image_path, category_id, color, sex);
  return { message: 'Product added', product_id: r.lastInsertRowid };
};

exports.updateProduct = (id, fields) => {
  const keys   = Object.keys(fields);
  const sets   = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  values.push(id);

  const r = db.prepare(`UPDATE products SET ${sets} WHERE product_id = ?`)
              .run(...values);
  return { message: 'Product updated', changes: r.changes };
};

exports.deactivateProduct = (id) => {
  const r = db.prepare(`UPDATE products SET active = 0 WHERE product_id = ?`).run(id);
  return r.changes > 0;
};

exports.activateProduct = (id) => {
  const r = db.prepare(`UPDATE products SET active = 1 WHERE product_id = ?`).run(id);
  return r.changes > 0;
};

exports.bulkUploadProducts = (items) => {
  const getCat = db.prepare(`SELECT category_id FROM categories WHERE name = ?`);
  const ins    = db.prepare(`
    INSERT INTO products
      (name, price, description, image_path, category_id, color, sex, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const tx = db.transaction(list => {
    for (const p of list) {
      let catId = p.category_id || null;
      if (!catId && p.category) {
        const row = getCat.get(p.category);
        if (!row) throw new Error(`Unknown category "${p.category}"`);
        catId = row.category_id;
      }

      ins.run(
        p.name,
        parseFloat(p.price),
        p.description,
        p.image_path || p.imagePath,
        catId,
        p.color || null,
        p.sex   || null
      );
    }
  });

  tx(items);
  return { message: 'Bulk upload complete', count: items.length };
};
