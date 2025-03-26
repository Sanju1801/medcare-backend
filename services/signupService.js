import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import config from "../config/index.js";

const saveUser = async (body) => {
    try {
        console.log(body);
        const { name, email, password } = body
        if (!name || !email || !password) {
            throw new Error("missing payload values")
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = 'users';

        const result = await pool.query('INSERT INTO users (name, email, password, role) values ($1,$2,$3, $4)', [name, email, hashedPassword, role]);
        console.log('save query response', result);

        if (result.rows) {
            const user = result.rows[0];
            const token = jwt.sign(
                { name: user.name, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: "1h" }
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
        console.log('error is INSERT query', err);
        return {
            success: false,
            error: err,
        }
    }
}
export default saveUser;


