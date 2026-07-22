# Backend README

## Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm

### Installation

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### Database Setup

```bash
# Run migrations
npm run migrate

# Seed default users and sample data
npm run seed
```

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Server runs on `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database connection
│   ├── models/
│   │   ├── User.ts
│   │   ├── Customer.ts
│   │   ├── Product.ts
│   │   ├── SalesChalan.ts
│   │   ├── ChalanItem.ts
│   │   ├── StockMovement.ts
│   │   └── CustomerFollowUp.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── customer.routes.ts
│   │   ├── product.routes.ts
│   │   ├── challan.routes.ts
│   │   └── inventory.routes.ts
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication
│   │   └── errorHandler.ts       # Centralized error handling
│   ├── database/
│   │   ├── migrations.ts
│   │   └── seed.ts
│   └── index.ts                  # App entry point
├── dist/                         # Compiled JavaScript
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

See `docs/API.md` for complete API documentation.

## Environment Variables

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=erp_crm_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

## Default Test Users

```
Admin:
  Email: admin@company.com
  Password: admin123

Sales:
  Email: sales@company.com
  Password: sales123

Warehouse:
  Email: warehouse@company.com
  Password: warehouse123

Accounts:
  Email: accounts@company.com
  Password: accounts123
```

## Technology Stack

- **Express.js**: REST API framework
- **TypeScript**: Type-safe code
- **TypeORM**: Object-relational mapping
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **Joi**: Input validation
- **Helmet**: Security headers
- **CORS**: Cross-origin requests

## Key Features

✅ User authentication with JWT
✅ Role-based access control
✅ Customer CRM management
✅ Product and inventory management
✅ Sales challan system
✅ Stock movement tracking
✅ Input validation
✅ Error handling
✅ Pagination and search
✅ Data relationships and integrity

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'
```

### Get Customers
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/customers?page=1&limit=10
```

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "9876543210",
    "businessName": "Doe Inc",
    "type": "retail",
    "address": "123 Main St"
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or use:
lsof -i :5000
kill -9 <PID>
```

### Database Connection Failed
```bash
# Verify PostgreSQL is running
# Check credentials in .env
# Ensure database exists
psql -U postgres -c "CREATE DATABASE erp_crm_db;"
```

### TypeORM Sync Issues
```bash
# Clear and resync
npm run migrate
```

## Performance Tips

- Use pagination for large datasets
- Add database indexes for frequently queried fields
- Monitor API response times
- Use connection pooling
- Cache frequently accessed data

## Security

- Passwords are hashed with bcryptjs
- JWT tokens have expiration
- CORS restricted to frontend domain
- Input validation on all endpoints
- SQL injection prevention via ORM
- Error messages don't expose sensitive data

## Deployment

See `docs/DEPLOYMENT.md` for deployment instructions.

## License

MIT
