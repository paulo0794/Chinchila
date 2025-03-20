describe('Tab Switching', () => {
  beforeEach(() => {
    // Stub API calls
    cy.stubApiCalls();
    
    // Visit the application before each test
    cy.visit('/');
    
    // Wait for the application to load
    cy.get('h1').should('contain', 'Product Management System');
  });

  it('should show categories tab by default', () => {
    // Verify that categories tab is active by default
    cy.get('#categories-tab').should('have.class', 'active');
    cy.get('#categories-content').should('have.class', 'active');
    cy.get('#products-content').should('not.have.class', 'active');
  });

  it('should switch to products tab when clicked', () => {
    // Click on the products tab
    cy.get('#products-tab').click();
    
    // Verify that products tab is now active
    cy.get('#products-tab').should('have.class', 'active');
    cy.get('#categories-tab').should('not.have.class', 'active');
    cy.get('#products-content').should('have.class', 'active');
    cy.get('#categories-content').should('not.have.class', 'active');
  });

  it('should switch back to categories tab when clicked', () => {
    // First switch to products tab
    cy.get('#products-tab').click();
    
    // Then switch back to categories tab
    cy.get('#categories-tab').click();
    
    // Verify that categories tab is now active again
    cy.get('#categories-tab').should('have.class', 'active');
    cy.get('#products-tab').should('not.have.class', 'active');
    cy.get('#categories-content').should('have.class', 'active');
    cy.get('#products-content').should('not.have.class', 'active');
  });
});
