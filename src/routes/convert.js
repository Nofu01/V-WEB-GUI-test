const express = require('express');
const router = express.Router();
const hexToRgb = require('../utils/hexToRgb');
const rgbToHex = require('../utils/RgbTohex'); // ✅ correct import

// GET /api/convert/hex-to-rgb?hex=FFFFFF
router.get('/hex-to-rgb', (req, res) => {
  const { hex } = req.query;
  if (!hex) {
    return res.status(400).json({
      success: false,
      error: 'Missing hex parameter',
      message: 'Please provide a hex color code in the query string'
    });
  }

  const rgb = hexToRgb(hex);
  if (!rgb) {
    return res.status(400).json({
      success: false,
      error: 'Invalid hex color code',
      message: 'Please provide a valid hex color code (e.g., FFFFFF or #FFFFFF)'
    });
  }

  const normalized = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
  res.json({
    success: true,
    data: { hex: normalized, rgb, css: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }
  });
});

// POST /api/convert/hex-to-rgb
router.post('/hex-to-rgb', (req, res) => {
  const { hex } = req.body || {};
  if (!hex) {
    return res.status(400).json({
      success: false,
      error: 'Missing hex parameter',
      message: 'Please provide a hex color code in the request body'
    });
  }

  const rgb = hexToRgb(hex);
  if (!rgb) {
    return res.status(400).json({
      success: false,
      error: 'Invalid hex color code',
      message: 'Please provide a valid hex color code (e.g., FFFFFF or #FFFFFF)'
    });
  }

  const normalized = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
  res.json({
    success: true,
    data: { hex: normalized, rgb, css: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }
  });
});

// GET /api/convert/rgb-to-hex?r=4&g=200&b=150
router.get('/rgb-to-hex', (req, res) => {
  const { r, g, b } = req.query;
  const hex = rgbToHex(r, g, b);
  if (!hex) {
    return res.status(400).json({
      success: false,
      error: 'Invalid RGB values',
      message: 'Provide r,g,b integers between 0 and 255'
    });
  }

  const rr = Number(r), gg = Number(g), bb = Number(b);
  res.json({
    success: true,
    data: { hex, rgb: { r: rr, g: gg, b: bb }, css: `rgb(${rr}, ${gg}, ${bb})` }
  });
});

// POST /api/convert/rgb-to-hex  { "r": 4, "g": 200, "b": 150 }
router.post('/rgb-to-hex', (req, res) => {
  const { r, g, b } = req.body || {};
  const hex = rgbToHex(r, g, b);
  if (!hex) {
    return res.status(400).json({
      success: false,
      error: 'Invalid RGB values',
      message: 'Provide r,g,b integers between 0 and 255'
    });
  }

  const rr = Number(r), gg = Number(g), bb = Number(b);
  res.json({
    success: true,
    data: { hex, rgb: { r: rr, g: gg, b: bb }, css: `rgb(${rr}, ${gg}, ${bb})` }
  });
});

module.exports = router;
