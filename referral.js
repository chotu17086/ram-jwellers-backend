const express = require('express');
const router = express.Router();
const Referral = require('../models/referral');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for auth
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Create Referral
router.post('/create', auth, async (req, res) => {
    try {
        const { refereeEmail, rewardAmount } = req.body;
        const referee = await User.findOne({ email: refereeEmail });
        if (!referee) return res.status(404).json({ error: 'Referee not found' });

        const referral = new Referral({
            referrerId: req.userId,
            refereeId: referee._id,
            rewardAmount,
            status: 'credited'
        });

        await referral.save();
        res.json({ message: 'Referral credited', referral });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get User Referrals
router.get('/my', auth, async (req, res) => {
    try {
        const referrals = await Referral.find({ referrerId: req.userId });
        res.json({ referrals });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
