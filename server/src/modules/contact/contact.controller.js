import { sendEmail } from "../../utils/send-email.js";

export const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #008CBA;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 8px;">${subject}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
              <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return res.status(200).json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact email error:", err);
    return res.status(500).json({ message: "Failed to send message. Please try again." });
  }
};
