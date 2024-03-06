import { Meta, body } from 'express-validator';
import { UserModel } from '../models/userModel';

const passwordValidationRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;
const checkEmailInUse = async (email: string, { req }: Meta) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser && (!req.user || existingUser.id !== req.user.id)) {
    throw new Error('Email is already in use');
  }
  return true;
}

export const createUserValidation = [
  body('email').isEmail().withMessage('Must be a valid email')
    .normalizeEmail()
    .custom(checkEmailInUse),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(passwordValidationRegExp)
    .withMessage('Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character'),
  body('first_name')
    .optional()
    .notEmpty().withMessage('First name is required')
    .isAlpha().withMessage('First name must contain only alphabetic characters'),
  body('last_name')
    .optional()
    .notEmpty().withMessage('Last name is required')
    .isAlpha().withMessage('Last name must contain only alphabetic characters'),
];

export const updateUserValidation = [
  body('first_name')
    .optional()
    .notEmpty().withMessage('First name is required')
    .isAlpha().withMessage('First name must contain only alphabetic characters'),
  body('last_name')
    .optional()
    .notEmpty().withMessage('Last name is required')
    .isAlpha().withMessage('Last name must contain only alphabetic characters'),
  body('email')
    .optional().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is not valid')
    .normalizeEmail()
    .custom(checkEmailInUse),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(passwordValidationRegExp)
      .withMessage('Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character'),
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];