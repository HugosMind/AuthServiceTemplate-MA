import { createConnection } from 'typeorm';

export const connectDatabase = async () => {
  try {
    await createConnection();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};
