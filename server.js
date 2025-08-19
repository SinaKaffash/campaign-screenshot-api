import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test database connection
        await connectDatabase();
        console.log("✅ Database connected successfully");

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 API URL: http://localhost:${PORT}/api/${process.env.API_VERSION}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Promise Rejection:", err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
});

startServer();
