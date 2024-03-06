import bcrypt from 'bcrypt';
import { UserModel } from '../../../src/models/userModel';

jest.mock('bcrypt');

  describe('User Hash Password', () => {
    it('should hash the user password', async () => {
      // Simular el hash devuelto por bcrypt.hash
      const mockHash = 'hashedpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const user = new UserModel();
      user.password = 'password';

      await user.hashPassword();

      // Verificar que bcrypt.hash fue llamado con los argumentos correctos
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);

      // Verificar que la contraseña del usuario se cambió al hash
      expect(user.password).toBe(mockHash);
    });
  });

  describe('User Verify Password', () => {
    it('should verify a candidate password against the user password', async () => {
      // Simular el resultado devuelto por bcrypt.compare
      const mockResult = true;
      (bcrypt.compare as jest.Mock).mockResolvedValue(mockResult);

      const user = new UserModel();
      user.password = 'hashedpassword';

      const result = await user.verifyPassword('password');

      // Verificar que bcrypt.compare fue llamado con los argumentos correctos
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');

      // Verificar que se devolvió el resultado de bcrypt.compare
      expect(result).toBe(mockResult);
    });
  });