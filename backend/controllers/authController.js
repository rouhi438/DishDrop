const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendResetEmail } = require("../services/emailService");
const { getJwtSecret, requireEnv } = require("../config/env");

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,40}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(username, password, email) {
  if (!USERNAME_PATTERN.test(String(username || ""))) return "Username must be 3–40 valid characters";
  if (typeof password !== "string" || password.length < 8 || password.length > 128) return "Password must be 8–128 characters";
  if (email !== undefined && !EMAIL_PATTERN.test(String(email).trim())) return "A valid email is required";
  return null;
}

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  const validationError = validateCredentials(username, password, email);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ $or: [{ username }, { email: normalizedEmail }] });
    if (existing) return res.status(409).json({ error: "Username or email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed, email: normalizedEmail });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, username, isAdmin: false },
      getJwtSecret(),
      { expiresIn: "7d" },
    );
    res.json({ token, user: username });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!USERNAME_PATTERN.test(String(username || "")) || typeof password !== "string" || !password) {
    return res.status(400).json({ error: "Invalid username or password" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, username, isAdmin: user.isAdmin },
      getJwtSecret(),
      { expiresIn: "7d" },
    );
    res.json({ token, user: username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return res.status(400).json({ error: "A valid email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "If the email exists, a reset link has been sent" });
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const resetLink = `${requireEnv("FRONTEND_URL").replace(/\/$/, "")}/reset-password/${token}`;
    await sendResetEmail(email, resetLink);
    res.json({ message: "Reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 128) {
    return res.status(400).json({ error: "Password must be 8–128 characters" });
  }
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reset failed" });
  }
};

exports.validateCredentials = validateCredentials;
