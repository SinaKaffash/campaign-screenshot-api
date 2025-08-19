// const express = require("express");
// const { body } = require("express-validator");
// const AuthController = require("../controllers/authController");
// const { authenticateToken } = require("../middleware/auth");
// const { handleValidationErrors } = require("../middleware/validation");

import express from "express";
import { body } from "express-validator";
import AuthController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { handleValidationErrors } from "../middleware/validation.js";

const router = express.Router();

// Validation rules
const registerValidation = [
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters"),

    body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
    body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required"),
];

// Auth routes
router.post("/register", registerValidation, handleValidationErrors, AuthController.register);
router.post("/login", loginValidation, handleValidationErrors, AuthController.login);
router.get("/profile", authenticateToken, AuthController.getProfile);

// module.exports = router;
export default router;
