import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
import AuthShell from "../components/auth/AuthShell";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Could not reset your password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Almost there"
      title="Choose a new password"
      description="Use at least eight characters and make it something only you know."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <div className="auth-field">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Type it again"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {error && (
          <p className="auth-message error" role="alert">
            {error}
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
