const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect Routes - Verifies JWT
const protect = async (req, res, next) => {
    let token;

    console.log('[AuthDebug] Request Headers:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('[AuthDebug] Cookies:', req.cookies ? Object.keys(req.cookies) : 'No cookies');

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Get token from header (Format: "Bearer <token>")
        token = req.headers.authorization.split(' ')[1];
        console.log('[AuthDebug] Token found in Header');
    } else if (req.cookies.token) {
        // Check for token in cookies
        token = req.cookies.token;
        console.log('[AuthDebug] Token found in Cookie');
    }

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('[AuthDebug] Token verified for User ID:', decoded.id);

            // Get user from the token id and attach to request object
            // select('-password') means don't include password in the user object
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log('[AuthDebug] User not found in DB for ID:', decoded.id);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error('[AuthDebug] Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log('[AuthDebug] No token found in request');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// RBAC - Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
