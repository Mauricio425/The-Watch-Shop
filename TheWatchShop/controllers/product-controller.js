const Product = require('../models/product-model');


const getAllProducts = (req, res) => {
  const products = Product.getAllProducts(); 
  res.json(products);
};


const getAllProductsAdmin = (req, res) => {
  const products = Product.getAllProductsAdmin(); 
  res.json(products);
};

const getProductById = (req, res) => {
  const productId = Number(req.params.id);
  const product = Product.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
};

const searchProducts = (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search query' });
  const results = Product.searchForProducts(query);
  res.json(results);
};

const getProductsByCategory = (req, res) => {
  const category = req.params.category;
  const results = Product.getProductsByCategory(category);
  if (!results.length) {
    return res.status(404).json({ error: 'No products found for this category' });
  }
  res.json(results);
};

const createProduct = (req, res) => {
  const { name, description, category_id, price, image_path, color, sex } = req.body;
  const result = Product.createProduct({ name, description, category_id, price, image_path, color, sex });
  res.status(201).json({ product_id: result.lastInsertRowid });
};

const updateProduct = (req, res) => {
  const id = Number(req.params.id);
  const { name, description, category_id, price, image_path, color, sex, active } = req.body;
  const success = Product.updateProduct(id, { name, description, category_id, price, image_path, color, sex, active });
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product updated' });
};

const deactivateProduct = (req, res) => {
  const id = Number(req.params.id);
  const success = Product.deactivateProduct(id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deactivated' });
};

const activateProduct = (req, res) => {
  const id = Number(req.params.id);
  const success = Product.activateProduct(id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product reactivated' });
};

module.exports = {
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  searchProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deactivateProduct,
  activateProduct
};
