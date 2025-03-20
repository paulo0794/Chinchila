# Product CRUD API

A simple RESTful API for managing products and categories.

## Features

- CRUD operations for product categories
- CRUD operations for products
- Products are associated with categories
- API documentation with Swagger UI

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   ```

2. Switch to the feature branch
   ```
   git checkout feature/rafa
   ```

3. Pull the latest changes
   ```
   git pull
   ```

4. Start the application with Docker Compose
   ```
   docker-compose up -d
   ```

## API Documentation

The API documentation is available through Swagger UI at:

```
http://localhost:3000/api-docs
```

This interactive documentation allows you to:
- Explore all available endpoints
- View request/response schemas
- Test API endpoints directly from the browser

## API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:categoryId` - Get products by category ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Technologies

- Backend: Node.js, Express.js
- Frontend: HTML, CSS, JavaScript
- Database: PostgreSQL
- Documentation: OpenAPI 3.0, Swagger UI
- Containerization: Docker, Docker Compose
- Testing: Cypress (Frontend E2E tests)

## Testing

The frontend includes end-to-end tests using Cypress. These tests verify all critical functionality of the application.

### Running Tests

To run the frontend tests:

```bash
cd frontend
npm test           # Run all tests in headless mode
npm run test:open  # Open Cypress Test Runner for interactive testing
npm run test:e2e   # Run only end-to-end tests in headless mode
```

## Git Repository Management

### .gitignore Files

The project includes .gitignore files to ensure only necessary files are committed to the repository:

- Root `.gitignore` - Project-wide ignored files
- `frontend/.gitignore` - Frontend-specific ignored files
- `backend/.gitignore` - Backend-specific ignored files

### Removing Previously Committed Ignored Files

If you've already committed files that should be ignored, you can remove them from the repository (while keeping them in your local directory) using the provided script:

```bash
# Make the script executable (if needed)
chmod +x remove-ignored-files.sh

# Run the script
./remove-ignored-files.sh

# Push the changes to the remote repository
git push
```

This script will:
1. Remove tracked files that should be ignored according to the .gitignore files
2. Commit this change locally
3. Provide instructions for pushing the changes to the remote repository

