require("dotenv").config();

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const requireEnv = (name) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

exports.sendResetEmail = async (toEmail, resetLink) => {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": requireEnv("BREVO_API_KEY"),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "DishDrop",
        email: requireEnv("BREVO_SENDER_EMAIL"),
      },
      to: [{ email: toEmail }],
      subject: "Password Reset - DishDrop",
      htmlContent: `
        <p>You requested a password reset for your DishDrop account.</p>
        <p><a href="${escapeHtml(resetLink)}">Reset your password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Brevo API request failed (${response.status}): ${details.slice(0, 300)}`
    );
  }
};
