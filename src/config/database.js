// const mysql = require("mysql2/promise");
import mysql from "mysql2/promise"; // Use ES6 import if your environment supports it
// dotenv
import dotenv from "dotenv";
dotenv.config();

let connection;

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
};

const connectDatabase = async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute("SELECT 1");
        return connection;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

const getConnection = () => {
    if (!connection) {
        throw new Error("Database connection not initialized");
    }
    return connection;
};

// module.exports = {
//   connectDatabase,
//   getConnection
// };
export { connectDatabase, getConnection };
