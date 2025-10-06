const express = require('express');
const router = express.Router();
const GoldRate = require('../models/GoldRate');

// 🔹 Add or Update Gold Rate
router.post('/update', async (req, res) => {
    try {
        const { rate, date } = req.body;

        if (!rate || !date) {
            return res.status(400).json({ message: 'Rate and date are required' });
        }

        // Find existing rate for the date
        let goldRate = await GoldRate.findOne({ date });

        if (goldRate) {
            goldRate.rate = rate;
            await goldRate.save();
            res.json({ message: 'Gold rate updated successfully', goldRate });
        } else {
            goldRate = new GoldRate({ rate, date });
            await goldRate.save();
            res.status(201).json({ message: 'Gold rate added successfully', goldRate });
        }
    } catch (err) {
        console.error('Error updating gold rate:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🔹 Get Latest Gold Rate
router.get('/latest', async (req, res) => {
    try {
        const latestRate = await GoldRate.findOne().sort({ date: -1 });
        if (!latestRate) {
            return res.status(404).json({ message: 'No gold rate found' });
        }
        res.json(latestRate);
    } catch (err) {
        console.error('Error fetching latest gold rate:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🔹 Get All Gold Rates (History)
router.get('/all', async (req, res) => {
    try {
        const allRates = await GoldRate.find().sort({ date: -1 });
        res.json(allRates);
    } catch (err) {
        console.error('Error fetching gold rates:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
