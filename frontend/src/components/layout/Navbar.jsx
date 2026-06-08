import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/layout.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="navbar">
      <div className="left-side">
        <Link to="/" className="utensil-icon">
          <i className="fa-solid fa-utensils"></i>
        </Link>
        <Link to="/" className="app-name">
          DishDrop
        </Link>
      </div>
      <div className="right-side">
        {user && user.isAdmin && (
          <Link to="/admin" className="admin-link">
            Admin Panel
          </Link>
        )}
        {user && <span className="user-account">{user?.username}</span>}

        {user && (
          <button onClick={handleLogout} className="logout-nav-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        )}
        <span className="user-icon">
          <i className="fa-solid fa-user"></i>
        </span>
      </div>
    </header>
  );
}
