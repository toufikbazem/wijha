import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./src/config/db.js";

const app = express();
dotenv.config();

app.use(cors({}));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.use(express.json());
app.use(cookieParser());

app.get("/test", async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      "toufikbazem@gmail.com",
    ]);
    console.log(user);
    res.json({ msg: "test" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ succes: false, message });
});
