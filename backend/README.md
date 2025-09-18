# Sweet Shop Management System - Backend

A Node.js backend API for managing a sweet shop with user authentication, sweet inventory management, and purchase/restock functionality.

## Features

- **User Authentication**: JWT-based authentication with user registration and login
- **Sweet Management**: CRUD operations for sweets with search functionality
- **Inventory Management**: Purchase and restock operations with stock tracking
- **Role-based Access**: User and Admin roles with appropriate permissions
- **Data Validation**: Comprehensive input validation using express-validator
- **Security**: Helmet, CORS, rate limiting, and password hashing

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweets (Protected)

- `POST /api/sweets` - Add new sweet (Admin only)
- `GET /api/sweets` - Get all sweets with pagination and filtering
- `GET /api/sweets/search` - Search sweets by name, category, or price range
- `GET /api/sweets/:id` - Get single sweet
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory (Protected)

- `POST /api/sweets/:id/purchase` - Purchase sweet (decrease quantity)
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)
- `GET /api/sweets/:id/stock` - Get current stock level
- `GET /api/sweets/low-stock` - Get low stock items (Admin only)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   MONGODB_URI=mongodb://localhost:27017/sweet-shop
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**

   - Local: Make sure MongoDB is running on your system
   - Atlas: Use your MongoDB Atlas connection string

5. **Run the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Environment Variables

| Variable         | Description               | Default                                |
| ---------------- | ------------------------- | -------------------------------------- |
| `MONGODB_URI`    | MongoDB connection string | `mongodb://localhost:27017/sweet-shop` |
| `JWT_SECRET`     | Secret key for JWT tokens | Required                               |
| `JWT_EXPIRES_IN` | JWT token expiration time | `24h`                                  |
| `PORT`           | Server port               | `3000`                                 |
| `NODE_ENV`       | Environment mode          | `development`                          |

## Data Models

### User

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Sweet

```javascript
{
  name: String (required, unique),
  category: String (required),
  price: Number (required, min: 0),
  quantity: Number (required, min: 0),
  description: String (optional),
  imageUrl: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // For validation errors
}
```

## Testing

Run tests using Jest:

```bash
npm test
```