const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');
const locationRoutes = require('./routes/locationRoutes');
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

// --- MIDDLEWARE ---
// Body parser middleware to accept JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// --- API ROUTES ---
// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the GreenSort API!' });
});

// All user auth routes will be prefixed with /api/auth
app.use('/api/auth', userRoutes);
app.use('/api/locations', locationRoutes);

// --- ERROR HANDLING MIDDLEWARE ---
// These must be at the end
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});