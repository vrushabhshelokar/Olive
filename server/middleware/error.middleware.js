function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred.';

  // Log detailed error on server side for debugging
  console.error(`[Error Middleware] Status ${statusCode}:`, err);

  const errorPayload = {
    message
  };

  if (err.existingSessionId) {
    errorPayload.existingSessionId = err.existingSessionId;
  }

  res.status(statusCode).json({
    success: false,
    error: errorPayload
  });
}

module.exports = {
  errorHandler
};
