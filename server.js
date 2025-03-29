import express from 'express'
import http from 'http';
import config from './config/index.js';
import router from './routes/index.js';
import passport from "passport";
import session from "express-session";
import cors from 'cors';
import { seedingAdmin } from './helper/seeding.js';

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