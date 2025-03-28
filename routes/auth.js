const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

const router = express.Router();

console.log("🔐 SECRET_KEY being used for JWT:", process.env.SECRET_KEY);
// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password|| !username) {
            return res.status(400).json({ message: "Please provide all fields: name, email, and password" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        let userByUsername = await User.findOne({username});
        if (userByUsername) return res.status(400).json({message: "username already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, username});
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide both email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email }  // Added user info to response
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;