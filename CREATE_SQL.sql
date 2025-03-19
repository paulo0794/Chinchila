-- Create tables
CREATE TABLE product_category (
    id_category SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE product (
    id_product SERIAL PRIMARY KEY,
    id_category INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    CONSTRAINT fk_category
        FOREIGN KEY (id_category)
        REFERENCES product_category(id_category)
        ON DELETE CASCADE
);

-- Insert operations
-- Insert a new category
INSERT INTO product_category (description) VALUES ('Electronics');
INSERT INTO product_category (description) VALUES ('Clothing');
INSERT INTO product_category (description) VALUES ('Food');

-- Insert a new product
INSERT INTO product (id_category, description) VALUES (1, 'Smartphone');
INSERT INTO product (id_category, description) VALUES (1, 'Laptop');
INSERT INTO product (id_category, description) VALUES (2, 'T-Shirt');

-- Select operations
-- Select all categories
SELECT * FROM product_category;

-- Select all products
SELECT * FROM product;

-- Select products with category information
SELECT p.id_product, p.description as product_description, c.description as category_description
FROM product p
JOIN product_category c ON p.id_category = c.id_category;

-- Select products by category
SELECT p.* 
FROM product p
WHERE p.id_category = 1;

-- Update operations
-- Update category
UPDATE product_category
SET description = 'Updated Category Name'
WHERE id_category = 1;

-- Update product
UPDATE product
SET description = 'Updated Product Name', id_category = 2
WHERE id_product = 1;

-- Delete operations
-- Delete product
DELETE FROM product
WHERE id_product = 3;

-- Delete category (will cascade delete related products)
DELETE FROM product_category
WHERE id_category = 3;
