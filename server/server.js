// Load env first (local .env; on Render, env is injected by platform)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import configurations
const serverConfig = require('./src/config/server');
const { testConnection } = require('./src/config/database');
const { error: errorResponse } = require('./src/utils/responseHelper');

// Import routes
const healthRoutes = require('./src/routes/healthRoutes');
const academicYearRoutes = require('./src/routes/academicYearRoutes');
const classRoutes = require('./src/routes/classRoutes');
const sectionRoutes = require('./src/routes/sectionRoutes');
const subjectRoutes = require('./src/routes/subjectRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const bloodGroupRoutes = require('./src/routes/bloodGroupRoutes');
const religionRoutes = require('./src/routes/religionRoutes');
const castRoutes = require('./src/routes/castRoutes');
const motherTongueRoutes = require('./src/routes/motherTongueRoutes');
const parentRoutes = require('./src/routes/parentRoutes');
const guardianRoutes = require('./src/routes/guardianRoutes');
const houseRoutes = require('./src/routes/houseRoutes');
const addressRoutes = require('./src/routes/addressRoutes');
const transportRoutes = require('./src/routes/transportRoutes');
const classScheduleRoutes = require('./src/routes/classScheduleRoutes');
const hostelRoutes = require('./src/routes/hostelRoutes');
const hostelRoomRoutes = require('./src/routes/hostelRoomRoutes');
const roomTypeRoutes = require('./src/routes/roomTypeRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const designationRoutes = require('./src/routes/designationRoutes');
const userRoutes = require('./src/routes/userRoutes');
const userRoleRoutes = require('./src/routes/userRoleRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const leaveApplicationRoutes = require('./src/routes/leaveApplicationRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { protectApi } = require('./src/middleware/authMiddleware');

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
// CORS: localhost in dev; in production set CORS_ORIGIN to your frontend URL (e.g. https://your-static.onrender.com)
const corsOrigins = ['http://localhost:3000', 'http://localhost:5173'];
if (serverConfig.corsOrigin) {
  const extra = serverConfig.corsOrigin.split(',').map((s) => s.trim()).filter(Boolean);
  corsOrigins.push(...extra);
}
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  message: { status: 'ERROR', message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Auth routes - public, no token needed
app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);

// Protect all other API routes - require valid JWT
app.use('/api', protectApi);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/blood-groups', bloodGroupRoutes);
app.use('/api/religions', religionRoutes);
app.use('/api/casts', castRoutes);
app.use('/api/mother-tongues', motherTongueRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/class-schedules', classScheduleRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/hostel-rooms', hostelRoomRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave-applications', leaveApplicationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PreSkool School Management API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  errorResponse(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
});

// Global error handler - never leak internal error details to client
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  errorResponse(res, 500, 'Internal server error');
});

// Start server
const startServer = async () => {
  try {
    // Production: require DATABASE_URL (no localhost fallback)
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv === 'production') {
      if (!process.env.DATABASE_URL) {
        console.error('❌ Production requires DATABASE_URL. Add it in Render → Environment.');
        process.exit(1);
      }
      if (!process.env.JWT_SECRET) {
        console.error('❌ Production requires JWT_SECRET. Add it in Render → Environment.');
        process.exit(1);
      }
    }

    // Test database connection (exits with 1 on failure)
    console.log('🔍 Testing database connection...');
    await testConnection();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('🚀 Server is running!');
      console.log(`📍 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${serverConfig.nodeEnv}`);
      console.log('📋 Available endpoints:');
      console.log(`   GET  http://localhost:${serverConfig.port}/`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/health`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/health/database`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/academic-years`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/academic-years/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/classes`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/classes/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/sections`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/sections/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/subjects`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/subjects/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/subjects/class/:classId`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/teachers`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/teachers/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/teachers/class/:classId`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/students`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/students/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/students/class/:classId`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/blood-groups`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/blood-groups/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/religions`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/religions/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/casts`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/casts/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/mother-tongues`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/mother-tongues/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/houses`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/houses/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/addresses`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/addresses/:id`);
      console.log(`   GET  http://localhost:${serverConfig.port}/api/addresses/user/:userId`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
