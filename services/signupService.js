import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import config from "../config/index.js";


const saveUser = async (body) => {
    try {
        console.log(body);
        const { name, email, password } = body
        if (!name || !email || !password) {
            throw new Error("missing required fields")
        }

        if (!email.endsWith('@gmail.com') && !email.endsWith('@tothenew.com')) {
            throw new Error("this email is not allowed");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // const role = 'users';
    
        const result = await pool.query('INSERT INTO users (name, email, password) values ($1,$2,$3) RETURNING *', [name, email, hashedPassword]);
        console.log('save query response', result);

        if (result.rows) {
            const user = result.rows[0];
            console.log(user);

            const token = jwt.sign(
                // { name: user.name, email: user.email, role: user.role },
                {name: user.name},
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


