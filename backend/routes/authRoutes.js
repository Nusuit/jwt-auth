const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.get("/profile", protect, getUserProfile);
module.exports = router;
