import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import router from './routes/noteRoutes.js';
import pool from './config/db.js';

const app = new Hono();

// 1. Middleware Logging & CORS
app.use('*', logger());
app.use('*', cors());

// 2. Global Error Handler
app.onError((err, c) => {
  console.error('💥 UNHANDLED ERROR:', err);
  return c.json(
    { error: err instanceof Error ? err.message : 'Internal Server Error' },
    500
  );
});

// 3. Mount Routes
app.route('/api', router);
// Init DB
const initDB = async (): Promise<void> => {
  const maxRetries = 5;
  for (let i = 1; i <= maxRetries; i++) {
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
      console.log('✅ Tabel "notes" siap.');
      return;
    } catch (err) {
      console.warn(`⏳ Gagal connect DB (percobaan ${i}/${maxRetries}). Retrying...`);
      if (i === maxRetries) throw err;
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

const APP_PORT = parseInt(process.env.APP_PORT ?? '3000');


initDB()
  .then(() => {
    // ✅ Gunakan Bun.serve() alih-alih app.listen()
    Bun.serve({
      port: APP_PORT,
      hostname: '0.0.0.0',
      fetch: app.fetch,
    });
    console.log(`🚀 Backend aktif di http://localhost:${APP_PORT}`);
  })
  .catch(err => {
    console.error('❌ Fatal: Gagal inisialisasi database', err);
    process.exit(1);
  });