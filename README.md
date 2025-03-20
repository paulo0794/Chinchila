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
