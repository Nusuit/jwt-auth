const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "your_mysql_password",
  database: process.env.DB_NAME || "auth_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công!");
    connection.release();
  } catch (error) {
    console.error("Lỗi kết nối MySQL:", error.message);
    process.exit(1);
  }
}
module.exports = { pool, testDbConnection };
