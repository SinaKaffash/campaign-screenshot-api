// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken"; // Use ES6 import if your environment supports it

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Access token is required",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }

        req.user = decoded;
        next();
    });
};

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// module.exports = {
//     authenticateToken,
//     generateToken,
// };

export { authenticateToken, generateToken }; // Use ES6 export if your environment supports it
