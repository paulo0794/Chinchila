const { request } = require('./setup');

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Root Route', () => {
  it('should return API information', async () => {
    // Make the request
    const response = await request.get('/');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Product CRUD API');
    expect(response.body).toHaveProperty('endpoints');
    expect(response.body.endpoints).toHaveProperty('categories', '/api/categories');
    expect(response.body.endpoints).toHaveProperty('products', '/api/products');
    expect(response.body).toHaveProperty('documentation', '/api-docs');
  });
});
