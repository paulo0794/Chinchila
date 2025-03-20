# Product Management System - Frontend

A responsive web application for managing products and categories with a clean, user-friendly interface.

## Overview

This frontend application provides a complete user interface for the Product Management System. It allows users to create, read, update, and delete both product categories and products through an intuitive web interface. The application communicates with the backend API to perform these operations.

## Features

- **Category Management**
  - View all categories
  - Create new categories
  - Edit existing categories
  - Delete categories (with confirmation)

- **Product Management**
  - View all products with their associated categories
  - Create new products with category selection
  - Edit existing products
  - Delete products (with confirmation)

- **User Interface**
  - Responsive design that works on desktop and mobile devices
  - Tab-based navigation between categories and products
  - Form validation
  - Success and error notifications
  - Confirmation dialogs for destructive actions

## Technologies Used

- **HTML5** - Structure of the web application
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Client-side functionality
- **Fetch API** - For making HTTP requests to the backend

## Installation and Setup

The frontend is containerized using Docker and is automatically set up when you run the Docker Compose configuration from the root directory.

### Manual Setup (for development)

If you want to run the frontend outside of Docker:

1. Make sure you have a web server installed (like Nginx, Apache, or a simple development server)
2. Clone the repository
3. Configure your web server to serve the frontend directory
4. Ensure the backend API is running and accessible at http://localhost:3000/api

## Usage

### Categories Management

1. **View Categories**: Navigate to the "Categories" tab to see all existing categories.
2. **Add Category**: 
   - Fill in the description field in the "Add Category" form
   - Click "Create" to add a new category
3. **Edit Category**:
   - Click the "Edit" button next to the category you want to modify
   - Update the description in the form (which will now say "Edit Category")
   - Click "Update" to save changes
4. **Delete Category**:
   - Click the "Delete" button next to the category you want to remove
   - Confirm the deletion in the dialog
   - Note: Deleting a category will also delete all products associated with it

### Products Management

1. **View Products**: Navigate to the "Products" tab to see all existing products.
2. **Add Product**:
   - Fill in the description field
   - Select a category from the dropdown
   - Click "Create" to add a new product
3. **Edit Product**:
   - Click the "Edit" button next to the product you want to modify
   - Update the description and/or category
   - Click "Update" to save changes
4. **Delete Product**:
   - Click the "Delete" button next to the product you want to remove
   - Confirm the deletion in the dialog

## API Integration

The frontend communicates with the backend API using the Fetch API. All API calls are encapsulated in the `api.js` file, which provides the following functions:

### Categories API

- `getAllCategories()` - Fetches all categories
- `getCategoryById(id)` - Fetches a specific category by ID
- `createCategory(categoryData)` - Creates a new category
- `updateCategory(id, categoryData)` - Updates an existing category
- `deleteCategory(id)` - Deletes a category

### Products API

- `getAllProducts()` - Fetches all products
- `getProductById(id)` - Fetches a specific product by ID
- `getProductsByCategory(categoryId)` - Fetches all products in a specific category
- `createProduct(productData)` - Creates a new product
- `updateProduct(id, productData)` - Updates an existing product
- `deleteProduct(id)` - Deletes a product

## File Structure

```
frontend/
├── css/
│   └── styles.css          # Styling for the application
├── js/
│   ├── api.js              # API integration functions
│   └── app.js              # Main application logic
├── index.html              # Main HTML file
└── README.md               # This documentation
```

## Error Handling

The application includes comprehensive error handling:

- API errors are caught and displayed to the user
- Form validation ensures all required fields are filled
- Confirmation dialogs prevent accidental deletions
- Success and error messages are shown to provide feedback

## Browser Compatibility

The application is compatible with all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Screenshots

[Add screenshots of the application here]

## API Documentation

The backend API documentation is available at http://localhost:3000/api-docs when the application is running.
