const Gold = require('../models/gold');
const User = require('../models/users');

// Get current gold rates
exports.getGoldRates = async (req, res) => {
    try {
        const gold = await Gold.findOne({});
        if (!gold) return res.status(404).json({ message: 'Gold rates not set' });
        res.json(gold);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Buy digital gold
exports.buyGold = async (req, res) => {
    try {
        const { userId, quantity } = req.body;

        const gold = await Gold.findOne({});
        if (!gold) return res.status(404).json({ message: 'Gold rates not set' });

        const cost = quantity * gold.sellPrice;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.wallet = user.wallet || 0;
        user.wallet += quantity; // store quantity in user's digital gold wallet
        await user.save();

        res.json({ message: 'Gold purchased successfully', quantity, cost, wallet: user.wallet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Sell digital gold
exports.sellGold = async (req, res) => {
    try {
        const { userId, quantity } = req.body;

        const gold = await Gold.findOne({});
        if (!gold) return res.status(404).json({ message: 'Gold rates not set' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.wallet || user.wallet < quantity) {
            return res.status(400).json({ message: 'Insufficient gold in wallet' });
        }

        const earnings = quantity * gold.buyPrice;

        user.wallet -= quantity;
        await user.save();

        res.json({ message: 'Gold sold successfully', quantity, earnings, wallet: user.wallet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update gold rates
exports.updateGoldRates = async (req, res) => {
    try {
        const { buyPrice, sellPrice } = req.body;

        let gold = await Gold.findOne({});
        if (!gold) {
            gold = new Gold({ buyPrice, sellPrice });
        } else {
            gold.buyPrice = buyPrice;
            gold.sellPrice = sellPrice;
        }

        await gold.save();
        res.json({ message: 'Gold rates updated', gold });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
