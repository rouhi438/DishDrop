import { Link } from "react-router-dom";
import "../../styles/login.css";

export default function AuthShell({ eyebrow, title, description, children }) {
  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="About DishDrop">
        <Link to="/" className="auth-brand" aria-label="DishDrop home">
          <span className="auth-brand-icon" aria-hidden="true">
            <i className="fa-solid fa-utensils" />
          </span>
          <span>DishDrop</span>
        </Link>

        <div className="auth-story-copy">
          <p className="auth-kicker">Cook. Share. Remember.</p>
          <h1>
            Good recipes deserve a <em>place to stay.</em>
          </h1>
          <p>
            Keep the dishes you love close, discover new favorites, and share
            something worth cooking again.
          </p>
        </div>

        <p className="auth-story-note">Made for real kitchens and real cooks.</p>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <Link to="/" className="auth-mobile-brand" aria-label="DishDrop home">
            <span className="auth-brand-icon" aria-hidden="true">
              <i className="fa-solid fa-utensils" />
            </span>
            <span>DishDrop</span>
          </Link>
          <p className="auth-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {description && <p className="auth-description">{description}</p>}
          {children}
        </div>
      </section>
    </main>
  );
}
