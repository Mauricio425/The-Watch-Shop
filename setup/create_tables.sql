CREATE TABLE "users" (
  "user_id" INTEGER,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "DOB" DATE,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "user_type" TEXT NOT NULL CHECK ("user_type" IN ('admin','shopper')),
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY("user_id" AUTOINCREMENT)
);

CREATE TABLE "categories" (
  "category_id" INTEGER,
  "name" TEXT NOT NULL,
  PRIMARY KEY("category_id" AUTOINCREMENT)
);

CREATE TABLE "products" (
"product_id" INTEGER,
"name" TEXT NOT NULL,
"price" DECIMAL NOT NULL,
"description" TEXT,
"image_path" VARCHAR,
"category_id" INTEGER,
"color" TEXT,
"sex" TEXT NOT NULL CHECK ("sex" IN ('Mens','Womens','Unisex')),
"active" INTEGER NOT NULL DEFAULT 1,
PRIMARY KEY("product_id" AUTOINCREMENT),
FOREIGN KEY("category_id") REFERENCES "categories"("category_id")
);

CREATE TABLE "cart" (
  "cart_id" INTEGER,
  "user_id" INTEGER NOT NULL UNIQUE,
  "status" TEXT NOT NULL CHECK ("status" IN ('new','abandoned','purchased')),
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY("cart_id" AUTOINCREMENT),
  FOREIGN KEY("user_id") REFERENCES "users"("user_id")
);

CREATE TABLE "cart_items" (
  "cart_item_id" INTEGER,
  "cart_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  PRIMARY KEY("cart_item_id" AUTOINCREMENT),
  FOREIGN KEY("cart_id") REFERENCES "cart"("cart_id"),
  FOREIGN KEY("product_id") REFERENCES "products"("product_id")
);

CREATE TABLE "orders" (
  "order_id" INTEGER,
  "user_id" INTEGER NOT NULL,
  "address" TEXT NOT NULL,
  "date_ordered" DATE DEFAULT (DATE('now')),
  PRIMARY KEY("order_id" AUTOINCREMENT),
  FOREIGN KEY("user_id") REFERENCES "users"("user_id")
);

CREATE TABLE "order_items" (
  "order_item_id" INTEGER,
  "order_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  PRIMARY KEY("order_item_id" AUTOINCREMENT),
  FOREIGN KEY("order_id") REFERENCES "orders"("order_id"),
  FOREIGN KEY("product_id") REFERENCES "products"("product_id")
);

CREATE TABLE "tags" (
  "tag_id" INTEGER,
  "name" VARCHAR NOT NULL,
  PRIMARY KEY("tag_id" AUTOINCREMENT)
);

CREATE TABLE "product_tags" (
  "product_id" INTEGER NOT NULL,
  "tag_id" INTEGER NOT NULL,
  PRIMARY KEY("product_id","tag_id"),
  FOREIGN KEY("product_id") REFERENCES "products"("product_id"),
  FOREIGN KEY("tag_id") REFERENCES "tags"("tag_id")
);
