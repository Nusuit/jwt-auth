const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [rows] = await pool.execute(
        "SELECT id, username, email FROM users WHERE id = ?",
        [decoded.id]
      );
      if (rows.length === 0) {
        return res.status(401).json({ message: "Người dùng không tìm thấy." });
      }
      req.user = rows[0];
      next();
    } catch (error) {
      console.error("Lỗi xác thực token:", error.message);
      res.status(401).json({ message: "Không được ủy quyền, token lỗi." });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Không được ủy quyền, không có token." });
  }
};
module.exports = { protect };
