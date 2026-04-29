import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
port: 587,
secure: false
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
