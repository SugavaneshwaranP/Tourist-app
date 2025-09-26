import express from 'express';
import { signup, login, verifyEmail, verifyPhone, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/verify-phone', verifyPhone);
router.get('/me', protect, getMe);

export default router;