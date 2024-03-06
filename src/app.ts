import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import './config/passport';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

export default app;