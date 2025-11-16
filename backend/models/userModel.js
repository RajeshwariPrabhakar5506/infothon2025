// backend/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      name: { type: String, default: '' },
      location: { type: String, default: '' },
    },
    preferences: {
      optIns: { type: Boolean, default: false },
    },
    // We'll add authTokens later with JWT
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// This 'pre' hook runs BEFORE a user is saved
// We use it to hash the password
userSchema.pre('save', async function (next) {
  // 'this' refers to the user document
  // Only hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a 'salt' to make the hash unique
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This adds a new method to our User model
// We'll use it in the login route to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password from the database
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;