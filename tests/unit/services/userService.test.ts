import { createUser, getUser, updateUser } from '../../../src/services/userService';
import { UserModel } from '../../../src/models/userModel';

jest.mock('../../../src/models/userModel');

describe('Create User', () => {

    it('should create a user and return it without the password', async () => {
        const mockUser = {
        email: 'test@example.com',
        password: 'hashedpassword',
        first_name: 'Test',
        last_name: 'User',
        hashPassword: jest.fn(),
        save: jest.fn(),
        };

        (UserModel.create as jest.Mock).mockReturnValue(mockUser);

        const user = await createUser('test@example.com', 'password', 'Test', 'User');

        // Verify that UserModel.create was called with the correct arguments
        expect(UserModel.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        first_name: 'Test',
        last_name: 'User',
        });

        // Verify that the password was hashed and the user was saved
        expect(mockUser.hashPassword).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalled();

        // Exclude the methods hashPassword and save from the object
        const { hashPassword, save, password, ...userWithoutMethods } = mockUser;
        // Verify that the user returned does not include the password
        expect(userWithoutMethods).toEqual({
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        });
    });

    it('should throw an error if UserModel.create throws an error', async () => {
        // Simulate UserModel.create throwing an error
        const mockError = new Error('User already exists');
        (UserModel.create as jest.Mock).mockImplementation(() => {
          throw mockError;
        });

        await expect(createUser('test@example.com', 'password', 'Test', 'User')).rejects.toThrow(mockError);
      });
});

describe('Get User', () => {

    it('should return a user without the password if the user exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        first_name: 'Test',
        last_name: 'User',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const user = await getUser(1);

      // Verify that UserModel.findOne was called with the correct id
      expect(UserModel.findOne).toHaveBeenCalledWith(1);

      // Verify that the password is not included in the returned user
      expect(user).toEqual({
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      });
    });

    it('should return null if the user does not exist', async () => {
      // Simulate UserModel.findOne returning null
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const user = await getUser(1);

      // Verify that UserModel.findOne was called with the correct id
      expect(UserModel.findOne).toHaveBeenCalledWith(1);

      // Verify that null was returned
      expect(user).toBeNull();
    });
});

describe('Update User', () => {

  beforeAll(() => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      first_name: 'Test',
      last_name: 'User',
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue({...mockUser, email: 'updated@example.com'});
    (UserModel.update as jest.Mock).mockResolvedValue(undefined);
  });

  it('should update a user and return it without the password if the update is valid', async () => {
    const updatedUser = await updateUser(1, { email: 'updated@example.com' });

    // Verify that UserModel.update was called with the correct arguments
    expect(UserModel.update).toHaveBeenCalledWith(1, { email: 'updated@example.com' });

    // Verify that UserModel.findOne was called with the correct id
    expect(UserModel.findOne).toHaveBeenCalledWith(1);

    // Verify that the returned user does not include the password
    expect(updatedUser).toEqual({
      id: 1,
      email: 'updated@example.com',
      first_name: 'Test',
      last_name: 'User',
    });
  });

  it('should return null if no allowed fields are sent', async () => {
    const updatedUser = await updateUser(1, { invalidField: 'value' });

    expect(UserModel.update).not.toHaveBeenCalled();
    expect(UserModel.findOne).not.toHaveBeenCalled();

    // Verify that null was returned
    expect(updatedUser).toEqual(null);
  });

  it('should return null if the user does not exist', async () => {
    // Simulate UserModel.findOne returning null
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const updatedUser = await updateUser(1, { email: 'updated@example.com' });

    // Verify that UserModel.update was called with the correct arguments
    expect(UserModel.update).toHaveBeenCalledWith(1, { email: 'updated@example.com' });

    // Verify that UserModel.findOne was called with the correct id
    expect(UserModel.findOne).toHaveBeenCalledWith(1);

    // Verify that null was returned
    expect(updatedUser).toBeNull();
  });
});
