// backend/models/identificationModel.js
const mongoose = require('mongoose');

const identificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the User model
    default: null, // Can be null for anonymous uploads
  },
  imageUrl: { type: String, required: true }, // Link to S3
  label: { type: String, required: true }, // e.g., "Plastic Bottle"
  category: { type: String, required: true }, // e.g., "Recyclable"
  confidence: Number,
  disposalAction: String, // "Place in blue bin"
  handlingTips: String,
  feedback: {
    type: String,
    enum: ['correct', 'incorrect', 'pending'],
    default: 'pending',
  },
}, { timestamps: true });

const Identification = mongoose.model('Identification', identificationSchema);
module.exports = Identification;