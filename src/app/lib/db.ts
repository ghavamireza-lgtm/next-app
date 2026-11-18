import { Pool } from 'pg';

// تعریف تنظیمات اتصال
const globalForPg = global as unknown as { pgPool: Pool };

export const pool = globalForPg.pgPool || new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl:false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool;




