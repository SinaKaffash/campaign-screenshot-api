// const { getConnection } = require('../config/database');
// const bcrypt = require('bcryptjs');

import { getConnection } from "../config/database.js";
import bcrypt from "bcryptjs";

class UserModel {
    static async createUser(userData) {
        const connection = getConnection();
        const { username, email, password } = userData;

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await connection.execute(
            `INSERT INTO users (username, email, password, created_at, updated_at) 
       VALUES (?, ?, ?, NOW(), NOW())`,
            [username, email, hashedPassword]
        );

        return result.insertId;
    }

    static async findByEmail(email) {
        const connection = getConnection();

        const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

        return users[0] || null;
    }

    static async findById(id) {
        const connection = getConnection();

        const [users] = await connection.execute(
            "SELECT id, username, email, created_at FROM users WHERE id = ?",
            [id]
        );

        return users[0] || null;
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

// module.exports = UserModel;
export default UserModel;
