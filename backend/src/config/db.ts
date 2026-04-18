import mysql, { Pool } from 'mysql2/promise';

// Pastikan Anda sudah run: bun add -d @types/node
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? '3306'),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'admin123',
  database: process.env.DB_NAME ?? 'notion_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

export default pool;