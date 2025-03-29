import express from 'express'
import passport from '../services/passportService.js'
import jwt from "jsonwebtoken";
import config from '../config/index.js';

const router = express.Router();


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
