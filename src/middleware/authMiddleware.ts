import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UserModel } from '../models/userModel';
import { generateAuthToken } from '../services/authService';
import { UnauthorizedError } from '../errors/validationError';

export const isJwtAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: UserModel, info: any) => {
    if (err) {
      return next(err);
    }
    //console.log('Info:', info);
    if (!user) {
      return next(new UnauthorizedError());
    }
    // Generates a new token with the same payload but a new expiration date
    const newToken = generateAuthToken(user);
    // Adds the new token to the response headers
    res.setHeader('Authorization', `Bearer ${newToken}`);

    // We will use this later in the controllers
    req.user = user;

    next();
  })(req, res, next);
};
