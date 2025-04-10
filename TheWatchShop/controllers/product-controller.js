// product-controller.js
const Product = require('../models/product-model');

const getAllProducts = (req, res) => {
    const products = Product.getAllProducts();
    res.json(products); // send JSON response
};

const getProductById = (req, res) => {
    const productId = req.params.id; //gets product id from url
    const product = Product.getProductById(productId); // calls model for a product by id

    //next we check if product exists to determine what to send back
    if (product) {
        res.json(product); // send JSON if product found
    } else {
        res.status(404).json({ error: 'Product not found' }); //notfound :(
    }
}

const searchProducts = (req, res) => {
    const query = req.query.q;
    console.log('Search query:', query); // 🪵 Log the query

    if (!query) {
        console.log('Missing search term');
        return res.status(400).json({ error: 'Missing search query' });
    }

    const results = Product.searchForProducts(query);
    console.log('Search results:', results); // 🪵 Log what came back
    res.json(results);
};

const getProductsByCategory = (req, res) => {
    const category = req.params.category;
    const results = Product.getProductsByCategory(category);

    if (!results || results.length === 0) {
        return res.status(404).json({ error: 'No products found for this category' });
    }

    res.json(results);
};





module.exports = { getAllProducts, getProductById, searchProducts, getProductsByCategory };
