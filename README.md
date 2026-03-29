# CSE341 API Project

Node.js REST API with MongoDB and Swagger documentation for CSE 341 assignment.

## Features

- ✅ Two collections: Users and Products
- ✅ Full CRUD operations
- ✅ Data validation
- ✅ Error handling
- ✅ OAuth authentication
- ✅ Swagger documentation

## Collections

### Users
- firstName, lastName, email, phone
- address (street, city, state, zipCode)
- dateOfBirth, role, isActive
- createdAt, updatedAt

### Products
- name, description, price, category, stock, sku, brand
- weight, dimensions, tags, rating, reviews
- createdAt, updatedAt

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Authentication
- `GET /login` - Login with GitHub OAuth
- `GET /api/auth/profile` - Get current user (protected)
- `GET /api/auth/status` - Check auth status
- `GET /api/auth/logout` - Logout

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_ID=your_github_client_id
   CLIENT_SECRET=your_github_client_secret
   CALLBACK_URL=http://localhost:3000/api/auth/github/callback
   SESSION_SECRET=your_session_secret
   ```

3. Start server:
   ```bash
   npm run dev
   ```

## Usage

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **Login**: http://localhost:3000/login

## Deployment

Add environment variables in your deployment platform:
- `MONGODB_URI`
- `CLIENT_ID`
- `CLIENT_SECRET` 
- `CALLBACK_URL` (update to your production URL)
- `SESSION_SECRET`
- `SWAGGER_HOST` (your production domain)

## Scripts

- `npm start` - Production server
- `npm run dev` - Development with nodemon
- `npm run swagger` - Generate documentation
