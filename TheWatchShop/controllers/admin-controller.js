const fs      = require('fs');
const path    = require('path');
const Product = require('../models/product-model');
const Admin   = require('../models/admin-model');

exports.getAllProductsAdmin = (req, res) => {
  const rows = Admin.getAllProductsAdmin();
  res.json(rows);
};

exports.getProductByIdAdmin = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const p  = Product.getProductById(id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
};

exports.addProduct = (req, res) => {
  try {
    const result = Admin.addProduct(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

exports.updateProduct = (req, res) => {
  try {
    const id     = parseInt(req.params.id, 10);
    const result = Admin.updateProduct(id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deactivateProduct = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Admin.deactivateProduct(id)) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to deactivate' });
  }
};

exports.activateProduct = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Admin.activateProduct(id)) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ message: 'Product reactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to relist' });
  }
};

exports.bulkUploadProducts = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { path: tmpPath, originalname } = req.file;
  const ext = path.extname(originalname).toLowerCase();

  try {
    const raw = fs.readFileSync(tmpPath, 'utf-8');
    let items;

    if (ext === '.json') {
      items = JSON.parse(raw);
    } else if (ext === '.csv') {
      const [headerLine, ...lines] = raw.trim().split('\n');
      const headers = headerLine.split(',').map(h => h.trim());
      items = lines.map(line => {
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g,''));
        const obj = {};
        headers.forEach((h,i) => obj[h] = cols[i]);
        return obj;
      });
    } else if (ext === '.txt') {
      items = raw.trim().split('\n').map(line => {
        const [productId,name,description,category,imagePath,price,color,sex] = line.split(',').map(c => c.trim());
        return { productId, name, description, category, imagePath, price, color, sex };
      });
    } else {
      throw new Error('Unsupported file type');
    }

    const { count } = Admin.bulkUploadProducts(items);
    fs.unlinkSync(tmpPath);
    res.json({ message: 'Bulk upload successful', inserted: count });
  } catch (err) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
