import nodemailer from "nodemailer";

// ─────────────────────────────────────────────
// Transporter Configuration
// ─────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.EMAIL_FROM || "Kishtwar Tourism <noreply@kishtwar.gov.in>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Kishtwar Tourism";

// ─────────────────────────────────────────────
// Email Templates
// ─────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f0e1; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0a2916, #1a5632); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .header p { color: #dcfce7; margin: 5px 0 0; font-size: 14px; }
        .content { padding: 30px; color: #333; line-height: 1.6; }
        .btn { display: inline-block; background: #1a5632; color: #ffffff !important; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 15px 0; }
        .footer { background: #f0fdf4; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .divider { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${APP_NAME}</h1>
          <p>Land of Sapphire, Saffron & Shrines</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          <p>Kishtwar, Jammu & Kashmir, India</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─────────────────────────────────────────────
// Send Functions
// ─────────────────────────────────────────────

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const verifyUrl = `${APP_URL}/verify-email/${token}`;

  const html = baseTemplate(`
    <h2>Welcome, ${name}! 🎉</h2>
    <p>Thank you for joining ${APP_NAME}. Please verify your email address to get started.</p>
    <p style="text-align: center;">
      <a href="${verifyUrl}" class="btn">Verify Email Address</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #666;">If you didn't create an account, you can safely ignore this email. This link expires in 24 hours.</p>
    <p style="font-size: 12px; color: #999;">Or copy this link: ${verifyUrl}</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Verify your email - ${APP_NAME}`,
    html,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password/${token}`;

  const html = baseTemplate(`
    <h2>Password Reset Request</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    <p style="text-align: center;">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #666;">This link expires in 1 hour. If you didn't request a password reset, please ignore this email.</p>
    <p style="font-size: 12px; color: #999;">Or copy this link: ${resetUrl}</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Reset your password - ${APP_NAME}`,
    html,
  });
}

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<void> {
  const html = baseTemplate(`
    <h2>Welcome to ${APP_NAME}! 🏔️</h2>
    <p>Hi ${name},</p>
    <p>Your email has been verified and your account is now active. You can now:</p>
    <ul>
      <li>Explore breathtaking tourist places</li>
      <li>Read and write travel blogs</li>
      <li>Browse our photo gallery</li>
      <li>Save your favorite destinations</li>
      <li>Comment and share your experiences</li>
    </ul>
    <p style="text-align: center;">
      <a href="${APP_URL}" class="btn">Start Exploring</a>
    </p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Welcome to ${APP_NAME}!`,
    html,
  });
}

export async function sendContentApprovedEmail(
  to: string,
  name: string,
  contentType: string,
  contentTitle: string,
  contentUrl: string
): Promise<void> {
  const html = baseTemplate(`
    <h2>Content Approved! ✅</h2>
    <p>Hi ${name},</p>
    <p>Great news! Your ${contentType} "<strong>${contentTitle}</strong>" has been approved and published.</p>
    <p style="text-align: center;">
      <a href="${APP_URL}${contentUrl}" class="btn">View Published Content</a>
    </p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Your ${contentType} has been approved - ${APP_NAME}`,
    html,
  });
}

export async function sendContentRejectedEmail(
  to: string,
  name: string,
  contentType: string,
  contentTitle: string,
  reason?: string
): Promise<void> {
  const html = baseTemplate(`
    <h2>Content Review Update</h2>
    <p>Hi ${name},</p>
    <p>Your ${contentType} "<strong>${contentTitle}</strong>" needs some changes before it can be published.</p>
    ${reason ? `<p><strong>Feedback:</strong> ${reason}</p>` : ""}
    <p>Please review the feedback and resubmit when ready.</p>
    <p style="text-align: center;">
      <a href="${APP_URL}/contributor" class="btn">Go to Dashboard</a>
    </p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Content review update - ${APP_NAME}`,
    html,
  });
}

export async function sendContactNotificationEmail(
  to: string,
  fromName: string,
  fromEmail: string,
  subject: string,
  message: string
): Promise<void> {
  const html = baseTemplate(`
    <h2>New Contact Message 📬</h2>
    <p>You have received a new message:</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px; font-weight: bold; color: #555;">From:</td><td style="padding: 8px;">${fromName}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;">${fromEmail}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #555;">Subject:</td><td style="padding: 8px;">${subject}</td></tr>
    </table>
    <hr class="divider">
    <p>${message}</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `New message from ${fromName} - ${APP_NAME}`,
    html,
  });
}
