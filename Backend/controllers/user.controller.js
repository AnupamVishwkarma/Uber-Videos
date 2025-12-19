const userModel = require('../models/user.model');
const userService = require('../services/user.services');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    const { fullname, email, password } = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
}

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message: 'Authentication failed. User not found.'});
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({message: 'Authentication failed. Invalid password.'});
    }

    const token = user.generateAuthToken();
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge:3600000 // 1 hour
    });

    res.status(200).json({ user, token });
}

module.exports.getUserProfile = async (req, res) => {
    res.status(200).json({ user: req.user });
}


module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token');
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    await blacklistTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
}