import { Request, Response, NextFunction } from 'express';
import { InternalError, UnauthorizedError, ValidationError } from '../errors/validationError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err.message);

  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message, details: err.validationErrors });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof InternalError) {
    res.status(500).json({ error: err.message, details: err.stack });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};