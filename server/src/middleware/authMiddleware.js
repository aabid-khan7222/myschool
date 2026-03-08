const jwt = require('jsonwebtoken');
const serverConfig = require('../config/server');
const { error: errorResponse } = require('../utils/responseHelper');

const isPublicPath = (path) => {
  const p = path || '';
  return p.includes('/auth/login') || p === '/health' || p.startsWith('/health/');
};

/**
 * Optional auth - skip for public paths, verify for others
 */
const protectApi = (req, res, next) => {
  const path = req.path.replace(/^\/api/, '') || req.path;
  if (isPublicPath(path)) {
    return next();
  }
  return authenticate(req, res, next);
};

/**
 * Verify JWT token and attach user to request.
 * Accepts token from: (1) HTTP-only cookie auth_token, (2) Authorization: Bearer <token>
 */
const authenticate = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.auth_token || null;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    if (!serverConfig.jwtSecret) {
      return errorResponse(res, 500, 'Server configuration error');
    }

    const decoded = jwt.verify(token, serverConfig.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired. Please login again.');
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token.');
    }
    errorResponse(res, 401, 'Authentication failed');
  }
};

module.exports = { authenticate, protectApi };
