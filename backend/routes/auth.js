const express = require('express');
const {
  register,
  login,
  getProfile,
  logout
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const {
  registerValidation,
  loginValidation
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', auth, getProfile);
router.post('/logout', auth, logout);

module.exports = router;