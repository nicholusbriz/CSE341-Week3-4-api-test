const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Public routes
router.get('/', getUsers);
router.get('/:id', getUser);

// Protected routes (require authentication)
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
