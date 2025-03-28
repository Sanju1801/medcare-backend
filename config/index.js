import * as dotenv from "dotenv";
dotenv.config();

const config = {
  serverPort: process.env.PORT,
  dbUser: process.env.USER,
  database: process.env.DATABSE,
  dbPassword: process.env.DBPASS,
  dbPort: process.env.DBPORT,
  max: process.env.POOLSIZE,
  idleTimeoutMillis: process.env.TIMEOUT,
  connectionTimeoutMillis: process.env.MILLIS,
  googleClientID: process.env.GOOGLECLIENTID,
  googleClientSecret: process.env.GOOGLECLIENTSECRET,
  googleCallbackURL: process.env.GOOGLECALLBAKCURL,
  jwtSecret: process.env.JWTSECRETKEY,
  expiresIn: process.env.JWTEXPIRES,
  adminName: process.env.ADMIN_NAME,
  adminPass: process.env.ADMIN_PASS,
  adminEmail: process.env.ADMIN_EMAIL
};

export default config;
