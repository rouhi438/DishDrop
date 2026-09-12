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
        <Link to="/" className="utensil-icon" aria-label="DishDrop home">
          <i className="fa-solid fa-utensils"></i>
        </Link>
        <Link to="/" className="app-name">
          DishDrop
        </Link>
      </div>
      <div className="right-side">
        <Link to="/recipes" className="nav-link">Recipes</Link>
        <Link to={user ? "/add-recipe" : "/login"} className="nav-link">Add recipe</Link>
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
        {!user && <Link to="/login" className="login-nav-btn">Log in</Link>}
      </div>
    </header>
  );
}
