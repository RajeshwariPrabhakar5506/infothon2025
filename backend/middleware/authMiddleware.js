// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 1. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. Find the user in the DB (exclude password) and attach to request
      req.user = await User.findById(decoded.userId).select('-password');

      next(); // Proceed to the next middleware/route
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };