const User = require('../models/user');
const PasswordUtils = require('../utils/password');

class UserService {
  async createUser(userData) {
    // Check if email already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password
    PasswordUtils.validate(userData.password);

    // Hash password
    const hashedPassword = await PasswordUtils.hash(userData.password);

    // Create user
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword
    };

    return await User.create(userWithHashedPassword);
  }

  async findByEmail(email) {
    return await User.findByEmail(email);
  }

  async findById(id) {
    return await User.findById(id);
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async updateUser(id, updateData) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await User.update(id, updateData);
  }

  async toggleUserStatus(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await User.toggleStatus(id);
  }

  async validateCredentials(email, password) {
    const user = await User.findByEmail(email);
    if (!user || !user.is_active) {
      return null;
    }

    const isValidPassword = await PasswordUtils.compare(password, user.password);
    return isValidPassword ? user : null;
  }
}

module.exports = UserService;