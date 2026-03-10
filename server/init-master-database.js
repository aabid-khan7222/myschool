/**
 * Initialize master_db and schools registry.
 *
 * Creates:
 * - Database: master_db (if not exists)
 * - Table: schools (if not exists)
 * - Seeds 3 school records:
 *   1 | Existing School | 1111 | school_db
 *   2 | Millat          | 2222 | millat_db
 *   3 | Iqra            | 3333 | iqra_db
 *
 * Run with:
 *   NODE_ENV=development node init-master-database.js
 */

const { Pool } = require('pg');
require('dotenv').config();

const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: 'postgres',
});

async function ensureMasterDb() {
  const dbName = 'master_db';
  const existsRes = await adminPool.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (existsRes.rowCount === 0) {
    console.log('✨ Creating database "master_db"...');
    await adminPool.query(`CREATE DATABASE "${dbName}"`);
    console.log('✅ Database "master_db" created.');
  } else {
    console.log('✅ Database "master_db" already exists.');
  }
}

function makeMasterPool() {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: 'master_db',
  });
}

async function ensureSchoolsTable() {
  const masterPool = makeMasterPool();
  try {
    await masterPool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        school_name VARCHAR(255) NOT NULL,
        institute_number VARCHAR(50) NOT NULL UNIQUE,
        db_name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Upsert three schools
    await masterPool.query(
      `
      INSERT INTO schools (id, school_name, institute_number, db_name)
      VALUES
        (1, 'Existing School', '1111', 'school_db'),
        (2, 'Millat',         '2222', 'millat_db'),
        (3, 'Iqra',           '3333', 'iqra_db')
      ON CONFLICT (institute_number) DO UPDATE
        SET school_name = EXCLUDED.school_name,
            db_name = EXCLUDED.db_name
      `
    );

    console.log('✅ schools table ensured and seeded in master_db.');
  } finally {
    await masterPool.end();
  }
}

async function main() {
  try {
    await ensureMasterDb();
    await ensureSchoolsTable();
    console.log('=== master_db initialization complete ===');
  } catch (err) {
    console.error('❌ Failed to initialize master_db:', err);
    process.exitCode = 1;
  } finally {
    await adminPool.end();
  }
}

main();

