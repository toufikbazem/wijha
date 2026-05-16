import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const adminLogin = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const result = await db.query(
      "SELECT id, email, password, role FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const valid = bcryptjs.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" },
    );

    const { password: _pw, ...safeUser } = user;

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
      })
      .json(safeUser);
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      })
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adminMe = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, email, role, created_at FROM users WHERE id = $1 AND role = 'admin'",
      [req.user.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Admin me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
