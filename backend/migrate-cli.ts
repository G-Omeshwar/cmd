import dotenv from 'dotenv';
import { AppDataSource } from './src/config/database';
import { seedDatabase } from './src/database/seed';

dotenv.config();

const runMigrations = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Synchronize database schema (create tables if they don't exist)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Synchronizing database schema...');
      await AppDataSource.synchronize();
      console.log('✅ Database schema synchronized');
    }

    // Seed default data
    await seedDatabase();

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
