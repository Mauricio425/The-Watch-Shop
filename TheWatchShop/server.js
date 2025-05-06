const express = require('express');
const app     = express();
const PORT    = 3000;

const productRoutes = require('./routes/product-routes');
const cartRoutes    = require('./routes/cart-routes');
const adminRoutes   = require('./routes/admin-routes');
const orderRoutes   = require('./routes/order-routes');

app.use(express.static('public'));
app.use(express.json());

app.use('/api/products',       productRoutes);
app.use('/api/cart',           cartRoutes);
app.use('/api/orders',         orderRoutes);
app.use('/api/admin/products', adminRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
