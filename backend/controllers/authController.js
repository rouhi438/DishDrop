const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { sendResetEmail } = require("../services/emailService");

const usersPath = path.join(__dirname, "../users.json");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function readUsers() {
  return JSON.parse(fs.readFileSync(usersPath));
}
function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  const users = readUsers();
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "Username exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    username,
    password: hashed,
    email,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  };
  users.push(newUser);
  writeUsers(users);
  const token = jwt.sign(
    {
      id: newUser.id,
      username: newUser.username,
      isAdmin: newUser.isAdmin || false,
    },
    JWT_SECRET,
  );
  res.json({ token, user: username });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin || false },
    JWT_SECRET,
  );
  res.json({ token, user: username });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ error: "Email not found" });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 3600000; // 1 hour

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  writeUsers(users);

  const resetLink = `http://localhost:5173/reset-password/${token}`;
  await sendResetEmail(email, resetLink);
  res.json({ message: "Reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const users = readUsers();
  const user = users.find(
    (u) =>
      u.resetPasswordToken === token && u.resetPasswordExpires > Date.now(),
  );
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  writeUsers(users);
  res.json({ message: "Password updated" });
};
