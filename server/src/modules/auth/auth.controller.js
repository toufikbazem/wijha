import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../../utils/send-email.js";
import { sendVerifyEmail } from "../../utils/send_verify_email.js";
import dotenv from "dotenv";
dotenv.config();

const register = async (req, res) => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    address,
    phoneNumber,
    companyName,
    industry,
    size,
  } = req.body;

  if (role === "jobseeker") {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !address ||
      !phoneNumber
    ) {
      res
        .status(400)
        .json({ message: "All fields are required for job seekers." });
    }
  } else if (role === "employer") {
    if (!email || !password || !companyName || !industry || !size || !address) {
      res
        .status(400)
        .json({ message: "All fields are required for employers." });
    }
  } else {
    res.status(400).json({ message: "Invalid user role." });
  }

  let newUser;

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists." });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    newUser = await db.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id",
      [email, hashedPassword, role],
    );
    await db.query("INSERT INTO password_reset_tokens (user_id) VALUES ($1)", [
      newUser.rows[0].id,
    ]);
    await db.query(
      "INSERT INTO email_verification_tokens (user_id) VALUES ($1)",
      [newUser.rows[0].id],
    );

    sendVerifyEmail(email, newUser.rows[0].id);

    if (role === "jobseeker") {
      await db.query(
        "INSERT INTO job_seeker (user_id, first_name, last_name, address, phone_number) VALUES ($1, $2, $3, $4, $5)",
        [newUser.rows[0].id, firstName, lastName, address, phoneNumber],
      );
    } else if (role === "employer") {
      await db.query(
        "INSERT INTO employers (user_id, company_name, industry, size, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6)",
        [newUser.rows[0].id, companyName, industry, size, address, phoneNumber],
      );
    }
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    await db.query("DELETE FROM users WHERE id=$1", [newUser.rows[0].id]);
    res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Password or email is incorrect" });
    }
    const isPasswordValid = bcryptjs.compareSync(
      password,
      user.rows[0].password,
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Password or email is incorrect." });
    }

    if (user.rows[0].status === "desactivated") {
      res
        .status(403)
        .json({ message: "Account desactivated, contact support" });
    }

    if (user.rows[0].role === "jobseeker") {
      var userData = await db.query(
        "SELECT * FROM jobseeker WHERE user_id=$1",
        [user.rows[0].id],
      );
    } else {
      var userData = await db.query("SELECT * FROM company WHERE user_id=$1", [
        user.rows[0].id,
      ]);
    }

    const token = jwt.sign(
      { userId: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" },
    );

    const { password: pass, ...rest1 } = user.rows[0];

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/",
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
      })
      .json({
        ...rest1,
        ...userData.rows[0],
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

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

    sendVerifyEmail(user.rows[0].email, user.rows[0].id);

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
