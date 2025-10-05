const express = require('express');
const router = express.Router();
const {
  addReferral,
  getReferralRewards,
  redeemReferral
} = require('../controllers/referralController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/referral/add
// @desc    Add a referral code for a new user
// @access  Private
router.post('/add', protect, addReferral);

// @route   GET /api/referral/rewards
// @desc    Get referral rewards for logged-in user
// @access  Private
router.get('/rewards', protect, getReferralRewards);

// @route   POST /api/referral/redeem
// @desc    Redeem referral reward
// @access  Private
router.post('/redeem', protect, redeemReferral);

module.exports = router;
