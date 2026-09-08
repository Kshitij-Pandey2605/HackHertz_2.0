/**
 * Standard API response helper
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, error = 'An error occurred', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: typeof error === 'string' ? error : error.message || 'Internal Server Error',
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
