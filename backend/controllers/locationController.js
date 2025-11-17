// backend/controllers/locationController.js
const Location = require('../models/locationModel');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all locations or search by radius
// @route   GET /api/locations?lat=12.97&lng=77.59&type=dropoff
// @access  Public
const getLocations = asyncHandler(async (req, res) => {
  const { lat, lng, type } = req.query;

  let query = {};

  // If lat/lng are provided, filter by location (within 10km)
  if (lat && lng) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)], // MongoDB expects [lng, lat]
        },
        $maxDistance: 10000, // 10km in meters
      },
    };
  }

  // If a type is provided (e.g., 'dropoff', 'e-waste'), add it to the query
  if (type) {
    query.type = type;
  }

  const locations = await Location.find(query);
  res.status(200).json(locations);
});

// @desc    Create a new location
// @route   POST /api/locations
// @access  Private (Admin only - using protect for now)
const createLocation = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    address,
    latitude,
    longitude,
    hours,
    acceptedMaterials,
    phone,
  } = req.body;

  const location = await Location.create({
    name,
    type,
    address,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude], // Note order: [lng, lat]
    },
    hours,
    acceptedMaterials,
    contact: { phone },
  });

  res.status(201).json(location);
});

module.exports = {
  getLocations,
  createLocation,
};