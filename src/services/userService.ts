import { UserModel } from '../models/userModel';

export const createUser = async (email: string, password: string, firstName?: string, lastName?: string) => {

  const user = UserModel.create({ email, password, first_name: firstName, last_name: lastName });
  await user.hashPassword();
  await user.save();

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUser = async (id: number) => {
  const user = await UserModel.findOne(id);
  if (user) {
    // Exclude the password property from the user object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return null;
};

export const updateUser = async (userId: number, updateFields: { [key: string]: any }) => {
  const allowedFields = ['first_name', 'last_name', 'email', 'password'];
  // Filter out fields that are not allowed to be updated
  const fieldsToUpdate = Object.keys(updateFields)
    .filter(key => allowedFields.includes(key) && updateFields[key] != null)
    .reduce((obj, key) => {
      obj[key] = updateFields[key];
      return obj;
    }, {} as { [key: string]: any });

  // If there are no fields to update, return null
  if (Object.keys(fieldsToUpdate).length === 0) {
    return null;
  }

  // If the password field is included, hash the password
  if (fieldsToUpdate.password) {
    const user = new UserModel();
    user.password = fieldsToUpdate.password;
    await user.hashPassword();
    fieldsToUpdate.password = user.password;
  }

  await UserModel.update(userId, fieldsToUpdate);

  const updatedUser = await UserModel.findOne(userId);

  if (updatedUser) {
    // Exclude the password property from the user object
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  return null;
};
