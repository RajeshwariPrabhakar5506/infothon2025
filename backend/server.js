// 1. Import dependencies
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // <-- IMPORT YOUR DB CONNECTION

// 2. Load environment variables
dotenv.config();

// 3. Connect to MongoDB
connectDB(); // <-- CALL THE CONNECTION FUNCTION

// 4. Create express app
const app = express();
const PORT = process.env.PORT || 5000;

// 5. Define a simple test route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the GreenSort API!' });
});

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});