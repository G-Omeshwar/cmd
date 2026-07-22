# Mini ERP + CRM Operations Portal

A full-stack web application for wholesale/distribution companies to manage customers, products, inventory, and sales operations.

## 🎯 Project Overview

This system is designed for internal employees (Sales, Warehouse, Accounts, Admin) to manage:
- **Customer CRM**: Lead tracking, customer management, follow-ups
- **Product & Inventory**: Stock management, warehouse locations, stock movement logs
- **Sales Challans**: Order creation with automatic stock deduction
- **Authentication & Roles**: Role-based access control (Admin, Sales, Warehouse, Accounts)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Joi/class-validator

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS / Bootstrap
- **State Management**: Context API / Redux
- **HTTP Client**: Axios

### Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway / Fly.io
- **Database**: Supabase / Neon

## 📁 Project Structure

```
cmd/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── models/          # TypeORM/Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/           # Helper functions
│   │   ├── database/        # Migrations and seeds
│   │   └── index.ts         # App entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── context/         # Global state
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Helper functions
│   │   ├── styles/          # Global styles
│   │   └── App.tsx          # App entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── docs/
│   ├── API.md               # API documentation
│   ├── DATABASE.md          # Database schema
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── ARCHITECTURE.md      # Architecture overview
└── docker-compose.yml       # Docker setup (bonus)
```

## 🔐 Authentication & Roles

### Supported Roles
1. **Admin**: Full system access, user management, reporting
2. **Sales**: Create/manage customers, create/confirm sales challans
3. **Warehouse**: Manage inventory, process stock movements
4. **Accounts**: View invoices, payments, financial reports

### Authentication Flow
- JWT-based token authentication
- Tokens issued upon login, valid for configurable duration
- Token refresh mechanism
- Role-based middleware to protect routes

## 📋 Core Modules

### 1. Authentication Module
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user profile

### 2. Customer CRM Module
- `GET /api/customers` - List all customers (with search/filter)
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `POST /api/customers/:id/follow-ups` - Add follow-up note
- `GET /api/customers/:id/follow-ups` - Get follow-up history

### 3. Product & Inventory Module
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `GET /api/inventory/stock-movements` - View stock movement logs
- `POST /api/inventory/adjust-stock` - Adjust stock manually (admin only)

### 4. Sales Challan Module
- `GET /api/challans` - List all challans
- `POST /api/challans` - Create new challan (draft)
- `GET /api/challans/:id` - Get challan details
- `PUT /api/challans/:id/confirm` - Confirm challan (deduct stock)
- `PUT /api/challans/:id/cancel` - Cancel challan

## 🗄️ Database Schema (PostgreSQL)

### Key Tables
- `users` - System users with roles
- `customers` - Customer information
- `products` - Product master data
- `stock_movements` - Inventory log
- `sales_challans` - Challan header
- `challan_items` - Challan line items (product snapshots)
- `customer_follow_ups` - CRM follow-ups

*Detailed schema in `docs/DATABASE.md`*

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Seed sample data
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API base URL

# Start development server
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs (if Swagger enabled)

## 🔑 Default Test Credentials

```
Admin User:
Email: admin@company.com
Password: admin123

Sales User:
Email: sales@company.com
Password: sales123

Warehouse User:
Email: warehouse@company.com
Password: warehouse123

Accounts User:
Email: accounts@company.com
Password: accounts123
```

## 📊 Key Features

### Implemented
- ✅ User authentication with JWT
- ✅ Role-based access control
- ✅ Customer management with follow-ups
- ✅ Product and inventory management
- ✅ Stock movement tracking
- ✅ Sales challan creation and confirmation
- ✅ Stock deduction on challan confirmation
- ✅ Error handling and validation
- ✅ Pagination and search

### Bonus Features (Optional)
- 📦 Docker setup
- 🔄 GitHub Actions CI/CD
- 📄 PDF export for invoices
- 🖼️ AWS S3 image upload
- 📊 Advanced reporting

## 📚 Documentation

- **API Documentation**: See `docs/API.md`
- **Database Schema**: See `docs/DATABASE.md`
- **Deployment Guide**: See `docs/DEPLOYMENT.md`
- **Architecture Overview**: See `docs/ARCHITECTURE.md`

## 🐳 Docker Setup (Optional)

```bash
docker-compose up -d
```

This will start PostgreSQL, backend, and frontend containers.

## 📤 Deployment

See `docs/DEPLOYMENT.md` for step-by-step deployment instructions for:
- Vercel (Frontend)
- Render/Railway (Backend)
- Supabase/Neon (Database)

## 🤝 Troubleshooting

### Common Issues
1. **Database connection error**: Verify PostgreSQL is running and `.env` has correct credentials
2. **CORS errors**: Check `CORS_ORIGIN` in backend `.env`
3. **Port already in use**: Change ports in `.env`

For more help, see `docs/DEPLOYMENT.md` troubleshooting section.

## 📝 Assumptions

- Single database instance shared across all modules
- JWT tokens stored in localStorage on frontend
- All timestamps in UTC
- Stock movements are immutable (audit trail)
- Challans can be confirmed only with sufficient stock

## ⚠️ Known Limitations

- No invoice generation (basic challan only)
- No payment tracking
- No multi-warehouse support (single warehouse assumed)
- No advanced reporting/analytics
- No email notifications

## 📧 Support

For issues or questions, please create a GitHub issue.

---

**Assignment Deadline**: 48 hours
