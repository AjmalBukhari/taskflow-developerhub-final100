const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// ================= REGISTER =================
router.post('/register', authController.register);

// ================= LOGIN =================
router.post('/login', authController.login);

// ================= PROFILE GET =================
router.get('/me', auth, authController.getCurrentUser);

// ================= PROFILE UPDATE =================
router.put('/me', auth, authController.updateUser);

// ================= UPDATE PASSWORD =================
router.put('/me/password', auth, authController.updatePassword);

// ================= DELETE ACCOUNT =================
router.delete('/me', auth, authController.deleteUser);

module.exports = router;