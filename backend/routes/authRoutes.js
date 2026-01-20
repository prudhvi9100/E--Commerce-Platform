const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser, logoutUser, getMe, googleAuthCallback, githubAuthCallback } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthCallback);

// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), githubAuthCallback);

module.exports = router;
