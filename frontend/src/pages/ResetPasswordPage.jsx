import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
import "../styles/login.css";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) return alert("Passwords do not match");
    try {
      await resetPassword(token, newPassword);
      alert("Password updated. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div id="login">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="top">
            <h2>New Password</h2>
          </div>
          <div className="down">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}
