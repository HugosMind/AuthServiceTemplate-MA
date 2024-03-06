import { Request, Response } from 'express';
import passport from 'passport';
import { loginUser } from '../../../src/controllers/authController';
import { generateAuthToken } from '../../../src/services/authService';

jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options, callback) => jest.fn())
}));
jest.mock('../../../src/services/authService');

describe('Login User', () => {
  it('should return a token if authentication is successful', async () => {
    // Simular la solicitud y la respuesta
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Simular el usuario devuelto por passport.authenticate
    const mockUser = {
      id: 1,
      email: 'test@example.com',
    };

    // Simular el token devuelto por generateAuthToken
    const mockToken = 'token';

    (passport.authenticate as jest.Mock).mockImplementation((strategy, options, callback) => {
      callback(null, mockUser);
      return (req: Request, res: Response) => {};
    });

    (generateAuthToken as jest.Mock).mockReturnValue(mockToken);

    await loginUser(req, res);

    // Verificar que se envió el token
    expect(res.json).toHaveBeenCalledWith({ token: mockToken });
  });

  it('should return 401 if authentication fails', async () => {
    // Simular la solicitud y la respuesta
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    } as unknown as Request;
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    // Simular que passport.authenticate llama a su callback con un error
    const mockError = new Error('Authentication error');
    (passport.authenticate as jest.Mock).mockImplementation((strategy, options, callback) => {
      callback(mockError, null);
      return (req: Request, res: Response) => {};
    });
  
    await loginUser(req, res);
  
    // Verificar que se envió una respuesta de error
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });
});