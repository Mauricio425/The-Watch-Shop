const Admin = require('../models/admin-model');

const addProduct = (req, res) => {
  try {
    const result = Admin.addProduct(req.body);
    res.json(result);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

const updateProduct = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const result = Admin.updateProduct(productId, req.body);
    res.json(result);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const bulkUploadProducts = (req, res) => {
  try {
    const result = Admin.bulkUploadProducts(req.body.products);
    res.json(result);
  } catch (err) {
    console.error('Bulk upload error:', err);
    res.status(500).json({ error: 'Bulk upload failed' });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  bulkUploadProducts
};
