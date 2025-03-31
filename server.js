import express from 'express'
import http from 'http';
import config from './config/index.js';
import router from './routes/index.js';
import passport from "passport";
import session from "express-session";
import cors from 'cors';
import { seedingAdmin } from './helper/seeding.js';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type","Authorization"],
  })
);

app.use(
    session({
        secret: "your_secret_key", 
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, 
    })
);

//*********************************** google sign up  **************************************/

passport.use(new GoogleStrategy({
  clientID: config.googleClientID,
  clientSecret: config.googleClientSecret,
  callbackURL: "http://localhost:3001/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile); 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

server.listen(config.serverPort, async () => {
  await seedingAdmin();
  
  const message = `|| 🚀🚀🚀 Server running on port: ${config.serverPort} ||`;
  const len = message.length;
  console.log("~".repeat(len));
  console.log(message)
  console.log("~".repeat(len));
});