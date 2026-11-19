import { Pool } from 'pg';

// تعریف تنظیمات اتصال
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;


