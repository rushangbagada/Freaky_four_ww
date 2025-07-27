// const jwt = require("jsonwebtoken");

// exports.protect = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // Change this line from decoded.id to decoded.userId to match how the token is created
//     req.userId = decoded.userId;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };


// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // adjust the path to your User model



const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
