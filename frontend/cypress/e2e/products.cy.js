describe('Product Operations', () => {
  beforeEach(() => {
    // Stub API calls
    cy.stubApiCalls();
    
    // Visit the application before each test
    cy.visit('/');
    
    // Wait for the application to load
    cy.get('h1').should('contain', 'Product Management System');
    
    // Make sure we're on the products tab
    cy.get('#products-tab').click();
    
    // Create a test category if needed
    createTestCategoryIfNeeded();
  });

  // Helper function to create a test category if none exists
  function createTestCategoryIfNeeded() {
    // Switch to categories tab
    cy.get('#categories-tab').click();
    
    // Check if there are any categories
    cy.get('#category-table tbody tr').then(($rows) => {
      if ($rows.length === 0) {
        // Create a test category
        const categoryName = 'Test Category ' + Date.now();
        cy.get('#category-description').type(categoryName);
        cy.get('#category-submit-btn').click();
        
        // Wait for the category to be created
        cy.get('.alert-success').should('be.visible');
      }
    });
    
    // Switch back to products tab
    cy.get('#products-tab').click();
  }

  it('should display the products list', () => {
    // Verify that the products table is visible
    cy.get('#product-table').should('be.visible');
    cy.get('#product-table thead th').should('have.length', 4);
    cy.get('#product-table thead th').eq(0).should('contain', 'ID');
    cy.get('#product-table thead th').eq(1).should('contain', 'Description');
    cy.get('#product-table thead th').eq(2).should('contain', 'Category');
    cy.get('#product-table thead th').eq(3).should('contain', 'Actions');
  });

  it('should create a new product', () => {
    const productName = 'Test Product ' + Date.now();
    
    // Fill in the product form
    cy.get('#product-description').type(productName);
    
    // Select the first category in the dropdown
    cy.get('#product-category').select(1);
    
    // Submit the form
    cy.get('#product-submit-btn').click();
    
    // Verify success message
    cy.get('.alert-success').should('be.visible').and('contain', 'Product created successfully');
  });

  it('should edit an existing product', () => {
    // Click the edit button for the first product in the table
    cy.get('#product-table tbody tr')
      .first()
      .find('.edit-product-btn')
      .click();
    
    // Verify that the form is in edit mode
    cy.get('#product-form-title').should('contain', 'Edit Product');
    cy.get('#product-submit-btn').should('contain', 'Update');
    
    // Update the product name
    const updatedName = 'Updated Product ' + Date.now();
    cy.get('#product-description').clear().type(updatedName);
    
    // Submit the form
    cy.get('#product-submit-btn').click();
    
    // Verify success message
    cy.get('.alert-success').should('be.visible').and('contain', 'Product updated successfully');
  });

  it('should delete a product', () => {
    // Click the delete button for the first product in the table
    cy.get('#product-table tbody tr')
      .first()
      .find('.delete-product-btn')
      .click();
    
    // Confirm the deletion in the alert dialog
    cy.on('window:confirm', () => true);
    
    // Verify success message
    cy.get('.alert-success').should('be.visible').and('contain', 'Product deleted successfully');
  });

  it('should cancel product form when cancel button is clicked', () => {
    // Type something in the form
    cy.get('#product-description').type('Product to Cancel');
    cy.get('#product-category').select(1);
    
    // Click the cancel button
    cy.get('#product-form .cancel-btn').click();
    
    // Verify the form is reset
    cy.get('#product-description').should('have.value', '');
    cy.get('#product-form-title').should('contain', 'Add Product');
    cy.get('#product-submit-btn').should('contain', 'Create');
  });

  it('should require fields for product creation', () => {
    // Try to submit the form without filling in required fields
    cy.get('#product-submit-btn').click();
    
    // HTML5 validation should prevent submission
    // Check that the form is still visible and not reset
    cy.get('#product-form').should('be.visible');
    
    // Fill in the description but not the category
    cy.get('#product-description').type('Test Product');
    cy.get('#product-submit-btn').click();
    
    // Form should still be visible with the entered data
    cy.get('#product-description').should('have.value', 'Test Product');
    
    // Now fill in the category and submit
    cy.get('#product-category').select(1);
    cy.get('#product-submit-btn').click();
    
    // Verify that the form was submitted successfully
    cy.get('.alert-success').should('be.visible').and('contain', 'Product created successfully');
  });
});
