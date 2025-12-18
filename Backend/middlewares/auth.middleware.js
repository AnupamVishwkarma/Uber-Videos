const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const authHeader = req.headers && req.headers.authorization;
    const token = req.cookies?.token || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if (!user) return res.status(401).json({ message: 'User not found.' });
        req.user = user;
        return next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}