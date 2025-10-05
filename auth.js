const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const goldRoutes = require('./routes/gold');
const referralRoutes = require('./routes/referrals');

app.use('/api/auth', authRoutes);
app.use('/api/gold', goldRoutes);
app.use('/api/referrals', referralRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Ram Jewellers Digital Gold API is running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
    // Start server after DB connection
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('MongoDB connection failed:', err.message);
});
