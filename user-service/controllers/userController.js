const UserService = require('../services/userService');
const { generateToken } = require('../middleware/auth');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  register = async (req, res) => {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.validateCredentials(email, password);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials or user is blocked' });
      }

      const token = generateToken(user.id, user.email, user.role);
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  toggleUserStatus = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await this.userService.toggleUserStatus(userId);

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password, ...userWithoutPassword } = updatedUser;

      res.json({
        message: `User ${updatedUser.is_active ? 'activated' : 'blocked'} successfully`,
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

module.exports = UserController;