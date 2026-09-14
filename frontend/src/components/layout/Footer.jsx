import { Link } from "react-router-dom";
import "../../styles/layout.css";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>DishDrop</h3>
          <p>Your favorite recipe manager</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add-recipe">Add Recipe</Link>
            </li>
            <li>
              <Link to="/recipes">Recipes</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section footer-statement">
          <p>Made for cooks who keep the good ones.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DishDrop. All rights reserved.</p>
      </div>
    </footer>
  );
}
