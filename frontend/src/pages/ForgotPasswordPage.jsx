import { useState } from "react";
import { forgotPassword } from "../services/api";
import { Link } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setMessage("Reset link sent to your email.");
      setIsError(false);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error");
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email connected to your account and we’ll send you a reset link."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="recovery-email">Email</label>
          <input
            id="recovery-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && (
          <p className={`auth-message ${isError ? "error" : "success"}`} role={isError ? "alert" : "status"}>
            {message}
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <Link className="auth-back" to="/login">← Back to log in</Link>
    </AuthShell>
  );
}
