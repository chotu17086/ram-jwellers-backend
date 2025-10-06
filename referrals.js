const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');

// 🔹 Create a new referral
router.post('/create', async (req, res) => {
    try {
        const { referrerId, referredEmail } = req.body;

        if (!referrerId || !referredEmail) {
            return res.status(400).json({ message: 'Referrer ID and referred email are required' });
        }

        // Check if referral already exists
        const existingReferral = await Referral.findOne({ referredEmail });
        if (existingReferral) {
            return res.status(400).json({ message: 'This email has already been referred.' });
        }

        // Create a new referral record
        const newReferral = new Referral({
            referrerId,
            referredEmail,
            createdAt: new Date()
        });

        await newReferral.save();
        res.status(201).json({ message: 'Referral created successfully', referral: newReferral });

    } catch (err) {
        console.error('Error creating referral:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🔹 Get all referrals by referrer ID
router.get('/:referrerId', async (req, res) => {
    try {
        const { referrerId } = req.params;
        const referrals = await Referral.find({ referrerId }).sort({ createdAt: -1 });
        res.json(referrals);
    } catch (err) {
        console.error('Error fetching referrals:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🔹 Mark referral as successful (after referred user joins or buys something)
router.put('/mark-success/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const referral = await Referral.findById(id);
        if (!referral) {
            return res.status(404).json({ message: 'Referral not found' });
        }

        referral.status = 'successful';
        referral.updatedAt = new Date();
        await referral.save();

        res.json({ message: 'Referral marked as successful', referral });
    } catch (err) {
        console.error('Error updating referral status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🔹 Get all referrals (Admin route)
router.get('/', async (req, res) => {
    try {
        const referrals = await Referral.find().populate('referrerId', 'name email').sort({ createdAt: -1 });
        res.json(referrals);
    } catch (err) {
        console.error('Error fetching all referrals:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
