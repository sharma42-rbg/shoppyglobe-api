# ShoppyGlobe E-commerce API

A complete Node.js and Express.js backend API for the ShoppyGlobe e-commerce application, featuring user authentication, product management, and shopping cart functionality.

Repo: https://github.com/sharma42-rbg/shoppyglobe-api.git

## Features

- **User Authentication**: JWT-based registration and login
- **Product Management**: CRUD operations for products
- **Shopping Cart**: Add, update, and remove items from cart
- **MongoDB Integration**: NoSQL database for data persistence
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling middleware
- **Security**: Password hashing, JWT tokens, protected routes

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product by ID

### Cart (Protected - requires authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add product to cart
- `PUT /api/cart/:id` - Update product quantity in cart
- `DELETE /api/cart/:id` - Remove product from cart

### Health Check
- `GET /api/health` - API health check

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sharma42-rbg/shoppyglobe-api.git
cd shoppyglobe-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shoppyglobe
JWT_SECRET=your_jwt_secret_key_here
```

4. Start MongoDB service (if running locally)

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing

## Database Models

### User
- `name`: String (required, 2-50 chars)
- `email`: String (required, unique, valid email)
- `password`: String (required, min 6 chars, hashed)

### Product
- `name`: String (required, max 100 chars)
- `price`: Number (required, >= 0)
- `description`: String (required, max 500 chars)
- `stock`: Number (required, >= 0)

### Cart
- `userId`: ObjectId (reference to User)
- `products`: Array of objects with `productId` and `quantity`

## API Testing with ThunderClient

Use ThunderClient (VS Code extension) to test the API endpoints:

1. **Register User**:
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body: `{"name": "John Doe", "email": "john@example.com", "password": "password123"}`

2. **Login**:
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body: `{"email": "john@example.com", "password": "password123"}`
   - Copy the returned JWT token

3. **Get Products**:
   - Method: GET
   - URL: `http://localhost:5000/api/products`

4. **Add to Cart** (include JWT token in Authorization header):
   - Method: POST
   - URL: `http://localhost:5000/api/cart`
   - Headers: `Authorization: Bearer <your-jwt-token>`
   - Body: `{"productId": "<product-id>", "quantity": 1}`

## Project Structure

```
shoppyglobe-api/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   └── Cart.js              # Cart model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   └── cart.js              # Cart routes
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── app.js                   # Express app setup
├── server.js                # Server startup
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Server errors (500)

All errors return a consistent JSON format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // for validation errors
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- CORS enabled
- Protected routes for cart operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
