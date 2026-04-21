import db from "../config/db.js";
import { sendEmail } from "./send-email.js";
import jwt from "jsonwebtoken";
import { verifyEmailHtml } from "../data.js";
import dotenv from "dotenv";
dotenv.config();

export const sendVerifyEmail = async (email, user_id) => {
  try {
    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await db.query(
      "UPDATE email_verification_tokens SET token = $1, expire_at = $2, created_at = $3 WHERE user_id = $4",
      [token, new Date(Date.now() + 24 * 60 * 60 * 1000), new Date(), user_id],
    );

    sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: verifyEmailHtml(url),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send verification email");
  }
};
