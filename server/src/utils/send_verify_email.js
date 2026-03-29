import db from "../config/db.js";
import { sendEmail } from "./send-email.js";

export const sendVerifyEmail = async (email, token, user_id) => {
  const url = `http://localhost:3000/verify-email?token=${token}`;
  try {
    await db.query(
      "UPDATE email_verification_tokens SET token = $1, expire_at = $2, created_at = $3 WHERE user_id = $4",
      [token, new Date(Date.now() + 24 * 60 * 60 * 1000), new Date(), user_id],
    );

    sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Email Verification</h2>

      <p>Hello,</p>

      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>

      <a href="${url}" 
         style="
           display: inline-block;
           padding: 10px 20px;
           margin: 10px 0;
           background-color: #28a745;
           color: #ffffff;
           text-decoration: none;
           border-radius: 5px;
         ">
         Verify Email
      </a>

      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p>${url}</p>

      <hr />

      <p>If you did not create an account, you can safely ignore this email.</p>

      <p>This verification link will expire in 24 hours.</p>

      <p>— Job Platform Team</p>
    </div>`,
    });
  } catch (error) {
    throw new Error("Failed to send verification email");
  }
};
