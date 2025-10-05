const Referral = require('../models/referral');
const User = require('../models/users');

// Create a referral when a user invites someone
exports.createReferral = async (req, res) => {
    try {
        const { inviterId, inviteeId } = req.body;

        // Check if referral already exists
        const existing = await Referral.findOne({ inviterId, inviteeId });
        if (existing) return res.status(400).json({ message: 'Referral already exists' });

        const referral = new Referral({
            inviterId,
            inviteeId,
            rewardGiven: false
        });

        await referral.save();
        res.json({ message: 'Referral created successfully', referral });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Apply referral reward when invitee buys gold
exports.applyReferralReward = async (req, res) => {
    try {
        const { inviteeId } = req.body;

        const referral = await Referral.findOne({ inviteeId, rewardGiven: false });
        if (!referral) return res.status(404).json({ message: 'No pending referral reward' });

        const inviter = await User.findById(referral.inviterId);
        if (!inviter) return res.status(404).json({ message: 'Inviter not found' });

        // Reward logic: e.g., 1 gm digital gold
        inviter.wallet = inviter.wallet || 0;
        inviter.wallet += 1; // 1 gm reward
        await inviter.save();

        referral.rewardGiven = true;
        await referral.save();

        res.json({ message: 'Referral reward applied', inviterWallet: inviter.wallet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all referrals of a user
exports.getReferrals = async (req, res) => {
    try {
        const { userId } = req.params;

        const referrals = await Referral.find({ inviterId: userId }).populate('inviteeId', 'name email');
        res.json(referrals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
