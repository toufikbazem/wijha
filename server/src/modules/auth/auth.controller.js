import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../../utils/send-email.js";
import { sendVerifyEmail } from "../../utils/send_verify_email.js";
import dotenv from "dotenv";
dotenv.config();

const register = (req, res) => {};
const login = (req, res) => {};
const logout = (req, res) => {};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    if (user.rows.length === 0) {
      res.status(404).json({ message: "User not exist with this email" });
    }

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    await db.query(
      "UPDATE password_reset_tokens SET token = $1, expire_at = $2, created_at = $3 WHERE user_id = $4",
      [
        token,
        new Date(Date.now() + 15 * 60 * 1000),
        new Date(),
        user.rows[0].id,
      ],
    );

    const reset_link = `http://your-frontend.com/reset-password/${token}`;

    sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset Request</h2>

      <p>Hello</p>

      <p>You requested to reset your password. Click the button below to proceed:</p>

      <a href="${reset_link}" 
         style="
           display: inline-block;
           padding: 10px 20px;
           margin: 10px 0;
           background-color: #007bff;
           color: #ffffff;
           text-decoration: none;
           border-radius: 5px;
         ">
         Reset Password
      </a>

      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p>${reset_link}</p>

      <hr />

      <p>If you did not request this, please ignore this email.</p>

      <p>This link will expire in 15 minutes.</p>

      <p>— Job Platform Team</p>
    </div>
  `,
    });

    res.status(200).json({ message: "link sent to your email" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const tokenData = await db.query(
      "SELECT * FROM password_reset_tokens WHERE token=$1 AND expire_at > NOW()",
      [token],
    );

    if (tokenData.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);

    await db.query(`UPDATE users SET password=$1 WHERE id=$2`, [
      hashedPassword,
      tokenData.rows[0].user_id,
    ]);

    await db.query(
      `UPDATE password_reset_tokens SET token=$1, expire_at=$2 WHERE token=$3`,
      [null, null, token],
    );

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User not exist with this email" });
    }
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    sendVerifyEmail(user.rows[0].email, token, user.rows[0].id);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const tokenData = await db.query(
      "SELECT * FROM email_verification_tokens WHERE token=$1 AND expire_at > NOW()",
      [token],
    );
    if (!tokenData.rows.length) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await db.query("SELECT * FROM users WHERE id=$1", [
      tokenData.rows[0].user_id,
    ]);
    if (user.rows[0].is_verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await db.query("UPDATE users SET is_email_verified=true WHERE id=$1", [
      tokenData.rows[0].user_id,
    ]);
    await db.query(
      "UPDATE email_verification_tokens SET token=$1, expire_at=$2 WHERE token=$3",
      [null, null, token],
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
};
