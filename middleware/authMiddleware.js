import passport from "passport";

// const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

const jwtAuthMiddleware = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) return res.status(500).json({ message: "Server error" });
  
      if (!user) return res.status(401).json({ message: "Unauthorized user!" });
  
      req.user = user; 
      next(); 
    })(req, res, next);
  };

export default jwtAuthMiddleware;