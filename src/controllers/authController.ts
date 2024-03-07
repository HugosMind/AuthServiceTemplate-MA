import { Request, Response } from 'express';
import passport from 'passport';
import { UserModel } from '../models/userModel';
import { generateAuthToken } from '../services/authService';

export const loginUser = (req: Request, res: Response) => {
  passport.authenticate('local', { session: false }, (err: Error, user: UserModel) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateAuthToken(user);
    return res.json({ token });
  })(req, res);
};
