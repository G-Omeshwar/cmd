# Database Schema

## Overview
PostgreSQL database for ERP/CRM system with 7 main tables.

## Tables

### users
System users with role-based access
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'sales', 'warehouse', 'accounts') DEFAULT 'sales',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### customers
Customer CRM data
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  mobileNumber VARCHAR(10) NOT NULL,
  email VARCHAR(255) NOT NULL,
  businessName VARCHAR(255) NOT NULL,
  gstNumber VARCHAR(15),
  type ENUM('retail', 'wholesale', 'distributor') NOT NULL,
  address TEXT NOT NULL,
  status ENUM('lead', 'active', 'inactive') DEFAULT 'lead',
  followUpDate DATE,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### products
Product master data
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  unitPrice DECIMAL(10, 2) NOT NULL,
  currentStock INTEGER DEFAULT 0,
  minimumStockAlert INTEGER NOT NULL,
  location VARCHAR(255) NOT NULL,
  imageUrl VARCHAR(500),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sales_challans
Sales challan header
```sql
CREATE TABLE sales_challans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challanNumber VARCHAR(50) UNIQUE NOT NULL,
  customerId UUID NOT NULL REFERENCES customers(id),
  totalQuantity INTEGER NOT NULL,
  totalAmount DECIMAL(12, 2) NOT NULL,
  status ENUM('draft', 'confirmed', 'cancelled') DEFAULT 'draft',
  createdBy UUID NOT NULL REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### challan_items
Challan line items with product snapshot
```sql
CREATE TABLE challan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chalanId UUID NOT NULL REFERENCES sales_challans(id) ON DELETE CASCADE,
  productId UUID NOT NULL REFERENCES products(id),
  productName VARCHAR(255) NOT NULL,
  productSku VARCHAR(100) NOT NULL,
  unitPrice DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  totalPrice DECIMAL(12, 2) NOT NULL
);
```

### stock_movements
Immutable stock movement log
```sql
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  productId UUID NOT NULL REFERENCES products(id),
  quantityChanged INTEGER NOT NULL,
  movementType ENUM('in', 'out') NOT NULL,
  reason VARCHAR(255) NOT NULL,
  createdBy UUID NOT NULL REFERENCES users(id),
  reference TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### customer_follow_ups
Customer follow-up notes
```sql
CREATE TABLE customer_follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customerId UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  followUpDate DATE,
  isCompleted BOOLEAN DEFAULT false,
  createdBy UUID NOT NULL REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
-- Customer searches
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_mobile ON customers(mobileNumber);
CREATE INDEX idx_customers_status ON customers(status);

-- Product searches
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(currentStock);

-- Challan searches
CREATE INDEX idx_challans_customer ON sales_challans(customerId);
CREATE INDEX idx_challans_status ON sales_challans(status);
CREATE INDEX idx_challans_date ON sales_challans(createdAt);

-- Stock movement tracking
CREATE INDEX idx_movements_product ON stock_movements(productId);
CREATE INDEX idx_movements_date ON stock_movements(createdAt);

-- Follow-ups
CREATE INDEX idx_followups_customer ON customer_follow_ups(customerId);
CREATE INDEX idx_followups_date ON customer_follow_ups(followUpDate);
```

## Relationships

```
users (1) ---- (N) sales_challans
users (1) ---- (N) stock_movements
users (1) ---- (N) customer_follow_ups

customers (1) ---- (N) sales_challans
customers (1) ---- (N) customer_follow_ups

products (1) ---- (N) challan_items
products (1) ---- (N) stock_movements

sales_challans (1) ---- (N) challan_items
```

## Data Integrity

1. **Stock Validation**: Stock cannot go negative
2. **Challan Items**: Stores product snapshot (not just reference)
3. **Stock Movements**: Immutable audit trail
4. **Cascade Delete**: Deleting customer deletes follow-ups; deleting challan deletes items
