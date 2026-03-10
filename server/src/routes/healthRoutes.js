const express = require('express');
const { healthCheck, databaseTest, tenantDatabaseTest } = require('../controllers/healthController');

const router = express.Router();

// Health check endpoint
router.get('/health', healthCheck);

// Database test endpoint
router.get('/health/database', databaseTest);

// Tenant database connectivity test (secure in production via TENANT_HEALTH_TOKEN header)
router.get('/health/tenants', tenantDatabaseTest);

module.exports = router;
