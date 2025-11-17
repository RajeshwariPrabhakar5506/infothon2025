// backend/controllers/identificationController.js
const Identification = require('../models/identificationModel');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Identify waste from image
// @route   POST /api/identify
// @access  Private (for now)
const identifyWaste = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }

  // 1. Get the file path (where Multer saved it)
  // In production (S3), this would be a URL.
  const imageUrl = `/${req.file.path}`;

  // 2. MOCK AI INFERENCE (We will replace this with real AI later)
  // For now, we just return a random result so we can build the frontend.
  const mockResults = [
    { label: 'Plastic Bottle', category: 'Recyclable', action: 'Place in Blue Bin' },
    { label: 'Banana Peel', category: 'Compost', action: 'Place in Green Bin' },
    { label: 'Glass Jar', category: 'Recyclable', action: 'Rinse and Recycle' },
  ];
  const result = mockResults[Math.floor(Math.random() * mockResults.length)];

  // 3. Save to Database
  const identification = await Identification.create({
    userId: req.user._id,
    imageUrl: imageUrl,
    label: result.label,
    category: result.category,
    confidence: 0.95, // Mock confidence
    disposalAction: result.action,
    handlingTips: 'Ensure item is clean and dry.',
    feedback: 'pending'
  });

  res.status(201).json(identification);
});

// @desc    Get user's identification history
// @route   GET /api/identify/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
  const history = await Identification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(history);
});

module.exports = {
  identifyWaste,
  getHistory
};