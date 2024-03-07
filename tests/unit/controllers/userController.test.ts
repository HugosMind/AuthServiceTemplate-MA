import { Request, Response } from 'express';
import * as userService from '../../../src/services/userService';
import { createUser, getUserProfile, updateUserProfile } from '../../../src/controllers/userController';
import { UnauthorizedError, ValidationError } from '../../../src/errors/validationError';
import { updateUser } from '../../../src/services/userService';

jest.mock('../../../src/services/userService');

describe('Create User', () => {
  it('should create a user and return a success response', async () => {
    // Simulate the request and response
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

    // Simulate the user returned by userService.createUser
    const { password, ...userWithoutPassword } = userPayload;
    (userService.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      ...userWithoutPassword,
    });

    await createUser(req, res, next);

    // Verify that userService.createUser was called with the correct arguments
    expect(userService.createUser).toHaveBeenCalledWith(
      req.body.email,
      req.body.password,
      req.body.first_name,
      req.body.last_name
    );

    // Verify that the response was sent with the correct data
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

    // Verify that next was not called (no errors occurred)
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

    // Simulate that userService.createUser throws a database error
    const dbError = new Error('Database error');
    (userService.createUser as jest.Mock).mockRejectedValue(dbError);

    await createUser(req, res, next);

    // Verify that userService.createUser was called with the correct arguments
    expect(userService.createUser).toHaveBeenCalledWith(
      req.body.email,
      req.body.password,
      req.body.first_name,
      req.body.last_name
    );

    // Verify that next was called with the database error
    expect(next).toHaveBeenCalledWith(dbError);

    // Verify that the response was not sent
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('Get User', () => {
    it('should return user profile if user is authenticated', async () => {
        // Simulate the request and response
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

        // Simulate the user returned by userService.getUser
        const mockUser = {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        };

        (userService.getUser as jest.Mock).mockResolvedValue(mockUser);

        await getUserProfile(req, res, next);

        // Verify that userService.getUser was called with the correct arguments
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User profile', user: mockUser });

        // Verify that next was not called
        expect(res.status).not.toHaveBeenCalledWith(404);
        expect(next).not.toHaveBeenCalled();
      });

      it('should call next with UnauthorizedError if user is not authenticated', async () => {
        // Simulate the request and response
        const req = {} as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        await getUserProfile(req, res, next);

        // Verify that next was called with UnauthorizedError
        expect(next).toHaveBeenCalledWith(new UnauthorizedError());

        // Verify that no response was sent
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });

      it('should return 404 if user is not found', async () => {
        // Simulate the request and response
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

        // Simulate that userService.getUser returns null
        (userService.getUser as jest.Mock).mockResolvedValue(null);

        await getUserProfile(req, res, next);

        // Verify that the response was sent with a 404 status
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });

        // Verify that next was not called
        expect(next).not.toHaveBeenCalled();
      });
});

describe('updateUserProfile controller', () => {
    it('should update user profile if validation passes', async () => {
      // Simulate the request and response
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

      // Simulate the user returned by userService.updateUser
      const mockUser = {
        id: 1,
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
      };

      (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      await updateUserProfile(req, res, next);

      // Verify that userService.updateUser was called with the correct arguments
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User profile updated successfully', user: mockUser });

      // Verify that next was not called (no errors)
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with the error if updateUser throws an error', async () => {
        // Simulate the request and response
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

        // Simulate that userService.updateUser throws an error
        const mockError = new Error('Database error');
        (userService.updateUser as jest.Mock).mockRejectedValue(mockError);

        await updateUserProfile(req, res, next);

        // Verify that userService.updateUser was called with the correct arguments
        expect(next).toHaveBeenCalledWith(mockError);

        // Verify that the response was not sent
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });
  });
