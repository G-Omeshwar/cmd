# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/login`) require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
User login
```json
{
  "email": "admin@company.com",
  "password": "admin123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

#### GET /auth/me
Get current user profile

#### POST /auth/logout
Logout user

---

### Customers

#### GET /customers
List all customers with pagination
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string (search by name, email, phone)
```

#### POST /customers
Create new customer
```json
{
  "name": "John Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "businessName": "Doe Enterprises",
  "gstNumber": "12ABCDE1234F1Z5",
  "type": "retail",
  "address": "123 Main St",
  "status": "lead",
  "notes": "VIP customer"
}
```

#### GET /customers/:id
Get customer details with follow-ups

#### PUT /customers/:id
Update customer information

#### POST /customers/:id/follow-ups
Add follow-up note
```json
{
  "notes": "Follow up for quotation",
  "followUpDate": "2024-08-15"
}
```

#### GET /customers/:id/follow-ups
Get customer follow-up history

---

### Products

#### GET /products
List all products
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string (search by name or SKU)
- category: string (filter by category)
```

#### POST /products
Create new product (Admin/Warehouse only)
```json
{
  "name": "Product Name",
  "sku": "SKU001",
  "category": "Electronics",
  "unitPrice": 500.00,
  "minimumStockAlert": 10,
  "location": "Warehouse A"
}
```

#### GET /products/:id
Get product details

#### PUT /products/:id
Update product (Admin/Warehouse only)

---

### Inventory

#### GET /inventory/stock-movements
Get stock movement history
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- productId: string (filter by product)
```

#### POST /inventory/adjust-stock
Adjust stock manually (Admin/Warehouse only)
```json
{
  "productId": "product-uuid",
  "quantityChanged": 10,
  "movementType": "in",
  "reason": "Stock received from supplier",
  "reference": "Optional reference"
}
```

#### GET /inventory/low-stock
Get products with low stock (below minimum alert)

---

### Sales Challans

#### GET /challans
List all challans
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- status: string (draft, confirmed, cancelled)
```

#### POST /challans
Create new challan (Sales/Admin only)
```json
{
  "customerId": "customer-uuid",
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 5
    }
  ]
}
```

#### GET /challans/:id
Get challan details with items

#### PUT /challans/:id/confirm
Confirm challan and deduct stock (Sales/Admin only)

#### PUT /challans/:id/cancel
Cancel challan (Sales/Admin only)

---

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (Validation Error)
- `401`: Unauthorized
- `403`: Forbidden (Insufficient Permissions)
- `404`: Not Found
- `500`: Server Error

## Error Response
```json
{
  "error": "Error message",
  "statusCode": 400
}
```
