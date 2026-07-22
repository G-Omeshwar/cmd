import { AppDataSource } from '../config/database';

export const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');

    // TypeORM will automatically handle schema synchronization
    // based on the entities defined in the DataSource
    await AppDataSource.runMigrations();

    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
};
