require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { testDbConnection } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(express.json());
app.use(cors());
testDbConnection();
app.use("/api/auth", authRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
