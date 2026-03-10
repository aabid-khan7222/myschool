const { testConnection, query } = require('../config/database');
const { Pool } = require('pg');

function shouldUseSsl(connectionString) {
  if (process.env.FORCE_DB_SSL === 'true') return true;
  if (!connectionString) return false;
  try {
    const u = new URL(connectionString);
    const sslmode = (u.searchParams.get('sslmode') || '').toLowerCase();
    if (sslmode === 'require' || sslmode === 'verify-full' || sslmode === 'verify-ca') return true;
  } catch {
    // ignore
  }
  return process.env.NODE_ENV === 'production';
}

function getSslConfig(connectionString) {
  if (!shouldUseSsl(connectionString)) return undefined;
  if (process.env.DATABASE_SSL_MODE === 'require') return { rejectUnauthorized: true };
  return { rejectUnauthorized: false };
}

async function testDbUrl(label, connectionString) {
  const started = Date.now();
  const pool = new Pool({
    connectionString,
    ssl: getSslConfig(connectionString),
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
    application_name: `myschool-health-${label}`,
  });
  try {
    const r = await pool.query('SELECT current_database() AS db, current_user AS usr, NOW() AS now');
    return {
      ok: true,
      ms: Date.now() - started,
      db: r.rows[0]?.db,
      user: r.rows[0]?.usr,
    };
  } catch (e) {
    return {
      ok: false,
      ms: Date.now() - started,
      error: e.message,
    };
  } finally {
    await pool.end().catch(() => {});
  }
}

const healthCheck = async (req, res) => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    // Get server uptime
    const uptime = process.uptime();
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)} minutes ${Math.floor(uptime % 60)} seconds`,
      database: {
        connected: dbConnected,
        status: dbConnected ? 'Connected' : 'Disconnected'
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
      },
      environment: process.env.NODE_ENV || 'development'
    };

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed'
    });
  }
};

const databaseTest = async (req, res) => {
  try {
    // Test a simple query
    const result = await query('SELECT NOW() as current_time, version() as postgres_version');
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Database connection and query test successful',
      data: {
        currentTime: result.rows[0].current_time,
        postgresVersion: result.rows[0].postgres_version
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database test failed'
    });
  }
};

/**
 * Tenant DB connectivity test (for production verification without shell access).
 *
 * Security:
 * - In production requires header `x-tenant-health-token` matching env TENANT_HEALTH_TOKEN.
 * - In development it is allowed without token.
 */
const tenantDatabaseTest = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
      const expected = (process.env.TENANT_HEALTH_TOKEN || '').toString().trim();
      const got = (req.headers['x-tenant-health-token'] || '').toString().trim();
      if (!expected || got !== expected) {
        return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
      }
    }

    const results = {};

    // Primary
    if (process.env.DATABASE_URL) {
      results.primary = await testDbUrl('primary', process.env.DATABASE_URL);
    } else {
      results.primary = { ok: false, error: 'DATABASE_URL not set' };
    }

    // Master
    if (process.env.MASTER_DATABASE_URL) {
      results.master = await testDbUrl('master', process.env.MASTER_DATABASE_URL);
    } else if (process.env.DATABASE_URL) {
      const u = new URL(process.env.DATABASE_URL);
      u.pathname = `/${process.env.MASTER_DB_NAME || 'master_db'}`;
      results.master = await testDbUrl('master-derived', u.toString());
    } else {
      results.master = { ok: false, error: 'MASTER_DATABASE_URL and DATABASE_URL not set' };
    }

    // Tenants (overrides)
    if (process.env.MILLAT_DATABASE_URL) {
      results.millat = await testDbUrl('millat', process.env.MILLAT_DATABASE_URL);
    } else {
      results.millat = { ok: false, error: 'MILLAT_DATABASE_URL not set' };
    }

    if (process.env.IQRA_DATABASE_URL) {
      results.iqra = await testDbUrl('iqra', process.env.IQRA_DATABASE_URL);
    } else {
      results.iqra = { ok: false, error: 'IQRA_DATABASE_URL not set' };
    }

    const allOk = Object.values(results).every((r) => r && r.ok === true);
    res.status(allOk ? 200 : 500).json({
      status: allOk ? 'SUCCESS' : 'ERROR',
      data: results,
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Tenant DB test error:', error);
    res.status(500).json({ status: 'ERROR', message: 'Tenant DB test failed' });
  }
};

module.exports = {
  healthCheck,
  databaseTest,
  tenantDatabaseTest,
};
