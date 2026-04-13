import { Hono } from 'hono';
import { cors } from 'hono/cors';
import router from './routes/noteRoutes.js';
import pool from './config/db.js';

const app = new Hono();

// Middleware
app.use('/*', cors());
app.route('/api', router);

// Inisialisasi Tabel
const initDB = async (): Promise<void> => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT 'Tanpa Judul',
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabel "notes" berhasil disiapkan.');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal inisialisasi DB';
    console.error('❌', message);
    process.exit(1);
  }
};

const PORT = parseInt(process.env.PORT ?? '3000');

initDB().then(() => {
  app.listen({ port: PORT, hostname: '0.0.0.0' }, () => {
    console.log(`🚀 Backend berjalan di http://localhost:${PORT}`);
  });
});