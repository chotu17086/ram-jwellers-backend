const mongoose = require('mongoose');

const goldSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true }, // in grams
    buyPrice: { type: Number, required: true }, // price at which user bought
    sellPrice: { type: Number, required: true }, // price at which user can sell
    reward: { type: Number, default: 0 }, // referral reward included
    status: { type: String, enum: ['active', 'redeemed'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    redeemedAt: { type: Date }
});

module.exports = mongoose.model('Gold', goldSchema);
