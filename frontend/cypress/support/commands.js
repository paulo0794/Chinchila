// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to stub API calls for testing without a backend
 */
Cypress.Commands.add('stubApiCalls', () => {
  // Stub for getAllCategories
  cy.intercept('GET', '**/api/categories', {
    statusCode: 200,
    body: [
      { id_category: 1, description: 'Electronics' },
      { id_category: 2, description: 'Clothing' },
      { id_category: 3, description: 'Books' }
    ]
  }).as('getCategories');

  // Stub for getAllProducts
  cy.intercept('GET', '**/api/products', {
    statusCode: 200,
    body: [
      { id_product: 1, product_description: 'Laptop', id_category: 1, category_description: 'Electronics' },
      { id_product: 2, product_description: 'T-shirt', id_category: 2, category_description: 'Clothing' },
      { id_product: 3, product_description: 'Novel', id_category: 3, category_description: 'Books' }
    ]
  }).as('getProducts');

  // Stub for createCategory
  cy.intercept('POST', '**/api/categories', (req) => {
    req.reply({
      statusCode: 201,
      body: {
        id_category: 4,
        description: req.body.description
      }
    });
  }).as('createCategory');

  // Stub for updateCategory
  cy.intercept('PUT', '**/api/categories/*', (req) => {
    const id = req.url.split('/').pop();
    req.reply({
      statusCode: 200,
      body: {
        id_category: parseInt(id),
        description: req.body.description
      }
    });
  }).as('updateCategory');

  // Stub for deleteCategory
  cy.intercept('DELETE', '**/api/categories/*', {
    statusCode: 200,
    body: { message: 'Category deleted successfully' }
  }).as('deleteCategory');

  // Stub for createProduct
  cy.intercept('POST', '**/api/products', (req) => {
    req.reply({
      statusCode: 201,
      body: {
        id_product: 4,
        product_description: req.body.description,
        id_category: req.body.id_category,
        category_description: req.body.id_category == 1 ? 'Electronics' : 
                             req.body.id_category == 2 ? 'Clothing' : 'Books'
      }
    });
  }).as('createProduct');

  // Stub for updateProduct
  cy.intercept('PUT', '**/api/products/*', (req) => {
    const id = req.url.split('/').pop();
    req.reply({
      statusCode: 200,
      body: {
        id_product: parseInt(id),
        product_description: req.body.description,
        id_category: req.body.id_category,
        category_description: req.body.id_category == 1 ? 'Electronics' : 
                             req.body.id_category == 2 ? 'Clothing' : 'Books'
      }
    });
  }).as('updateProduct');

  // Stub for deleteProduct
  cy.intercept('DELETE', '**/api/products/*', {
    statusCode: 200,
    body: { message: 'Product deleted successfully' }
  }).as('deleteProduct');

  // Stub for getCategoryById
  cy.intercept('GET', '**/api/categories/*', (req) => {
    const id = req.url.split('/').pop();
    req.reply({
      statusCode: 200,
      body: {
        id_category: parseInt(id),
        description: id == 1 ? 'Electronics' : 
                   id == 2 ? 'Clothing' : 'Books'
      }
    });
  }).as('getCategoryById');

  // Stub for getProductById
  cy.intercept('GET', '**/api/products/*', (req) => {
    const id = req.url.split('/').pop();
    if (req.url.includes('/category/')) {
      // Handle getProductsByCategory
      req.reply({
        statusCode: 200,
        body: [
          { id_product: 1, product_description: 'Laptop', id_category: id, category_description: 'Electronics' }
        ]
      });
    } else {
      // Handle getProductById
      req.reply({
        statusCode: 200,
        body: {
          id_product: parseInt(id),
          product_description: id == 1 ? 'Laptop' : 
                              id == 2 ? 'T-shirt' : 'Novel',
          id_category: id == 1 ? 1 : 
                      id == 2 ? 2 : 3,
          category_description: id == 1 ? 'Electronics' : 
                               id == 2 ? 'Clothing' : 'Books'
        }
      });
    }
  }).as('getProductById');
});
