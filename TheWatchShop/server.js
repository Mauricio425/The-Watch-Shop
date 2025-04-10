const express = require('express');
const app = express();

const PORT = 3000;

const productRoutes = require('./routes/product-routes');
const cartRoutes = require('./routes/cart-routes');
const adminRoutes = require('./routes/admin-routes');

app.use(express.static('public'));
app.use(express.json());

// Register the route under /api/products
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin/products', adminRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
