import { Request, Response, NextFunction } from 'express';

// Middleware for handling 404 Not Found
const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler middleware
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId error
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource Not Found!';
    statusCode = 404;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'prod' ? '...' : err.stack,
  });
};

export { notFound, errorHandler };
