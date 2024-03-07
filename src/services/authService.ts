import { UserModel } from '../models/userModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "Testing?";

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in .env file');
}

export const generateAuthToken = (user: UserModel) => {
  const expiresIn = '1h';
  const { id, email } = user;

  return jwt.sign({ id, email }, jwtSecret, { expiresIn });
};
