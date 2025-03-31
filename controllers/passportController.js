import express from 'express'
import passport from '../services/passportService.js'
import jwt from "jsonwebtoken";
import config from '../config/index.js';
import pool from '../db/index.js';
import { isValidEmail } from '../helper/index.js';

const router = express.Router();


//********************Google sign up ****************************/
router.get(
  '/google',
  passport.authenticate("google", { scope: ['email', 'profile'] }
  ));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect("http://localhost:3000/login"); 
      }

      console.log(req.user);
      const { displayName, emails } = req.user;
      const email = emails[0].value;

      if (!isValidEmail(email)) {
        throw new Error('Invalid email, Please change the email and try again')
      } 

      let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (user.rows.length === 0) {
        user = await pool.query(
          "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
          [displayName, email]
        );
      }
      const token = jwt.sign(
        { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email },
        config.jwtSecret,
        { expiresIn: "1h" }
      );

      console.log("My token : ",token)

      res.redirect(`http://localhost:3000/auth-success?token=${token}`);

    } catch (error) {
      console.error("Google Auth Error:", error);
      res.status(500).json({ message: error.message || "Server Error" });
    }
  }
);

//******************** login  ****************************/

router.post("/login", (req, res, next) => {
  console.log("POST /login hit");

  passport.authenticate("local", async (err, user, info) => {
    console.log("Authentication hit:", user);
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const payload = { id: user.id, name: user.name, role: user.role };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.expiresIn });


      return res.status(200).json({
        message: "Login Successful",
        token: token,
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
        },
      });
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  })(req, res, next);
});


export default router;
