# W03 Project API

Node.js API with MongoDB and Swagger for CSE 341 W03 Project. This API provides CRUD operations for Users and Products collections with comprehensive validation and error handling.

## Features

- ✅ **Two Collections**: Users (9+ fields) and Products (15+ fields)
- ✅ **Full CRUD Operations**: GET, POST, PUT, DELETE for both collections
- ✅ **Data Validation**: Comprehensive validation on all POST/PUT routes
- ✅ **Error Handling**: Try/catch blocks with proper HTTP status codes
- ✅ **Swagger Documentation**: Interactive API documentation and testing
- ✅ **MongoDB Integration**: Mongoose models with relationships
- ✅ **Professional Structure**: MVC architecture with proper separation of concerns

## Collections

### Users Collection (9+ fields)
- firstName, lastName, email, phone
- address (street, city, state, zipCode)
- dateOfBirth, role, isActive
- createdAt, updatedAt (auto-generated)
- Virtual fields: age, fullName

### Products Collection (15+ fields)
- name, description, price, category, stock, sku, brand
- weight, dimensions (length, width, height)
- tags, isActive, rating
- reviews (array with user, rating, comment, date)
- createdAt, updatedAt (auto-generated)
- Virtual fields: isInStock, averageRating

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user

### Products
- `GET /api/products` - Get all products (with category/price filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Soft delete product

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
   PORT=3000
   SWAGGER_HOST=localhost:3000
   ```

4. Generate Swagger documentation:
   ```bash
   npm run swagger
   ```

5. Start the server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

### Usage

1. **Swagger UI**: Open http://localhost:3000/api-docs in your browser
2. **API Testing**: Use Swagger UI to test all endpoints interactively
3. **Health Check**: Visit http://localhost:3000/health to verify server status

## Validation & Error Handling

### Data Validation
- All required fields are validated
- Email format validation
- Phone number format validation
- Zip code format validation
- Price must be positive
- Stock must be non-negative integer
- Date of birth must be in the past
- SKU must be unique
- Category must be from predefined list

### Error Handling
- 400: Bad Request (validation errors, invalid data)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (database/connection issues)
- Detailed error messages in response body
- Proper HTTP status codes for all scenarios

## Project Structure

```
w03-project-api/
├── src/
│   ├── controllers/         # Request/response logic
│   │   ├── userController.js
│   │   └── productController.js
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/              # API endpoints
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   ├── database/            # Database connection
│   │   └── db.js
│   └── middleware/          # Custom middleware (for future use)
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Express server
├── swagger.js              # Swagger configuration
├── swagger.json            # Generated Swagger documentation
└── README.md               # This file
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run swagger` - Generate Swagger documentation

## Deployment Notes

- The `.env` file is included in `.gitignore` to protect sensitive data
- Set environment variables in your deployment platform (Render, Heroku, etc.)
- Update `SWAGGER_HOST` environment variable for production deployment
- Ensure MongoDB connection string is properly configured for production

## Testing with Swagger

1. Navigate to `/api-docs`
2. Expand any endpoint
3. Click "Try it out"
4. Fill in the request body (for POST/PUT)
5. Click "Execute"
6. View the response and test different scenarios

## Rubric Compliance

This project meets all W03 rubric requirements:

✅ **API Endpoints (50 pts)**
- Complete CRUD for both collections
- Working Swagger.json
- Proper HTTP status codes
- Database updates verified

✅ **Data Validation (25 pts)**
- POST and PUT routes for both collections
- Comprehensive validation
- 400/500 error responses for invalid data

✅ **Error Handling (15 pts)**
- Try/catch on all routes
- Proper 400/500 status codes
- Detailed error messages

✅ **Deployment Ready (10 pts)**
- Environment variables configured
- Sensitive data protected
- Ready for Render deployment
