# The-Watch-Shop
Repo for CSC 372, Web Development, final project

Current Status: Milestone 5 (Complete)

## Setup

Modules used:
express
multer
sqlite
sqlite3

### Database Setup
This is assuming you are starting a database from scratch.
You will need the following db file:
...db/watch-shop.db

In DB Browser run these .sql files in the order given:
(These files will be provided in setup folder)
create_tables.sql
insert_users.sql
insert_categories.sql
insert_products.sql

## Testing endpoints
### Run Server:
Static pages will be hosted on
http://localhost:3000/index.html

### Admin Pt 1
This product will be used for search in products section

POST http://localhost:3000/api/admin/products
Body -> JSON

{
  "name": "Seiko Presage Cocktail Time",
  "price": 425.00,
  "description": "Elegant automatic watch with a sunburst dial",
  "image_path": "img/seiko_presage.jpg",
  "category_id": 1
}

### Product
Here we will:

get product list

GET http://localhost:3000/api/products

get product by id

GET http://localhost:3000/api/products/2

get product by search term or category
When searching, the name, description, and category will all be checked,
this example demonstrates 2 different items, one with luxury in the
description and one as the category

GET http://localhost:3000/api/products/search?q=Luxury

### Cart
Adding to cart

POST http://localhost:3000/api/cart
Body -> JSON
{
  "product_id": 1,
  "quantity": 2
}

View Cart
GET http://localhost:3000/api/cart

Remove item from cart
DELETE http://localhost:3000/api/cart/1

Checkout Preview (will most likely be deleted)
GET http://localhost:3000/api/cart/checkout-preview

Final Checkout (includes address)
POST http://localhost:3000/api/cart/checkout
Body-> JASON
{
  "address": "123 Watch St, Timeville, USA"
}

### Admin
Edit product
PUT http://localhost:3000/api/admin/products/1
Body-JSON
{
  "price": 0.99,
  "description": "No longer luxury :("
}

Bulk Upload
POST http://localhost:3000/api/admin/products/bulk
Body -> JSON
{
  "products": [
    {
      "name": "Fossil Grant",
      "price": 179.99,
      "description": "Classic leather chronograph",
      "image_path": "img/fossil.jpg",
      "category_id": 2
    },
    {
      "name": "Samsung Galaxy Watch 5",
      "price": 249.99,
      "description": "Smartwatch with fitness tracking and sleep monitoring",
      "image_path": "img/galaxy_watch5.jpg",
      "category_id": 4
    }
  ]
}





