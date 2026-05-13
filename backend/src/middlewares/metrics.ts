import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import { Context, Next } from 'hono';

// Setup Registry
export const register = new Registry();

// Mengumpulkan metrik bawaan sistem (RAM, CPU, Event Loop Bun)
collectDefaultMetrics({ register });

// Membuat metrik kustom: Menghitung total request
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total jumlah HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// Membuat metrik kustom: Mengukur durasi request (kecepatan respon)
const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durasi HTTP requests dalam detik',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 1.5, 3], // Pengelompokan waktu respon
  registers: [register],
});

// Export Middleware untuk merekam setiap request yang masuk
export const metricsMiddleware = async (c: Context, next: Next) => {
  // Abaikan pencatatan untuk endpoint /metrics itu sendiri agar tidak spam
  if (c.req.path === '/metrics') {
    return await next();
  }

  const start = performance.now();
  await next();
  const duration = (performance.now() - start) / 1000; // Konversi ms ke detik

  // Daftarkan data ke metrik setelah request selesai diproses
  httpRequestsTotal.inc({
    method: c.req.method,
    route: c.req.routePath,
    status: c.res.status,
  });

  httpRequestDurationSeconds.observe(
    {
      method: c.req.method,
      route: c.req.routePath,
      status: c.res.status,
    },
    duration
  );
};

// Export Endpoint Handler yang akan ditarik (di-scrape) oleh Prometheus
export const metricsEndpoint = async (c: Context) => {
  const metrics = await register.metrics();
  c.header('Content-Type', register.contentType);
  return c.text(metrics);
};