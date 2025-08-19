const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err);

    let error = { ...err };
    error.message = err.message;

    // MySQL duplicate entry error
    if (err.code === "ER_DUP_ENTRY") {
        error.message = "Duplicate entry found";
        error.statusCode = 400;
    }

    // MySQL syntax error
    if (err.code === "ER_PARSE_ERROR") {
        error.message = "Database query error";
        error.statusCode = 400;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        error.message = "Invalid token";
        error.statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        error.message = "Token expired";
        error.statusCode = 401;
    }

    // Validation errors
    if (err.name === "ValidationError") {
        error.message = "Validation failed";
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

// module.exports = errorHandler;
export default errorHandler; // Use ES6 export if your environment supports it
