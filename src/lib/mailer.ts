// src/lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // use true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTicketEmail({
  toEmail,
  fullName,
  eventName,
  ticketCode,
  qrCodeUrl,
}: {
  toEmail: string;
  fullName: string;
  eventName: string;
  ticketCode: string;
  qrCodeUrl: string;
}) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: `Your Ticket for "${eventName}"`,
    html: `
      <p>Hi ${fullName},</p>
      <p>Thank you for registering for the event "<strong>${eventName}</strong>". Your ticket has been generated.</p>
      <p><strong>Ticket Code:</strong> ${ticketCode}</p>
      <p><strong>QR Code:</strong><br/>
         <img src="${qrCodeUrl}" alt="QR Code" /></p>
      <p>Please bring this ticket with you to the event for check-in.</p>
      <p>Best regards,<br/>Event Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
