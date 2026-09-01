import config from '../config/index.js';

const sanitizeProductionMessage = (message) => {
  if (
    typeof message === 'string' &&
    (message.includes('unable to authenticate data') ||
      message.includes('Unsupported state'))
  ) {
    return 'Authentication service error. Please contact the administrator.';
  }

  return message;
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const rawMessage = err.message || 'Internal Server Error';
  const message =
    config.env === 'production'
      ? sanitizeProductionMessage(rawMessage)
      : rawMessage;

  if (config.env === 'development') {
    console.error(err);
  } else if (statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}] ${rawMessage}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
