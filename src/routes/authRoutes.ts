import express from 'express';
import * as authController from '../controllers/authController';
import { loginValidation } from '../middleware/userValidations';

const router = express.Router();

router.post('/login', loginValidation, authController.loginUser);

export default router;