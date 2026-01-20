const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const passport = require('passport');

const path = require('path');

// Passport Config
require('./config/passport')(passport);

// Middleware
// Middleware


const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[ServerDebug] Request from Origin: ${req.headers.origin}`);
    console.log(`[ServerDebug] Cookies received:`, req.cookies);
    next();
});
app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// app.use('/api/users', require('./routes/userRoutes')); // Commented out as file does not exist
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sellers', require('./routes/sellerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));



// Basic Route
app.get('/', (req, res) => {
    res.send('VaultHub Backend is Running! 🚀');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
