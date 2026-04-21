import db from "../../config/db.js";
import bcrypt from "bcryptjs";
import { sendVerifyEmail } from "../../utils/send_verify_email.js";

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  console.log(req.user.userId);

  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [
      req.user.userId,
    ]);
    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.rows[0].password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      req.user.userId,
    ]);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changeEmail = async (req, res) => {
  const { newEmail } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [
      req.user.userId,
    ]);
    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.query(
      "UPDATE users SET email = $1, is_email_verified = false WHERE id = $2",
      [newEmail, req.user.userId],
    );

    await db.query(
      "INSERT INTO email_verification_tokens (user_id) VALUES ($1)",
      [req.user.userId],
    );

    sendVerifyEmail(newEmail, req.user.userId);
    res.json({ message: "Email changed successfully" });
  } catch (error) {
    console.error("Error changing email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
