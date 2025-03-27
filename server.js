import express from 'express'
import http from 'http';
import config from './config/index.js';
import router from './routes/index.js';
import passport from "passport";
import session from "express-session";
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
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
console.log('server file');

server.listen(config.serverPort,()=>{
    console.log("----------------------------Server listening on port : ", config.serverPort);
})