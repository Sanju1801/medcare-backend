import passport from "passport";
import jwt from "jsonwebtoken";
import config from '../config/index.js'

// const jwtAuthMiddleware = (req, res, next) => {
//     passport.authenticate("jwt", { session: false }, (err, user, info) => {
//       if (err) return res.status(500).json({ message: "Server error" });
  
//       if (!user) return res.status(401).json({ message: "Unauthorized user!" });
  
//       req.user = user; 
//       next(); 
//     })(req, res, next);
//   };

export const jwtAuthMiddleware = (req, res, next) => {
  console.log("jwt auth middleware---------------")
  const token = req.headers.authorization?.split(" ")[1]; 
  console.log("token : ",token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; 
    next();
  } catch (error) {
    console.log("error :", error.message)
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default jwtAuthMiddleware;

