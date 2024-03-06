import express from 'express';
import * as userController from '../controllers/userController';
import { isJwtAuthenticated } from '../middleware/authMiddleware';
import { updateUserValidation, createUserValidation } from '../middleware/userValidations';

const router = express.Router();

// Route for user registration
router.post('/register', createUserValidation, userController.createUser);

// Route to get information of the authenticated user
router.get('/profile', isJwtAuthenticated, userController.getUserProfile);

// Route to update information of the authenticated user
router.put('/profile', isJwtAuthenticated, updateUserValidation, userController.updateUserProfile);

export default router;
