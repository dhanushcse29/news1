const express = require('express');
const router = express.Router();
const News = require('../models/news');
const authMiddleware = require('../middleware/auth');

// Get all news (public route)
router.get('/', async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create news (protected route)
router.post('/', authMiddleware, async (req, res) => {
    const news = new News({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        author: req.body.author
    });

    try {
        const newNews = await news.save();
        res.status(201).json(newNews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete news (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        await News.findByIdAndDelete(req.params.id);
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 