const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authMiddleware = require('./server/middleware/auth');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('views'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_news_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
const newsRoutes = require('./server/routes/newsRoutes');
const eventRoutes = require('./server/routes/eventRoutes');
const adminRoutes = require('./server/routes/adminRoutes');

app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Add routes for other pages
app.get('/news.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news.html'));
});

app.get('/events.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'events.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/admin-login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-login.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 