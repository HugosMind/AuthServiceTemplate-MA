import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as userService from '../services/userService';
import { UserModel } from '../models/userModel';
import { UnauthorizedError, ValidationError } from '../errors/validationError';
import { getUser } from '../services/userService';

export const createUser = async (req: Request, res: Response,  next: NextFunction) => {
  try {
    // Gets the validation result from the express-validator middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { email, password, first_name, last_name } = req.body;

    const userCreated = await userService.createUser(email, password, first_name, last_name);

    res.status(201).json({ message: 'User registered successfully', user: userCreated });
  } catch (error) {
    return next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const { id } = req.user as UserModel;
      // Gets the user from the database
      const user = await getUser(id);
      if (user) {
        res.status(200).json({ message: 'User profile', user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      // If req.user is not defined, the user is not authenticated
      return next(new UnauthorizedError());
    }
  };

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(new ValidationError(errors.array()));
        }

        const { first_name, last_name, email, password } = req.body;
        const userId = (req.user as UserModel).id;

        const updatedUser = await userService.updateUser(userId, { first_name, last_name, email, password });

        res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        return next(error)
    }
  };
