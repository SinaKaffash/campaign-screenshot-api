import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import campaignRoutes from "./routes/campaignRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

// Set the trust proxy setting in your Express app
const app = express();
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
const apiVersion = process.env.API_VERSION || "v1";
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/campaigns`, campaignRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.all("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} not found`,
    });
});

// Global error handler
app.use(errorHandler);

export default app;
