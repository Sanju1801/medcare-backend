import passport from 'passport'
import pool from '../db/index.js';
import bcrypt from 'bcrypt'
import config from '../config/index.js';
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import pkg from 'passport-google-oauth20'
const GoogleStratergy = pkg.Strategy;


//*********************************** google sign up  **************************************/

passport.use(new GoogleStratergy({
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: config.googleCallbackURL,
    },
    function (req, accesstoken, refreshtoken, profile, done) {
        return done(null, profile)
        //this proifle is sent to my controller api callback
    }
))

//************************************ login  *********************************************/


// ********************* Local Strategy for authenticating users with email and password **********************//

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
          console.log("User not found.");
          return done(null, false, { message: "Invalid username or password" });
        }

        const user = result.rows[0];
        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log("Password does not match.");
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, user);

      } catch (error) {
        console.error("Error in Local Strategy:", error);
        return done(error);
      }
    }
  )
);

// ********************* JWT Strategy for protecting routes *******************************************//
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [payload.id]);

      if (result.rows.length === 0) {
        return done(null, false);
      }

      const user = result.rows[0];
      return done(null, user);
    } catch (err) {
      console.error("Error in JWT Strategy:", err);
      return done(err, false);
    }
  })
);


passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

export default passport;