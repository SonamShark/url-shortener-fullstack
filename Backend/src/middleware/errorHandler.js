class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const notFound = (req, res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error("[error]", err);
  res.status(status).json({
    message: err.message || "Internal server error",
  });
};

module.exports = { HttpError, notFound, errorHandler };
