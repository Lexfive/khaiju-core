import ApiError from '../utils/ApiError.js';

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message, code: err.code });
  }
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' });
};

export default errorMiddleware;