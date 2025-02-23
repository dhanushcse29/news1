const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            username: admin.username,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify token (protected route)
router.get('/verify', authMiddleware, (req, res) => {
    res.json({ valid: true });
});

module.exports = router; 