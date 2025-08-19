// const UserModel = require('../models/userModel');
// const { generateToken } = require('../middleware/auth');
import UserModel from "../models/userModel.js";
import { generateToken } from "../middleware/auth.js";

class AuthController {
    static async register(req, res, next) {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    status: "error",
                    message: "User with this email already exists",
                });
            }

            // Create user
            const userId = await UserModel.createUser({ username, email, password });
            const user = await UserModel.findById(userId);

            // Generate token
            const token = generateToken({
                id: user.id,
                email: user.email,
            });

            res.status(201).json({
                status: "success",
                message: "User registered successfully",
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    },
                    token,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    status: "error",
                    message: "Invalid credentials",
                });
            }

            // Validate password
            const isValidPassword = await UserModel.validatePassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    status: "error",
                    message: "Invalid credentials",
                });
            }

            // Generate token
            const token = generateToken({
                id: user.id,
                email: user.email,
            });

            res.status(200).json({
                status: "success",
                message: "Login successful",
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    },
                    token,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req, res, next) {
        try {
            const user = await UserModel.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found",
                });
            }

            res.status(200).json({
                status: "success",
                message: "Profile retrieved successfully",
                data: {
                    user,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

// module.exports = AuthController;

export default AuthController;
