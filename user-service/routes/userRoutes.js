const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateToken, requireAdmin, checkAccess } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();
const userController = new UserController();

// Public routes
router.post('/register', validateRegistration, userController.register);
router.post('/login', validateLogin, userController.login);

// Protected routes
router.get('/users/:id', authenticateToken, checkAccess, userController.getUserById);
router.patch('/users/:id/toggle-status', authenticateToken, checkAccess, userController.toggleUserStatus);

// Admin only routes
router.get('/users', authenticateToken, requireAdmin, userController.getAllUsers);

module.exports = router;