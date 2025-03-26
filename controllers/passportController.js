import express from 'express'
import passport from '../services/passportService.js'
import jwt from "jsonwebtoken";
import config from '../config/index.js';

const router = express.Router()


//********************Google sign up ****************************/
router.get(
    '/google',
    passport.authenticate("google", { scope: ['email', 'profile'] }
    ));

router.get(
    '/google/callback',
    passport.authenticate(
        'google', 
        {session: false,}
    ),
    async (req, res) => {
        try {
            console.log("success", req.user);
            // res.redirect(`http://localhost:3000?token=bjabvjab`)
            res.redirect(`http://localhost:3000/appointments`);
        } catch (error) {
            console.log("catch in google callback", err);
        }
    }
)

//******************** login  ****************************/
   
// JWT Secret Key (use env variable in production)

router.post("/login", (req, res, next) => {
  console.log("POST /login hit");

  passport.authenticate("local", async (err, user, info) => {
    console.log("Authentication hit:", user);
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        console.log("Invalid credentials");
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Generate JWT Token after successful login
      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
      
      console.log("Token generated successfully");

      // Send token to the client
      return res.status(200).json({
        message: "Login Successful",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).send("Server Error");
    }
  })(req, res, next);
});


export default router;
