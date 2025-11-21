const fs = require('fs');
const axios = require('axios');
const Identification = require('../models/identificationModel');
const asyncHandler = require('../middleware/asyncHandler');

// --- CONFIGURATION ---
const API_KEY = "AIzaSyDLOTnR1kSvSQ8mk3E0G8kOSCUt7D8M03s"; 

// FIX: Use the specific 'latest' alias which is more stable
const MODEL_NAME = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

const identifyWaste = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }

  console.log(`--- STARTING GEMINI IDENTIFICATION (${MODEL_NAME}) ---`);

  try {
    // 1. Convert image to Base64
    const base64Image = fs.readFileSync(req.file.path).toString('base64');
    const mimeType = req.file.mimetype;

    // 2. Construct the Payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Analyze this waste item image.
                     Return a raw JSON object (no markdown) with this structure:
                     {
                       "label": "Short name",
                       "category": "One of: Recyclable, Compost, Trash, E-waste, Hazardous",
                       "disposalAction": "Specific instruction",
                       "handlingTips": "Safety tip",
                       "confidence": 0.95
                     }`
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        response_mime_type: "application/json"
      }
    };

    // 3. Send Request via Axios
    console.log("Sending request to Google via Axios...");
    const response = await axios.post(API_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    // 4. Parse Response
    const aiText = response.data.candidates[0].content.parts[0].text;
    console.log("✅ RAW SUCCESS:", aiText);

    const aiData = JSON.parse(aiText);

    // 5. Save to Database
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    
    const identification = await Identification.create({
      userId: req.user._id,
      imageUrl: imageUrl,
      label: aiData.label,
      category: aiData.category,
      confidence: aiData.confidence || 0.9,
      disposalAction: aiData.disposalAction,
      handlingTips: aiData.handlingTips,
      feedback: 'pending'
    });

    res.status(201).json(identification);

  } catch (error) {
    console.error("❌ GEMINI API ERROR:");
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
      
      // Fallback logic: If flash fails, tell user to try Pro
      if (error.response.status === 404) {
         res.status(404);
         throw new Error(`Model '${MODEL_NAME}' not found. Change MODEL_NAME line to 'gemini-1.5-pro-latest'`);
      }

      res.status(error.response.status);
      throw new Error(`Google API Error: ${error.response.data.error.message}`);
    } else {
      console.error("Message:", error.message);
      res.status(500);
      throw new Error('Network Error: Could not reach Google servers.');
    }
  }
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await Identification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(history);
});

module.exports = { identifyWaste, getHistory };