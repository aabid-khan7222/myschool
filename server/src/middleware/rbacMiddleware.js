/**
 * Role-based access control middleware
 * Use after authenticate/protectApi - req.user must have role_id
 */
const { error: errorResponse } = require('../utils/responseHelper');

function parseRoleId(value) {
  const roleId = value != null ? parseInt(value, 10) : null;
  return Number.isInteger(roleId) ? roleId : null;
}

function parseRoleName(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * Require user to have one of the allowed role IDs
 * @param {number[]} allowedRoleIds - e.g. [1] for Admin only
 */
const requireRole = (allowedRoleIds) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return errorResponse(res, 401, 'Not authenticated');
    }
    const roleId = parseRoleId(user.role_id);
    if (!Array.isArray(allowedRoleIds)) {
      return errorResponse(res, 403, 'Access denied. Insufficient permissions.');
    }
    const normalizedAllowedIds = allowedRoleIds
      .map((id) => parseRoleId(id))
      .filter((id) => id != null);
    const isAllowedById = roleId != null && normalizedAllowedIds.includes(roleId);
    if (!isAllowedById) {
      return errorResponse(res, 403, 'Access denied. Insufficient permissions.');
    }
    next();
  };
};

/**
 * Require user to have one of the allowed roles (by name, case-insensitive)
 * @param {string[]} allowedRoleNames - e.g. ['Admin', 'Teacher']
 */
const requireRoleName = (allowedRoleNames) => {
  const normalized = (allowedRoleNames || []).map((n) => String(n).toLowerCase());
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return errorResponse(res, 401, 'Not authenticated');
    }
    const roleName = parseRoleName(user.role_name);
    if (!roleName) {
      return errorResponse(res, 403, 'Access denied. Insufficient permissions.');
    }
    const isAllowedByName = normalized.includes(roleName);
    if (!isAllowedByName) {
      return errorResponse(res, 403, 'Access denied. Insufficient permissions.');
    }
    next();
  };
};

module.exports = { requireRole, requireRoleName };
