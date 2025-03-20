describe('Category Operations', () => {
  beforeEach(() => {
    // Stub API calls
    cy.stubApiCalls();
    
    // Visit the application before each test
    cy.visit('/');
    
    // Wait for the application to load
    cy.get('h1').should('contain', 'Product Management System');
    
    // Make sure we're on the categories tab
    cy.get('#categories-tab').click();
  });

  it('should display the categories list', () => {
    // Verify that the categories table is visible
    cy.get('#category-table').should('be.visible');
    cy.get('#category-table thead th').should('have.length', 3);
    cy.get('#category-table thead th').eq(0).should('contain', 'ID');
    cy.get('#category-table thead th').eq(1).should('contain', 'Description');
    cy.get('#category-table thead th').eq(2).should('contain', 'Actions');
  });

  it('should create a new category', () => {
    const categoryName = 'Test Category ' + Date.now();
    
    // Fill in the category form
    cy.get('#category-description').type(categoryName);
    
    // Submit the form
    cy.get('#category-submit-btn').click();
    
    // Verify success message
    cy.get('.alert-success').should('be.visible').and('contain', 'Category created successfully');
  });

  it('should edit an existing category', () => {
    // Click the edit button for the first category in the table
    cy.get('#category-table tbody tr')
      .first()
      .find('.edit-category-btn')
      .click();
    
    // Verify that the form is in edit mode
    cy.get('#category-form-title').should('contain', 'Edit Category');
    cy.get('#category-submit-btn').should('contain', 'Update');
    
    // Update the category name
    const updatedName = 'Updated Category ' + Date.now();
    cy.get('#category-description').clear().type(updatedName);
    
    // Submit the form
    cy.get('#category-submit-btn').click();
    
    // Verify success message
    cy.get('.alert-success').should('be.visible').and('contain', 'Category updated successfully');
  });

  it('should delete a category', () => {
    // Click the delete button for the first category in the table
    cy.get('#category-table tbody tr')
      .first()
      .find('.delete-category-btn')
      .click();
    
    // Confirm the deletion in the alert dialog
    cy.on('window:confirm', () => true);
    
    // Verify success message
    cy.get('.alert-success').should('be.visible').and('contain', 'Category deleted successfully');
  });

  it('should cancel category form when cancel button is clicked', () => {
    // Type something in the form
    cy.get('#category-description').type('Category to Cancel');
    
    // Click the cancel button
    cy.get('#category-form .cancel-btn').click();
    
    // Verify the form is reset
    cy.get('#category-description').should('have.value', '');
    cy.get('#category-form-title').should('contain', 'Add Category');
    cy.get('#category-submit-btn').should('contain', 'Create');
  });
});
