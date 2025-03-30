import pool from '../db/index.js';
import { sendEmail } from "./emailService.js";

export const retrievePassword = async ({ email }) => {
    try {
        const result = await pool.query(`SELECT password FROM users WHERE email = $1`, [email]);
        if (result.rowCount === 0) {
            throw new Error("User not found");
        }

        const userPassword = result.rows[0].password;
        const subject = "Your Password Recovery";
        const text = `Hello,\n\nYour password is: ${userPassword}\n\nPlease keep it safe.\n\nThank you.`;

        await sendEmail(email, subject, text);
        return { success: true, message: "Password sent to your email !" };

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return { success: false, error: err.message };
    }
};
