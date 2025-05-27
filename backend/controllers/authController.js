// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const generateToken = require("../utils/jwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }
  try {
    const [existingUser] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Email or username already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    res.status(201).json({
      message: "Registration successful. Please login.", // Changed message
      user: { id: result.insertId, username, email },
      token: generateToken(result.insertId),
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }
  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Please provide an email address." });
  }
  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      // It's good practice not to reveal if an email exists or not for security reasons
      return res.status(200).json({
        message:
          "If your email exists in our system, a password reset link has been sent.",
      });
    }
    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await pool.execute(
      "UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE id = ?",
      [resetPasswordToken, new Date(resetPasswordExpire), user.id]
    );

    // Ensure CLIENT_URL is set in your .env file, e.g., CLIENT_URL=http://localhost:5173
    const resetUrl = `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/#/reset-password/${resetToken}`;

    const emailMessage = `
      <h1>You have requested a password reset</h1>
      <p>Please go to the following link to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        html: emailMessage,
      });
      res.status(200).json({ message: "Password reset email sent." });
    } catch (err) {
      await pool.execute(
        "UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?",
        [user.id]
      );
      console.error("Error sending email:", err.message);
      res.status(500).json({
        message: "Could not send password reset email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "Please provide a new password." });
  }
  if (newPassword.length < 6) {
    // Example: Enforce minimum password length
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  try {
    const [users] = await pool.execute(
      "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expire > ?",
      [hashedToken, new Date(Date.now())]
    );

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }
    const user = users[0];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.execute(
      "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({
      message:
        "An error occurred while resetting the password. Please try again.",
    });
  }
};

const getUserProfile = async (req, res) => {
  // req.user is set by the 'protect' middleware
  res
    .status(200)
    .json({ message: "User profile fetched successfully.", user: req.user });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
};
