const { request } = require('./setup');
const db = require('../src/db');

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Products API', () => {
  // GET /api/products
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Mock the database response
      const mockProducts = [
        { 
          id_product: 1, 
          product_description: 'Smartphone', 
          id_category: 1, 
          category_description: 'Electronics' 
        },
        { 
          id_product: 2, 
          product_description: 'T-Shirt', 
          id_category: 2, 
          category_description: 'Clothing' 
        }
      ];
      
      db.query.mockResolvedValueOnce({ rows: mockProducts });
      
      // Make the request
      const response = await request.get('/api/products');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT p.id_product, p.description as product_description'));
    });
    
    it('should handle database errors', async () => {
      // Mock a database error
      db.query.mockRejectedValueOnce(new Error('Database error'));
      
      // Make the request
      const response = await request.get('/api/products');
      
      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');
    });
  });
  
  // GET /api/products/:id
  describe('GET /api/products/:id', () => {
    it('should return a product by ID', async () => {
      // Mock the database response
      const mockProduct = { 
        id_product: 1, 
        product_description: 'Smartphone', 
        id_category: 1, 
        category_description: 'Electronics' 
      };
      db.query.mockResolvedValueOnce({ rows: [mockProduct] });
      
      // Make the request
      const response = await request.get('/api/products/1');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProduct);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT p.id_product, p.description as product_description'),
        ['1']
      );
    });
    
    it('should return 404 if product not found', async () => {
      // Mock an empty response
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Make the request
      const response = await request.get('/api/products/999');
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });
  
  // GET /api/products/category/:categoryId
  describe('GET /api/products/category/:categoryId', () => {
    it('should return products by category ID', async () => {
      // Mock the database response
      const mockProducts = [
        { 
          id_product: 1, 
          product_description: 'Smartphone', 
          id_category: 1, 
          category_description: 'Electronics' 
        },
        { 
          id_product: 3, 
          product_description: 'Laptop', 
          id_category: 1, 
          category_description: 'Electronics' 
        }
      ];
      db.query.mockResolvedValueOnce({ rows: mockProducts });
      
      // Make the request
      const response = await request.get('/api/products/category/1');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE p.id_category = $1'),
        ['1']
      );
    });
  });
  
  // POST /api/products
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      // Mock the category check
      db.query.mockResolvedValueOnce({ rows: [{ id_category: 1 }] });
      
      // Mock the database response for product creation
      const newProduct = { id_product: 3, description: 'Tablet', id_category: 1 };
      db.query.mockResolvedValueOnce({ rows: [newProduct] });
      
      // Make the request
      const response = await request
        .post('/api/products')
        .send({ description: 'Tablet', id_category: 1 });
      
      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newProduct);
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM product_category WHERE id_category = $1',
        [1]
      );
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO product (description, id_category) VALUES ($1, $2) RETURNING *',
        ['Tablet', 1]
      );
    });
    
    it('should return 400 if description or category ID is missing', async () => {
      // Make the request without required fields
      const response = await request
        .post('/api/products')
        .send({ description: 'Tablet' }); // Missing id_category
      
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Description and category ID are required');
      expect(db.query).not.toHaveBeenCalled();
    });
    
    it('should return 400 if category does not exist', async () => {
      // Mock an empty response for category check
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Make the request
      const response = await request
        .post('/api/products')
        .send({ description: 'Tablet', id_category: 999 });
      
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Category does not exist');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
  
  // PUT /api/products/:id
  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      // Mock the category check
      db.query.mockResolvedValueOnce({ rows: [{ id_category: 1 }] });
      
      // Mock the database response for product update
      const updatedProduct = { id_product: 1, description: 'Updated Smartphone', id_category: 1 };
      db.query.mockResolvedValueOnce({ rows: [updatedProduct] });
      
      // Make the request
      const response = await request
        .put('/api/products/1')
        .send({ description: 'Updated Smartphone', id_category: 1 });
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProduct);
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        'UPDATE product SET description = $1, id_category = $2 WHERE id_product = $3 RETURNING *',
        ['Updated Smartphone', 1, '1']
      );
    });
    
    it('should return 400 if description or category ID is missing', async () => {
      // Make the request without required fields
      const response = await request
        .put('/api/products/1')
        .send({ description: 'Updated Smartphone' }); // Missing id_category
      
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Description and category ID are required');
      expect(db.query).not.toHaveBeenCalled();
    });
    
    it('should return 404 if product not found', async () => {
      // Mock the category check
      db.query.mockResolvedValueOnce({ rows: [{ id_category: 1 }] });
      
      // Mock an empty response for product update
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Make the request
      const response = await request
        .put('/api/products/999')
        .send({ description: 'Updated Product', id_category: 1 });
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });
  
  // DELETE /api/products/:id
  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      // Mock the database response
      const deletedProduct = { id_product: 1, description: 'Smartphone', id_category: 1 };
      db.query.mockResolvedValueOnce({ rows: [deletedProduct] });
      
      // Make the request
      const response = await request.delete('/api/products/1');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Product deleted successfully');
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM product WHERE id_product = $1 RETURNING *',
        ['1']
      );
    });
    
    it('should return 404 if product not found', async () => {
      // Mock an empty response
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Make the request
      const response = await request.delete('/api/products/999');
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });
});
