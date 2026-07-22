import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { Customer, CustomerStatus, CustomerType } from '../models/Customer';
import { Product } from '../models/Product';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    const userRepository = AppDataSource.getRepository(User);
    const customerRepository = AppDataSource.getRepository(Customer);
    const productRepository = AppDataSource.getRepository(Product);

    // Check if data already exists
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('ℹ️  Database already seeded, skipping...');
      return;
    }

    // Create default users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@company.com',
        password: await bcrypt.hash('admin123', 10),
        role: UserRole.ADMIN,
        isActive: true,
      },
      {
        name: 'Sales User',
        email: 'sales@company.com',
        password: await bcrypt.hash('sales123', 10),
        role: UserRole.SALES,
        isActive: true,
      },
      {
        name: 'Warehouse User',
        email: 'warehouse@company.com',
        password: await bcrypt.hash('warehouse123', 10),
        role: UserRole.WAREHOUSE,
        isActive: true,
      },
      {
        name: 'Accounts User',
        email: 'accounts@company.com',
        password: await bcrypt.hash('accounts123', 10),
        role: UserRole.ACCOUNTS,
        isActive: true,
      },
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`✅ Created user: ${userData.email}`);
    }

    // Create sample customers
    const customers = [
      {
        name: 'ABC Retail Store',
        mobileNumber: '9876543210',
        email: 'abc@example.com',
        businessName: 'ABC Retail',
        gstNumber: '12ABCDE1234F1Z5',
        type: CustomerType.RETAIL,
        address: '123 Market Street, New Delhi',
        status: CustomerStatus.ACTIVE,
        notes: 'Regular customer with good payment history',
      },
      {
        name: 'XYZ Wholesale',
        mobileNumber: '9876543211',
        email: 'xyz@example.com',
        businessName: 'XYZ Wholesale Pvt Ltd',
        gstNumber: '12XYZEF5678G2Z9',
        type: CustomerType.WHOLESALE,
        address: '456 Industrial Area, Mumbai',
        status: CustomerStatus.ACTIVE,
        notes: 'Bulk orders, monthly settlement',
      },
      {
        name: 'Pqr Distributors',
        mobileNumber: '9876543212',
        email: 'pqr@example.com',
        businessName: 'Pqr Distribution Network',
        gstNumber: '12PQRHI9101J3Z2',
        type: CustomerType.DISTRIBUTOR,
        address: '789 Trading Hub, Bangalore',
        status: CustomerStatus.ACTIVE,
        notes: 'Regional distributor',
      },
      {
        name: 'New Prospect',
        mobileNumber: '9876543213',
        email: 'prospect@example.com',
        businessName: 'Prospect Enterprise',
        type: CustomerType.RETAIL,
        address: '321 Business Park, Chennai',
        status: CustomerStatus.LEAD,
        notes: 'Initial meeting scheduled',
      },
    ];

    for (const customerData of customers) {
      const customer = customerRepository.create(customerData);
      await customerRepository.save(customer);
      console.log(`✅ Created customer: ${customerData.name}`);
    }

    // Create sample products
    const products = [
      {
        name: 'Laptop Computer',
        sku: 'LAP001',
        category: 'Electronics',
        unitPrice: 45000,
        currentStock: 15,
        minimumStockAlert: 5,
        location: 'Warehouse A - Shelf 1',
        isActive: true,
      },
      {
        name: 'Wireless Mouse',
        sku: 'MOU001',
        category: 'Electronics',
        unitPrice: 800,
        currentStock: 150,
        minimumStockAlert: 50,
        location: 'Warehouse A - Shelf 2',
        isActive: true,
      },
      {
        name: 'USB-C Cable',
        sku: 'CAB001',
        category: 'Accessories',
        unitPrice: 500,
        currentStock: 8,
        minimumStockAlert: 20,
        location: 'Warehouse A - Shelf 3',
        isActive: true,
      },
      {
        name: 'Mechanical Keyboard',
        sku: 'KEY001',
        category: 'Electronics',
        unitPrice: 5000,
        currentStock: 25,
        minimumStockAlert: 10,
        location: 'Warehouse B - Shelf 1',
        isActive: true,
      },
      {
        name: 'Monitor 27 Inch',
        sku: 'MON001',
        category: 'Electronics',
        unitPrice: 15000,
        currentStock: 3,
        minimumStockAlert: 5,
        location: 'Warehouse B - Shelf 2',
        isActive: true,
      },
      {
        name: 'Webcam HD',
        sku: 'WEB001',
        category: 'Electronics',
        unitPrice: 3000,
        currentStock: 45,
        minimumStockAlert: 15,
        location: 'Warehouse B - Shelf 3',
        isActive: true,
      },
      {
        name: 'USB Hub',
        sku: 'HUB001',
        category: 'Accessories',
        unitPrice: 1200,
        currentStock: 60,
        minimumStockAlert: 20,
        location: 'Warehouse C - Shelf 1',
        isActive: true,
      },
      {
        name: 'Power Bank',
        sku: 'POW001',
        category: 'Accessories',
        unitPrice: 2500,
        currentStock: 4,
        minimumStockAlert: 10,
        location: 'Warehouse C - Shelf 2',
        isActive: true,
      },
    ];

    for (const productData of products) {
      const product = productRepository.create(productData);
      await productRepository.save(product);
      console.log(`✅ Created product: ${productData.name}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
