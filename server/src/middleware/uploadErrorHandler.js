import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, 'Banner image must be 5MB or smaller'));
    }

    return next(new ApiError(400, err.message));
  }

  next(err);
};

export default errorHandler;
