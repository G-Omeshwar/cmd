import dotenv from 'dotenv';
import { AppDataSource } from './src/config/database';
import { seedDatabase } from './src/database/seed';

dotenv.config();

const runSeed = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    await seedDatabase();
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

runSeed();
