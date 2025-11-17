// backend/controllers/userController.js
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // 1. Get email and password from request body
  const { name, email, password } = req.body;

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // 400 Bad Request
    throw new Error('User already exists');
  }

  // 3. Create new user
  // The 'pre-save' hook in userModel.js will automatically hash the password
  const user = await User.create({
    'profile.name': name,
    email,
    password,
  });

  // 4. If user was created, generate token and send response
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({ // 201 Created
      _id: user._id,
      name: user.profile.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token (login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists AND if password matches
  // We use the matchPassword method we created in userModel.js
  if (user && (await user.matchPassword(password))) {
    // 3. Generate token and send response
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.profile.name,
      email: user.email,
    });
  } else {
    // 4. If user or password don't match, send error
    res.status(401); // 401 Unauthorized
    throw new Error('Invalid email or password');
  }
});
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // The user is already attached to req by the protect middleware
  const user = {
    _id: req.user._id,
    name: req.user.profile.name,
    email: req.user.email,
  };

  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};