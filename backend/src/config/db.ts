import mysql, { Pool } from 'mysql2/promise';

// 🔐 Helper: Validasi env var wajib ada
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(`❌ Environment variable "${key}" is required but not set.`);
  }
  return value;
};

// 🔐 Helper: Validasi env var opsional (dengan default hanya untuk non-sensitive)
const getEnvOptional = (key: string, defaultValue: string): string => {
  return process.env[key]?.trim() || defaultValue;
};

const pool: Pool = mysql.createPool({
  // ✅ WAJIB: Tidak ada fallback untuk kredensial sensitif
  host: getEnv('DB_HOST'),
  user: getEnv('DB_USER'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_NAME'),
  
  // ✅ OPSIONAL: Boleh ada default untuk non-sensitive
  port: Number(getEnvOptional('DB_PORT', '3306')),
  
  // Pool config (non-sensitive, boleh default)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

export default pool;