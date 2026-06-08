import { useState } from "react";
import { forgotPassword } from "../services/api";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage("Reset link sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="top">
          <h2>Reset Password</h2>
        </div>
        <div className="down">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
          <Link to="/login">Back to Login</Link>
          {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  );
}
