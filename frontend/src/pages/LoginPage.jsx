import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(username, password, email);
      } else {
        await login(username, password);
      }
      navigate(location.state?.from || "/");
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Unknown error";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (registerMode) => {
    setIsRegister(registerMode);
    setError("");
  };

  return (
    <AuthShell
      eyebrow={isRegister ? "Join the table" : "Welcome back"}
      title={isRegister ? "Create your account" : "Log in to DishDrop"}
      description={
        isRegister
          ? "Start collecting and sharing recipes in one simple place."
          : "Your saved recipes and account are waiting for you."
      }
    >
      <div className="auth-tabs" aria-label="Choose account action">
        <button
          type="button"
          className={!isRegister ? "active" : ""}
          aria-pressed={!isRegister}
          onClick={() => switchMode(false)}
        >
          Log in
        </button>
        <button
          type="button"
          className={isRegister ? "active" : ""}
          aria-pressed={isRegister}
          onClick={() => switchMode(true)}
        >
          Create account
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {isRegister && (
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        <div className="auth-field">
          <div className="auth-label-row">
            <label htmlFor="password">Password</label>
            {!isRegister && <Link to="/forgot-password">Forgot password?</Link>}
          </div>
          <div className="auth-password">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={isRegister ? 8 : undefined}
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="auth-eye"
              onClick={() => setShowPassword((visible) => !visible)}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`} />
            </button>
          </div>
        </div>

        {error && <p className="auth-message error" role="alert">{error}</p>}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting
            ? isRegister ? "Creating account…" : "Logging in…"
            : isRegister ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="auth-switch">
        {isRegister ? "Already have an account?" : "New to DishDrop?"}{" "}
        <button type="button" onClick={() => switchMode(!isRegister)}>
          {isRegister ? "Log in" : "Create an account"}
        </button>
      </p>
    </AuthShell>
  );
}
