# Sweet Shop Management System - Setup Guide

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create `.env` file in the backend directory:

```bash
cp env.example .env
```

Edit `.env` file with your MongoDB connection:

```env
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:

```bash
cp env.local.example .env.local
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Run the seeding script

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

### 5. Seed Demo Data

Run the seeding script to populate your database with demo data:

```bash
cd backend
npm run seed
```

This will create:

- **3 demo users** (1 admin, 2 regular users)
- **15 demo sweets** with various categories

### 6. Start the Application

#### Terminal 1 - Backend (Port 5000):

```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend (Port 3000):

```bash
cd frontend
npm run dev
```

## 🔑 Demo Accounts

After running the seed script, you can use these accounts:

### Admin Account

- **Email:** `Test@mail.com`
- **Password:** `test123`
- **Access:** Full admin panel with CRUD operations

### User Accounts

- **Email:** `john@example.com`
- **Password:** `user123`
- **Access:** Dashboard and purchase functionality

- **Email:** `jane@example.com`
- **Password:** `user123`
- **Access:** Dashboard and purchase functionality

## 🌐 Access Points

- **Homepage:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Register:** http://localhost:3000/auth/register
- **Dashboard:** http://localhost:3000/dashboard
- **Admin Panel:** http://localhost:3000/admin
- **API Health:** http://localhost:5000/health

## 🍭 Demo Sweets Created

The seeding script creates 15 different sweets across various categories:

- **Chocolates:** Chocolate Truffles, Chocolate Covered Strawberries
- **Gummies:** Gummy Bears, Sour Patch Kids
- **Hard Candy:** Lollipops, Rock Candy, Candy Canes, Peppermint Candies
- **Jelly:** Jelly Beans
- **Caramel:** Caramel Squares
- **Mints:** Peppermint Candies
- **Licorice:** Licorice Twists
- **Floss Candy:** Cotton Candy
- **Fudge:** Fudge Squares
- **Taffy:** Taffy Pulls
- **Marshmallows:** Marshmallow Treats

## 🎯 How to Access Admin Panel

1. **Start both servers** (backend on port 5000, frontend on port 3000)
2. **Go to:** http://localhost:3000/auth/login
3. **Login with admin credentials:**
   - Email: `Test@mail.com`
   - Password: `test123`
4. **You'll be automatically redirected to:** http://localhost:3000/admin

## 🛠️ Admin Panel Features

Once logged in as admin, you can:

- **View Statistics:** Total sweets, stock levels, low stock alerts
- **Add New Sweets:** Complete form with name, category, price, quantity
- **Edit Sweets:** Update existing sweet information
- **Delete Sweets:** Remove sweets from inventory
- **Restock Items:** Add more quantity to existing sweets
- **View Inventory Table:** See all sweets with status indicators

## 🔄 Resetting Demo Data

To reset the database with fresh demo data:

```bash
cd backend
npm run seed
```

This will clear all existing data and recreate the demo users and sweets.

## 🐛 Troubleshooting

### Port Already in Use

- Backend uses port 5000
- Frontend uses port 3000
- Make sure no other services are using these ports

### MongoDB Connection Issues

- Check if MongoDB is running
- Verify connection string in `.env`
- For Atlas, ensure IP is whitelisted

### Authentication Issues

- Make sure JWT_SECRET is set in `.env`
- Clear browser cookies if having login issues

## 📱 Features Overview

### User Features

- Browse sweets with search and filter
- Purchase sweets (reduces inventory)
- View purchase history
- Responsive design for mobile

### Admin Features

- Complete inventory management
- Add/Edit/Delete sweets
- Restock functionality
- Low stock alerts
- User management
- Sales analytics

## 🎨 Design Features

- Modern gradient backgrounds
- Responsive design
- Smooth animations
- Toast notifications
- Loading states
- Error handling
- Mobile-first approach