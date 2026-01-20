const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper: Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Helper: Send Token in Cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        ),
        httpOnly: true, // Prevent JS access (XSS protection)
        secure: process.env.NODE_ENV === 'production', // True in production, False in dev
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // None for cross-site in prod (if needed), Lax for dev
        path: '/' // Ensure cookie is valid for entire site
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            // token // Optional: Remove token from body if you want pure cookie-only auth
        });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        // If user is a seller, create a default seller profile
        if (role === 'seller') {
            const Seller = require('../models/Seller');
            await Seller.create({
                user: user._id,
                storeName: `${name}'s Store`, // Default store name
                storeDescription: `Welcome to ${name}'s store!`,
                contactEmail: email
            });
        }

        if (user) {
            sendTokenResponse(user, 201, res);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { block_email, email, password } = req.body; // Handle potential frontend quirks/renaming
    const loginEmail = email || block_email;

    try {
        // Check for user email
        // 'select("+password")' is needed because we set select:false in schema
        const user = await User.findOne({ email: loginEmail }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            sendTokenResponse(user, 200, res);
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is set by the protect middleware
    res.status(200).json(req.user);
};

// @desc    Log out user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Google Auth Callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = (req, res) => {
    const token = generateToken(req.user._id);

    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    };

    res
        .cookie('token', token, options)
        .redirect('http://localhost:3000'); // Redirect to Frontend
};

// @desc    GitHub Auth Callback
// @route   GET /api/auth/github/callback
// @access  Public
const githubAuthCallback = (req, res) => {
    const token = generateToken(req.user._id);

    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    };

    res
        .cookie('token', token, options)
        .redirect('http://localhost:3000'); // Redirect to Frontend
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    googleAuthCallback,
    githubAuthCallback
};
