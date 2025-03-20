const { request } = require('./setup');
const db = require('../src/db');

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Categories API', () => {
  // GET /api/categories
  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      // Mock the database response
      const mockCategories = [
        { id_category: 1, description: 'Electronics' },
        { id_category: 2, description: 'Clothing' }
      ];
      
      db.query.mockResolvedValueOnce({ rows: mockCategories });
      
      // Make the request
      const response = await request.get('/api/categories');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM product_category ORDER BY id_category');
    });
    
    it('should handle database errors', async () => {
      // Mock a database error
      db.query.mockRejectedValueOnce(new Error('Database error'));
      
      // Make the request
      const response = await request.get('/api/categories');
      
      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');
    });
  });
  
  // GET /api/categories/:id
  describe('GET /api/categories/:id', () => {
    it('should return a category by ID', async () => {
      // Mock the database response
      const mockCategory = { id_category: 1, description: 'Electronics' };
      db.query.mockResolvedValueOnce({ rows: [mockCategory] });
      
      // Make the request
      const response = await request.get('/api/categories/1');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategory);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM product_category WHERE id_category = $1', ['1']);
    });
    
    it('should return 404 if category not found', async () => {
      // Mock an empty response
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Make the request
      const response = await request.get('/api/categories/999');
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });
  
  // POST /api/categories
  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      // Mock the database response
      const newCategory = { id_category: 3, description: 'Books' };
      db.query.mockResolvedValueOnce({ rows: [newCategory] });
      
      // Make the request
      const response = await request
        .post('/api/categories')
        .send({ description: 'Books' });
      
      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newCategory);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO product_category (description) VALUES ($1) RETURNING *',
        ['Books']
      );
    });
    
    it('should return 400 if description is missing', async () => {
      // Make the request without a description
      const response = await request
        .post('/api/categories')
        .send({});
      
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Description is required');
      expect(db.query).not.toHaveBeenCalled();
    });
  });
  
  // PUT /api/categories/:id
  describe('PUT /api/categories/:id', () => {
    it('should update a category', async () => {
      // Mock the database response
      const updatedCategory = { id_category: 1, description: 'Updated Electronics' };
      db.query.mockResolvedValueOnce({ rows: [updatedCategory] });
      
      // Make the request
      const response = await request
        .put('/api/categories/1')
        .send({ description: 'Updated Electronics' });
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCategory);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE product_category SET description = $1 WHERE id_category = $2 RETURNING *',
        ['Updated Electronics', '1']
      );
    });
    
    it('should return 400 if description is missing', async () => {
      // Make the request without a description
      const response = await request
        .put('/api/categories/1')
        .send({});
      
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Description is required');
      expect(db.query).not.toHaveBeenCalled();
    });
    
    it('should return 404 if category not found', async () => {
      // Mock an empty response
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Make the request
      const response = await request
        .put('/api/categories/999')
        .send({ description: 'Updated Category' });
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });
  
  // DELETE /api/categories/:id
  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      // Mock the database response
      const deletedCategory = { id_category: 1, description: 'Electronics' };
      db.query.mockResolvedValueOnce({ rows: [deletedCategory] });
      
      // Make the request
      const response = await request.delete('/api/categories/1');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Category deleted successfully');
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM product_category WHERE id_category = $1 RETURNING *',
        ['1']
      );
    });
    
    it('should return 404 if category not found', async () => {
      // Mock an empty response
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Make the request
      const response = await request.delete('/api/categories/999');
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });
});
