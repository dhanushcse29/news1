const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.adminId = decoded.id;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authMiddleware; 