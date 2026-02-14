/**
 * Standardized API response helpers
 * Use these for consistent success/error format across all endpoints
 */

const success = (res, statusCode = 200, message = 'Success', data = null, extra = {}) => {
  const body = {
    status: 'SUCCESS',
    message,
    ...extra
  };
  if (data !== null && data !== undefined) {
    body.data = data;
  }
  return res.status(statusCode).json(body);
};

const error = (res, statusCode = 500, message = 'Something went wrong') => {
  return res.status(statusCode).json({
    status: 'ERROR',
    message
  });
};

module.exports = { success, error };
