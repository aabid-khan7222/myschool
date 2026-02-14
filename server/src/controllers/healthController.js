const { testConnection, query } = require('../config/database');

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

module.exports = {
  healthCheck,
  databaseTest
};
