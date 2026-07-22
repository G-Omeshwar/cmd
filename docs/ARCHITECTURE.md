# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React + TypeScript)    │
│  - Dashboard, Customers, Products       │
│  - Sales Challans, Inventory            │
│  - Context API for state management     │
└─────────────────┬───────────────────────┘
                  │
                  │ HTTP/REST API
                  │
┌─────────────────▼───────────────────────┐
│    Backend (Node.js + Express)          │
│  - Authentication & JWT                 │
│  - Role-based Access Control            │
│  - Business Logic & Validation          │
│  - RESTful API Routes                   │
└─────────────────┬───────────────────────┘
                  │
                  │ TypeORM/ORM
                  │
┌─────────────────▼───────────────────────┐
│      PostgreSQL Database                │
│  - 7 Tables with relationships          │
│  - Stock movement audit trail           │
│  - Indexed for performance              │
└─────────────────────────────────────────┘
```

## Backend Architecture

### Layered Architecture

```
┌──────────────────────────────┐
│   Routes / Controllers        │  API Endpoints
├──────────────────────────────┤
│   Services / Business Logic   │  Core Business Rules
├──────────────────────────────┤
│   Models / Entities          │  Data Structures
├──────────────────────────────┤
│   Database / ORM             │  Data Persistence
└──────────────────────────────┘
```

### Key Components

1. **Authentication Layer** (`middleware/auth.ts`)
   - JWT token verification
   - Role-based access control
   - User context injection

2. **Routes** (`routes/*.routes.ts`)
   - Auth routes (login, logout, me)
   - Customer CRUD & follow-ups
   - Product management
   - Challan management
   - Inventory tracking

3. **Models** (`models/*.ts`)
   - TypeORM entities with relationships
   - Enums for statuses and types
   - Automatic timestamps

4. **Validation** (via Joi)
   - Input validation before processing
   - Error handling with meaningful messages

## Frontend Architecture

### Component Hierarchy

```
App
├── Login Page
│   └── Auth Context
├── Layout
│   ├── Navbar
│   ├── Sidebar
│   └── Outlet (Page Routes)
│       ├── Dashboard
│       ├── Customers
│       │   ├── Customers List
│       │   └── Customer Detail
│       ├── Products
│       ├── Challans
│       │   ├── Challan List
│       │   ├── Challan Create
│       │   └── Challan Detail
│       └── Inventory
```

### State Management

- **AuthContext**: Manages user authentication and authorization
- **Local State**: Component-level state for forms and lists
- **API Service**: Axios instance with interceptors

## Data Flow

### Creating a Sales Challan

```
1. User selects customer and products
   ↓
2. Frontend validates input
   ↓
3. POST /api/challans (create draft)
   ↓
4. Backend validates and creates challan
   ↓
5. Database stores challan + items
   ↓
6. Frontend displays challan detail
   ↓
7. User confirms challan
   ↓
8. PUT /api/challans/:id/confirm
   ↓
9. Backend validates stock availability
   ↓
10. Deduct stock from products
   ↓
11. Create stock movement log
   ↓
12. Update challan status to confirmed
```

## Security Features

1. **Authentication**: JWT tokens with configurable expiry
2. **Authorization**: Role-based middleware
3. **Input Validation**: Joi schema validation
4. **Error Handling**: Centralized error handler
5. **CORS**: Configured for frontend domain
6. **Helmet**: Security headers
7. **Password Hashing**: Bcrypt for password storage

## Performance Considerations

1. **Pagination**: All list endpoints support pagination
2. **Search/Filter**: Indexed database columns
3. **Relationships**: Eager loading where needed
4. **Caching**: Stateless API (can be cached at frontend)
5. **Database Indexes**: On frequently searched columns

## Scalability

1. **Stateless Backend**: Can run multiple instances
2. **Database Connection Pool**: TypeORM manages connections
3. **Modular Code**: Easy to add new modules
4. **Separation of Concerns**: Business logic separate from routes

## Error Handling

```
Client Request
   ↓
Validation Middleware
   ├─ Invalid → 400 Bad Request
   ↓
Authentication
   ├─ No Token → 401 Unauthorized
   ├─ Invalid Token → 401 Unauthorized
   ↓
Authorization
   ├─ Insufficient Role → 403 Forbidden
   ↓
Business Logic
   ├─ Validation Error → 400/409 Conflict
   ├─ Resource Not Found → 404 Not Found
   ├─ Server Error → 500 Internal Server Error
   ↓
Success Response
   └─ 200/201 Success
```

## Deployment Architecture

```
┌──────────────────────────────┐
│   Client Browser             │
└────────────┬─────────────────┘
             │
      ┌──────▼──────┐
      │  Vercel/    │ Frontend
      │  Netlify    │
      └──────┬──────┘
             │
      ┌──────▼──────────────┐
      │  Render/Railway/    │
      │  Fly.io             │ Backend API
      └──────┬──────────────┘
             │
      ┌──────▼──────────────┐
      │  Supabase/Neon      │
      │  PostgreSQL         │ Database
      └─────────────────────┘
```

## Environment Configuration

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=erp_crm_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_APP_NAME=ERP CRM Portal
```

## Module Responsibilities

### Auth Module
- User login/logout
- JWT token generation
- User profile retrieval

### Customer Module
- CRUD operations on customers
- Follow-up management
- Customer search and filtering

### Product Module
- Product catalog management
- SKU uniqueness enforcement
- Category-based filtering

### Challan Module
- Challan creation with items
- Draft/Confirmed/Cancelled states
- Stock validation on confirmation

### Inventory Module
- Stock adjustments
- Movement tracking
- Low stock alerts
- Audit trail maintenance
