import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(username, password, email);
      } else {
        await login(username, password);
      }
      navigate("/");
    } catch (err) {
      console.error("Full error object:", err);
      const message =
        err.response?.data?.error || err.message || "Unknown error";
      alert("Login error: " + message);
    }
  };
  const togglePassVisiblity = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="top">
          <h2 data-text="Welcome to DishDrop" className="title">
            Welcome to DishDrop
          </h2>
        </div>
        <div className="down">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {isRegister && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <div className="pass-holder">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />{" "}
            <i
              className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} eye-icon`}
              onClick={togglePassVisiblity}
            ></i>
          </div>
          <button type="submit">{isRegister ? "Register" : "Login"}</button>
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister
              ? "Already have an account? Login"
              : "Create new account"}
          </button>
          {!isRegister && <Link to="/forgot-password">Forgot password?</Link>}
        </div>
      </form>
    </div>
  );
}
