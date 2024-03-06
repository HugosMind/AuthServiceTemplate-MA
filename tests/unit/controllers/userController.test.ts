import { Request, Response } from 'express';
import * as userService from '../../../src/services/userService';
import { createUser, getUserProfile, updateUserProfile } from '../../../src/controllers/userController';
import { UnauthorizedError, ValidationError } from '../../../src/errors/validationError';
import { updateUser } from '../../../src/services/userService';

jest.mock('../../../src/services/userService');

describe('Create User', () => {
  it('should create a user and return a success response', async () => {
    // Simular la solicitud y la respuesta
    const userPayload = {
        email: 'test@example.com',
        password: 'password',
        first_name: 'Test',
        last_name: 'User',
    };
    const req = {
      body: userPayload,
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    // Simular la respuesta de userService.createUser
    const { password, ...userWithoutPassword } = userPayload;
    (userService.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      ...userWithoutPassword,
    });

    await createUser(req, res, next);

    // Verificar que userService.createUser fue llamado con los argumentos correctos
    expect(userService.createUser).toHaveBeenCalledWith(
      req.body.email,
      req.body.password,
      req.body.first_name,
      req.body.last_name
    );

    // Verificar que se envió una respuesta de éxito
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user: {
        id: 1,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      },
    });

    // Verificar que next no fue llamado (no hubo errores)
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle database error', async () => {
    const userPayload = {
      email: 'test@example.com',
      password: 'password',
      first_name: 'Test',
      last_name: 'User',
    };
    const req = {
      body: userPayload,
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    // Simular un error de base de datos
    const dbError = new Error('Database error');
    (userService.createUser as jest.Mock).mockRejectedValue(dbError);

    await createUser(req, res, next);

    // Verificar que userService.createUser fue llamado con los argumentos correctos
    expect(userService.createUser).toHaveBeenCalledWith(
      req.body.email,
      req.body.password,
      req.body.first_name,
      req.body.last_name
    );

    // Verificar que next fue llamado con el error de base de datos
    expect(next).toHaveBeenCalledWith(dbError);

    // Verificar que no se envió ninguna respuesta
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('Get User', () => {
    it('should return user profile if user is authenticated', async () => {
        // Simular la solicitud y la respuesta
        const req = {
          user: {
            id: 1,
            email: 'test@example.com',
          },
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        // Simular el usuario devuelto por getUserService
        const mockUser = {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        };

        (userService.getUser as jest.Mock).mockResolvedValue(mockUser);

        await getUserProfile(req, res, next);

        // Verificar que se envió la información del usuario
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User profile', user: mockUser });

        // Verificar que no se envió ninguna respuesta de error
        expect(res.status).not.toHaveBeenCalledWith(404);
        expect(next).not.toHaveBeenCalled();
      });

      it('should call next with UnauthorizedError if user is not authenticated', async () => {
        // Simular la solicitud y la respuesta
        const req = {} as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        await getUserProfile(req, res, next);

        // Verificar que next fue llamado con un UnauthorizedError
        expect(next).toHaveBeenCalledWith(new UnauthorizedError());

        // Verificar que no se envió ninguna respuesta
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });

      it('should return 404 if user is not found', async () => {
        // Simular la solicitud y la respuesta
        const req = {
          user: {
            id: 1,
            email: 'test@example.com',
          },
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        // Simular que getUserService devuelve null
        (userService.getUser as jest.Mock).mockResolvedValue(null);

        await getUserProfile(req, res, next);

        // Verificar que se envió una respuesta de error
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });

        // Verificar que next no fue llamado
        expect(next).not.toHaveBeenCalled();
      });
});

describe('updateUserProfile controller', () => {
    it('should update user profile if validation passes', async () => {
      // Simular la solicitud y la respuesta
      const req = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
        body: {
          first_name: 'Updated',
          last_name: 'User',
          email: 'updated@example.com',
          password: 'updatedpassword',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next = jest.fn();

      // Simular el usuario devuelto por updateUserService
      const mockUser = {
        id: 1,
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
      };

      (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      await updateUserProfile(req, res, next);

      // Verificar que se envió la información del usuario actualizado
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User profile updated successfully', user: mockUser });

      // Verificar que no se envió ninguna respuesta de error
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with the error if updateUser throws an error', async () => {
        // Simular la solicitud y la respuesta
        const req = {
          user: {
            id: 1,
            email: 'test@example.com',
          },
          body: {
            first_name: 'Updated',
            last_name: 'User',
            email: 'updated@example.com',
            password: 'updatedpassword',
          },
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        // Simular que updateUserService lanza un error
        const mockError = new Error('Database error');
        (userService.updateUser as jest.Mock).mockRejectedValue(mockError);

        await updateUserProfile(req, res, next);

        // Verificar que next fue llamado con el error
        expect(next).toHaveBeenCalledWith(mockError);

        // Verificar que no se envió ninguna respuesta
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });
  });
