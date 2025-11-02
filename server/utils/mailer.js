// utils/mailer.js
import nodemailer from "nodemailer";

export function createTransport() {
  // Example: use SMTP credentials from .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,     // e.g., smtp.resend.com or smtp.gmail.com
    port: Number(process.env.SMTP_PORT || 587),
    secure: !!Number(process.env.SMTP_SECURE || 0), // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendResetEmail({ to, resetUrl }) {
  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"LexiBot" <no-reply@lexibot.ai>',
    to,
    subject: "Reset your LexiBot password",
    html: `
      <div style="font-family:system-ui,sans-serif">
        <h2>Reset your password</h2>
        <p>Click the link below to set a new password. This link expires soon.</p>
        <p><a href="${resetUrl}" style="background:#4f46e5;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none">Reset Password</a></p>
        <p>If you did not request this change, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendVerificationEmail({ to, verificationUrl }) {
  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"LexiBot" <no-reply@lexibot.ai>',
    to,
    subject: "Verify your LexiBot account",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#4f46e5">Welcome to LexiBot!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p style="margin:20px 0">
          <a href="${verificationUrl}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Verify Email Address</a>
        </p>
        <p style="color:#666;font-size:14px">This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
      </div>
    `,
  });
}