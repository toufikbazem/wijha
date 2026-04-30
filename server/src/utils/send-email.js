import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend("re_MeZJPGZX_B9DuyPBj45ZUFoeGQBNmJcci");

// export const sendEmail = async ({ to, subject, html }) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   return transporter.sendMail({
//     from: `toufikbazem@gmail.com`,
//     to,
//     subject,
//     html,
//   });
// };
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Wijha <noreply@wijha-dz.com>",
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};
