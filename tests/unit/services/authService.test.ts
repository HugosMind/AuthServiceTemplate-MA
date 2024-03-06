import jwt from 'jsonwebtoken';
import { generateAuthToken } from '../../../src/services/authService';
import { UserModel } from '../../../src/models/userModel';

jest.mock('jsonwebtoken');

describe('Generate Auth JWToken', () => {

    it('should generate a JWT for the given user', () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
        } as UserModel;

        const mockToken = 'token';
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        const token = generateAuthToken(mockUser);

        // Verify that jwt.sign was called with the correct arguments
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser.id, email: mockUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Verify the token was returned
        expect(token).toBe(mockToken);
    });
});
