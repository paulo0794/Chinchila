const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.id_product, p.description as product_description, 
             p.id_category, c.description as category_description
      FROM product p
      JOIN product_category c ON p.id_category = c.id_category
      ORDER BY p.id_product
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT p.id_product, p.description as product_description, 
             p.id_category, c.description as category_description
      FROM product p
      JOIN product_category c ON p.id_category = c.id_category
      WHERE p.id_product = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get products by category ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await db.query(`
      SELECT p.id_product, p.description as product_description, 
             p.id_category, c.description as category_description
      FROM product p
      JOIN product_category c ON p.id_category = c.id_category
      WHERE p.id_category = $1
      ORDER BY p.id_product
    `, [categoryId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { description, id_category } = req.body;
    
    if (!description || !id_category) {
      return res.status(400).json({ error: 'Description and category ID are required' });
    }
    
    // Check if category exists
    const categoryCheck = await db.query('SELECT * FROM product_category WHERE id_category = $1', [id_category]);
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Category does not exist' });
    }
    
    const result = await db.query(
      'INSERT INTO product (description, id_category) VALUES ($1, $2) RETURNING *',
      [description, id_category]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, id_category } = req.body;
    
    if (!description || !id_category) {
      return res.status(400).json({ error: 'Description and category ID are required' });
    }
    
    // Check if category exists
    const categoryCheck = await db.query('SELECT * FROM product_category WHERE id_category = $1', [id_category]);
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Category does not exist' });
    }
    
    const result = await db.query(
      'UPDATE product SET description = $1, id_category = $2 WHERE id_product = $3 RETURNING *',
      [description, id_category, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM product WHERE id_product = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
