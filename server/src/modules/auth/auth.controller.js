import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../../utils/send-email.js";
import { sendVerifyEmail } from "../../utils/send_verify_email.js";
import { resetPasswordEmailHtml } from "../../data.js";
import dotenv from "dotenv";
dotenv.config();

const register = async (req, res) => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    professionalTitle,
    experienceLevel,
    educationLevel,
    gender,
    address,
    phoneNumber,
    companyName,
    foundingYear,
    industry,
    size,
    // optional jobseeker
    profileImage,
    linkedin,
    professionalSummary,
    cv,
    skills,
    experiences,
    educations,
    // optional employer
    website,
    description,
    missions,
    logo,
  } = req.body;

  // Validate required fields based on role
  if (role === "jobseeker") {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !address ||
      !phoneNumber ||
      !professionalTitle ||
      !experienceLevel ||
      !educationLevel ||
      !gender
    ) {
      return res.status(400).json({
        code_error: "ALL_FIELDS_REQUIRED",
        message: "All fields are required for job seekers.",
      });
    }
  } else if (role === "employer") {
    if (
      !email ||
      !password ||
      !companyName ||
      !industry ||
      !size ||
      !address ||
      !foundingYear ||
      !phoneNumber
    ) {
      return res.status(400).json({
        code_error: "ALL_FIELDS_REQUIRED",
        message: "All fields are required for employers.",
      });
    }
  } else {
    return res
      .status(400)
      .json({ code_error: "INVALID_ROLE", message: "Invalid user role." });
  }

  // Normalize email: lowercase + trim.
  const rawEmail =
    typeof email === "string" ? email.trim().toLowerCase() : email;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Hash the password before storing
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert user into database
    const newUser = await client.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id",
      [rawEmail, hashedPassword, role],
    );
    await client.query(
      "INSERT INTO password_reset_tokens (user_id) VALUES ($1)",
      [newUser.rows[0].id],
    );
    await client.query(
      "INSERT INTO email_verification_tokens (user_id) VALUES ($1)",
      [newUser.rows[0].id],
    );

    // Insert role-specific data
    if (role === "jobseeker") {
      const jobseekerResult = await client.query(
        "INSERT INTO job_seeker (user_id, first_name, last_name, professional_title, experience_level, education_level, gender, address, phone_number, profile_image, linkedin, professional_summary, cv, skills) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id",
        [
          newUser.rows[0].id,
          firstName,
          lastName,
          professionalTitle,
          experienceLevel,
          educationLevel,
          gender,
          address,
          phoneNumber,
          profileImage || null,
          linkedin || null,
          professionalSummary || null,
          cv || null,
          Array.isArray(skills) && skills.length > 0 ? skills : null,
        ],
      );

      const userId = jobseekerResult.rows[0].id;

      if (Array.isArray(experiences) && experiences.length > 0) {
        for (const exp of experiences) {
          if (exp && exp.title && exp.company && exp.from) {
            await client.query(
              'INSERT INTO experiences (user_id, title, company, "from", "to", is_current, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
              [
                userId,
                exp.title,
                exp.company,
                exp.from,
                exp.to || null,
                Boolean(exp.is_current),
                exp.description || null,
              ],
            );
          }
        }
      }

      if (Array.isArray(educations) && educations.length > 0) {
        for (const edu of educations) {
          if (edu && edu.degree && edu.institution && edu.from) {
            await client.query(
              'INSERT INTO educations (user_id, degree, institution, "from", "to", is_current, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
              [
                userId,
                edu.degree,
                edu.institution,
                edu.from,
                edu.to || null,
                Boolean(edu.is_current),
                edu.description || null,
              ],
            );
          }
        }
      }
    } else if (role === "employer") {
      const employerResult = await client.query(
        "INSERT INTO employers (user_id, company_name, industry, size, address, phone_number, founding_year, linkedin, website, description, missions, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id",
        [
          newUser.rows[0].id,
          companyName,
          industry,
          size,
          address,
          phoneNumber,
          foundingYear,
          linkedin || null,
          website || null,
          description || null,
          Array.isArray(missions) && missions.length > 0 ? missions : [],
          logo || null,
        ],
      );

      // Auto-assign Free plan to new employer
      const freePlan = await client.query(
        "SELECT id, duration FROM subscription_plans WHERE type = 'free' LIMIT 1",
      );

      if (freePlan.rows.length > 0) {
        const startDay = new Date();
        const endDay = new Date();
        endDay.setDate(endDay.getDate() + freePlan.rows[0].duration);

        const subscription = await client.query(
          `INSERT INTO subscriptions (employer_id, plan_id, start_day, end_day, status)
           VALUES ($1, $2, $3, $4, 'active')
           RETURNING id`,
          [employerResult.rows[0].id, freePlan.rows[0].id, startDay, endDay],
        );

        await client.query(
          `INSERT INTO subscription_usage (subscription_id, job_post_used, profile_access_used)
           VALUES ($1, 0, 0)`,
          [subscription.rows[0].id],
        );
      }
    }

    await client.query("COMMIT");

    // Send verification email AFTER commit, so a failure here
    // doesn't roll back a successfully registered user.
    sendVerifyEmail(rawEmail, newUser.rows[0].id);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(409).json({
        code_error: "USER_ALREADY_EXISTS",
        message: "User already exists.",
      });
    }

    res.status(500).json({
      code_error: "INTERNAL_SERVER_ERROR",
      message: "There is an error, try again.",
    });
  } finally {
    client.release();
  }
};

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error_code: "ALL_FIELDS_REQUIRED",
      message: "Email and password are required.",
    });
  }

  try {
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({
        error_code: "UNAUTHORIZED",
        message: "Password or email is incorrect",
      });
    }
    const isPasswordValid = await bcryptjs.compare(
      password,
      user.rows[0].password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        error_code: "UNAUTHORIZED",
        message: "Password or email is incorrect",
      });
    }

    let userData;
    if (user.rows[0].role === "jobseeker") {
      userData = await db.query("SELECT * FROM job_seeker WHERE user_id=$1", [
        user.rows[0].id,
      ]);
    } else {
      userData = await db.query("SELECT * FROM employers WHERE user_id=$1", [
        user.rows[0].id,
      ]);
    }

    if (userData.rows[0].status === "deactivated") {
      return res.status(403).json({
        error_code: "ACCOUNT_DEACTIVATED",
        message: "Account deactivated, contact support",
      });
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
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
      })
      .json({
        ...rest1,
        ...userData.rows[0],
      });
  } catch (error) {
    res.status(500).json({
      code_error: "INTERNAL_SERVER_ERROR",
      message: "There is an error, try again.",
    });
  }
};

const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
      })
      .json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

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

    const reset_link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: resetPasswordEmailHtml(reset_link),
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

    if (user.rows[0].is_email_verified) {
      return res.status(400).json({ message: "Email already verified" });
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
    if (user.rows[0].is_email_verified) {
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

const me = (req, res) => {
  res.status(200).json({ userId: req.user.userId, role: req.user.role });
};

export {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  me,
};
