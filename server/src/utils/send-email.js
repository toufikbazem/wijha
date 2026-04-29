import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  console.log(to)

  return await transporter.sendMail({
    from: `wijha.emploi@gmail.com`,
    to,
    subject,
    html,
  });
};
