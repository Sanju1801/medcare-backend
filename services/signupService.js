import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import config from "../config/index.js";
import { isValidEmail } from "../helper/index.js";

const saveUser = async (body) => {
    try {
        const { name, email, password } = body
        if (!name || !email || !password) {
            throw new Error("missing payload values")
        }

        if (!isValidEmail(email)) {
            throw new Error('Invalid email, Please change the email and try again')
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
 
        const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',[name, email, hashedPassword]);

        if (result.rows.length) {
            const user = result.rows[0];
            const token = jwt.sign(
                { id: user?.id, role: user?.role },
                config.jwtSecret,
                { expiresIn: config.expiresIn }
            );

            return {
                success: true,
                message: "User saved successfully",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            };
        }
        else throw new Error('error while saving')
    } 
    catch (err) {
        throw new Error(err);
    }
}
export default saveUser;


