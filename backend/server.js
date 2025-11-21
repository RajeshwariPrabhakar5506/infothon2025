// --- MUST BE FIRST ---
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');
const locationRoutes = require('./routes/locationRoutes');
const path = require('path');
const identificationRoutes = require('./routes/identificationRoutes');
const pickupRoutes = require('./routes/pickupRoutes');

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Pickup routes
app.use('/api/pickups', pickupRoutes);

// --- API ROUTES ---
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the GreenSort API!' });
});

// Route groups
app.use('/api/auth', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/identify', identificationRoutes);

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ERROR HANDLERS ---
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
