const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const generateToken = require("../utils/jwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng điền đầy đủ các trường." });
  }
  try {
    const [existingUser] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Email hoặc tên người dùng đã tồn tại." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    res.status(201).json({
      message: "Đăng ký thành công",
      user: { id: result.insertId, username, email },
      token: generateToken(result.insertId),
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    res.status(500).json({ message: "Đăng ký thất bại. Vui lòng thử lại." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng điền đầy đủ email và mật khẩu." });
  }
  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ." });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ." });
    }
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: { id: user.id, username: user.username, email: user.email },
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    res.status(500).json({ message: "Đăng nhập thất bại. Vui lòng thử lại." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Vui lòng nhập email." });
  }
  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(200).json({
        message:
          "Nếu email của bạn tồn tại, một liên kết đặt lại mật khẩu đã được gửi.",
      });
    }
    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await pool.execute(
      "UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE id = ?",
      [resetPasswordToken, new Date(resetPasswordExpire), user.id]
    );
    const resetUrl = `<span class="math-inline">\{process\.env\.CLIENT\_URL\}/\#/reset\-password/</span>{resetToken}`;
    const message = `
            <h1>Bạn đã yêu cầu đặt lại mật khẩu</h1>
            <p>Vui lòng truy cập liên kết sau để đặt lại mật khẩu:</p>
            <a href=<span class="math-inline">\{resetUrl\} clicktracking\=off\></span>{resetUrl}</a>
            <p>Liên kết này sẽ hết hạn trong 15 phút.</p>
        `;
    try {
      await sendEmail({
        email: user.email,
        subject: "Đặt lại mật khẩu của bạn",
        html: message,
      });
      res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi." });
    } catch (err) {
      await pool.execute(
        "UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?",
        [user.id]
      );
      console.error("Lỗi gửi email:", err.message);
      res.status(500).json({
        message: "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.",
      });
    }
  } catch (error) {
    console.error("Lỗi quên mật khẩu:", error.message);
    res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại." });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới." });
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
        .json({ message: "Token đặt lại không hợp lệ hoặc đã hết hạn." });
    }
    const user = users[0];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await pool.execute(
      "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );
    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công." });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error.message);
    res.status(500).json({
      message: "Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.",
    });
  }
};

const getUserProfile = async (req, res) => {
  res.status(200).json({ message: "Thông tin người dùng", user: req.user });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
};
