const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/auth');
const { analyzeWithGemini } = require('../controllers/commentController');

// Route to analyze YouTube video using Gemini
router.post('/comment/analyze', authenticateToken, analyzeWithGemini);

module.exports = router;
