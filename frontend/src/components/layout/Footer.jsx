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
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/add-recipe">Add Recipe</a>
            </li>
            <li>
              <a href="/recipes">Recipes</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <i className="fab fa-instagram"></i>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 DishDrop. All rights reserved.</p>
      </div>
    </footer>
  );
}
