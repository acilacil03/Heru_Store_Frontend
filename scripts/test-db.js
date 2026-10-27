import { query } from '../lib/db.js';

async function testDB() {
  try {
    console.log('Testing MySQL connection...');
    console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
    console.log('DB_PORT:', process.env.DB_PORT || 3306);
    console.log('DB_USER:', process.env.DB_USER || 'root');
    console.log('DB_NAME:', process.env.DB_NAME || 'defaultdb');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

    const result = await query('SELECT 1 as test, NOW() as server_time');
    console.log('✅ MySQL Connection SUCCESSFUL!');
    console.log('Test result:', result);
    process.exit(0);
  } catch (err) {
    console.error('❌ MySQL Connection FAILED!');
    console.error('Error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
}

testDB();
