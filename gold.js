const express = require('express');
const router = express.Router();
const {
  buyGold,
  sellGold,
  getGoldPrice,
  getUserGold
} = require('../controllers/goldController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/gold/buy
// @desc    Buy digital gold
// @access  Private
router.post('/buy', protect, buyGold);

// @route   POST /api/gold/sell
// @desc    Sell digital gold
// @access  Private
router.post('/sell', protect, sellGold);

// @route   GET /api/gold/price
// @desc    Get current gold price
// @access  Public
router.get('/price', getGoldPrice);

// @route   GET /api/gold/my
// @desc    Get logged-in user's gold holdings
// @access  Private
router.get('/my', protect, getUserGold);

module.exports = router;
