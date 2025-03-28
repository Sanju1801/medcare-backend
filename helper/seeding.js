import config from "../config/index.js";
import pool from "../db/index.js";
import bcrypt from "bcrypt";


export const seedingAdmin = async () => {
  try {
    const isAdminSeeded = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [config.adminEmail]
    );

    if (!isAdminSeeded.rows.length) {
      const hashedPassword = await bcrypt.hash(config.adminPass, 10);

      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [config.adminName, config.adminEmail, hashedPassword, "admin"]
      );
    }

    return true;
  } catch (err) {
    throw new Error(
      "Error while seeding admin, Please restart the server",
      err.message
    );
  }
};
