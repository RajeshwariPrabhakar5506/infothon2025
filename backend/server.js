// 1. Import dependencies
const express = require('express');
const dotenv = require('dotenv');

// 2. Load environment variables
dotenv.config();

// 3. Create express app
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Define a simple test route
// This just helps us test that the server is working
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the GreenSort API!' });
});

// 5. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});