import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import app from '../../src/app';
import { UserModel } from '../../src/models/userModel';
import { generateAuthToken } from '../../src/services/authService';

describe('User CRUD operations', () => {
  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [UserModel],
      synchronize: true,
      logging: false,
    });
  });

  afterAll(async () => {
    await UserModel.delete({});
    await getConnection().close();
  });

    describe('Register user', () => {
        afterEach(async () => {
            await UserModel.delete({});
        });

        it('should create a new user and return 201 status', async () => {
            const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'Qwer123!',
                first_name: 'Test',
                last_name: 'User',
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            expect(res.body.user).toHaveProperty('first_name', 'Test');
            expect(res.body.user).toHaveProperty('last_name', 'User');
        });

        it('should create a user without a first name or last name', async () => {
            const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'Qwer123!',
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            // Verify that first_name and last_name are null
            expect(res.body.user.first_name).toBeNull();
            expect(res.body.user.last_name).toBeNull();
        });

        it('should fail if email is missing', async () => {
            const res = await request(app)
            .post('/api/users/register')
            .send({
                password: 'Qwer123!',
                first_name: 'Test',
                last_name: 'User',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
            expect(res.body).toHaveProperty('details');
            expect(res.body.details).toHaveLength(1);
            expect(res.body.details[0]).toHaveProperty('msg', 'Must be a valid email');
            expect(res.body.details[0]).toHaveProperty('path', 'email');
        });

        it('should fail if password is missing', async () => {
            const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
            expect(res.body).toHaveProperty('details');
            expect(res.body.details).toHaveLength(2);
            expect(res.body.details[0]).toHaveProperty('msg', 'Password must be at least 6 characters long');
            expect(res.body.details[0]).toHaveProperty('path', 'password');
            expect(res.body.details[1]).toHaveProperty('msg', 'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character');
            expect(res.body.details[0]).toHaveProperty('path', 'password');
        });

        it('should fail if password does not meet complexity requirements', async () => {
            const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'password',
                first_name: 'Test',
                last_name: 'User',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
            expect(res.body).toHaveProperty('details');
            expect(res.body.details).toHaveLength(1);
            expect(res.body.details[0]).toHaveProperty('msg', 'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character');
            expect(res.body.details[0]).toHaveProperty('path', 'password');
        });

        it('should fail if first name contains non-alphabetic characters', async () => {
            const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'Qwer123!',
                first_name: 'Test123',
                last_name: 'User',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
            expect(res.body).toHaveProperty('details');
            expect(res.body.details).toHaveLength(1);
            expect(res.body.details[0]).toHaveProperty('msg', 'First name must contain only alphabetic characters');
            expect(res.body.details[0]).toHaveProperty('path', 'first_name');
        });

        it('should fail if last name contains non-alphabetic characters', async () => {
            const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'Qwer123!',
                first_name: 'Test',
                last_name: 'User123',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
            expect(res.body).toHaveProperty('details');
            expect(res.body.details).toHaveLength(1);
            expect(res.body.details[0]).toHaveProperty('msg', 'Last name must contain only alphabetic characters');
            expect(res.body.details[0]).toHaveProperty('path', 'last_name');
        });

        it('should fail if email is already in use', async () => {
            await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'Qwer123!',
                first_name: 'Test',
                last_name: 'User',
            });

            // Create a second user with the same email
            const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'Qwer123!',
                first_name: 'Test',
                last_name: 'UserTwo',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
            expect(res.body).toHaveProperty('details');
            expect(res.body.details).toHaveLength(1);
            expect(res.body.details[0]).toHaveProperty('msg', 'Email is already in use');
            expect(res.body.details[0]).toHaveProperty('path', 'email');
        });
    });

    describe('Update user Info', () => {
        let user: UserModel;
        let token: string;

        beforeAll(async () => {
          user = UserModel.create({
            email: 'test@example.com',
            password: 'password',
          });
          await user.save();

          token = generateAuthToken(user);
        });

        afterAll(async () => {
            await UserModel.delete({});
        });

        it('should return the profile of the authenticated user', async () => {
            const res = await request(app)
              .get('/api/users/profile')
              .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('id', user.id);
            expect(res.body.user).toHaveProperty('email', user.email);
          });

        it('should return a 401 error if the user is not authenticated', async () => {
            const res = await request(app)
                .get('/api/users/profile');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should return a 401 error if the JWT token is invalid', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'Bearer invalidtoken');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should return a 401 error if the user has been deleted', async () => {
            await UserModel.delete(user);

            const res = await request(app)
              .get('/api/users/profile')
              .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });

    describe('Update user profile', () => {
        let user: UserModel;
        let token: string;

        beforeAll(async () => {
            user = UserModel.create({
            email: 'test@example.com',
            password: 'password',
            });
            await user.save();

            token = generateAuthToken(user);
        });

        afterAll(async () => {
            await UserModel.delete({});
        });

        it('should allow an authenticated user to update their profile', async () => {
            const res = await request(app)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'updated@example.com',
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', 'updated@example.com');
        });

        it('should return a 401 error if the user is not authenticated', async () => {
            const res = await request(app)
            .put('/api/users/profile')
            .send({
                email: 'updated@example.com',
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should return a validation error if the input is invalid', async () => {
            const res = await request(app)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'not an email',
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
            expect(res.body).toHaveProperty('details');
            expect(res.body.details).toHaveLength(1);
            expect(res.body.details[0]).toHaveProperty('msg', 'Email is not valid');
            expect(res.body.details[0]).toHaveProperty('path', 'email');
        });

        it('should not make changes if the input is the same as the existing data', async () => {
            const res = await request(app)
              .put('/api/users/profile')
              .set('Authorization', `Bearer ${token}`)
              .send({
                email: 'test@example.com',
              });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
          });
    });
});
