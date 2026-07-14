const User = require("../models/User");
const { hashPassword, comparePasswords } = require("../services/authService");
const jwt = require("jsonwebtoken");

function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

async function register(req, res,next) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already in use",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Registered successfully",
            token: createToken(user._id),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res,next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        return res.status(200).json({
            message: "Logged in successfully",
            token: createToken(user._id),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
};