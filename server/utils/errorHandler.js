const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`Error: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

/**
 * Helper function to create custom errors with status codes
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 */
export const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export default errorHandler;
