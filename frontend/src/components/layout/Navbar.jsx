import { useAuth } from "../../context/AuthContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
        <Link to="/" className="brand-copy">
          <span className="app-name">DishDrop</span>
          <span className="brand-tagline">Cook · Share · Inspire</span>
        </Link>
      </div>
      <div className="right-side">
        <NavLink
          to="/recipes"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Recipes
        </NavLink>
        <NavLink
          to={user ? "/add-recipe" : "/login"}
          state={user ? undefined : { from: "/add-recipe" }}
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Add recipe
        </NavLink>
        {user && user.isAdmin && (
          <NavLink to="/admin" className="admin-link">
            <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            Admin Panel
          </NavLink>
        )}
        {user && (
          <details className="account-menu">
            <summary aria-label={`Open account menu for ${user.username}`}>
              <span className="account-avatar" aria-hidden="true">
                {user.username.charAt(0).toUpperCase()}
              </span>
              <span className="user-account">{user.username}</span>
              <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </summary>
            <div className="account-popover">
              <p>Signed in as</p>
              <strong>{user.username}</strong>
              <Link to="/add-recipe"><i className="fa-solid fa-plus" /> Add a recipe</Link>
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt" /> Log out
              </button>
            </div>
          </details>
        )}
        {!user && <Link to="/login" className="login-nav-btn">Log in</Link>}
      </div>
    </header>
  );
}
