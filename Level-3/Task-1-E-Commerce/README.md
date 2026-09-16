# E-Commerce Website - CodSoft Level 3

A full-featured e-commerce application with product browsing, shopping cart, and checkout.

## Features

- User authentication (register/login)
- Product browsing with search and filters
- Product categories and sorting
- Shopping cart functionality
- Checkout process
- Order history
- Demo payment integration (test only)
- Responsive design

## Technologies

- **Backend:** Node.js, Express, JWT authentication
- **Database:** MongoDB with Mongoose
- **Frontend:** Vanilla JavaScript, HTML, CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install MongoDB

3. Create `.env` file:
```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-in-production
```

4. Add sample products to MongoDB (you can use MongoDB Compass or create a seed script)

5. Start the server:
```bash
npm start
```

6. Open browser: http://localhost:5002

## Sample Products

You can add products using the API:

```bash
POST http://localhost:5002/api/products
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "image": "https://via.placeholder.com/300",
  "stock": 10,
  "rating": 4.5,
  "reviews": 100
}
```

## Payment Integration

⚠️ **DEMO MODE ONLY**: The payment integration is for demonstration purposes only. No real transactions are processed. In production, integrate with Stripe, PayPal, or other payment gateways.

## Usage

1. Register/Login to your account
2. Browse products by category
3. Add items to cart
4. Proceed to checkout
5. Complete demo purchase
6. View order history
