import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddRecipe = () =>
    navigate(user ? "/add-recipe" : "/login", {
      state: { from: "/add-recipe" },
    });

  return (
    <div className="home-wrapper">
      <section className="hero">
        <img
          className="background-image"
          src="/images/dishdrop-hero-background.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero-content">
          <p className="hero-eyebrow">Collect · Cook · Share</p>
          <h1 className="hero-title">
            Recipes worth making <em>again.</em>
          </h1>
          <p className="description">
            Keep your favorite dishes in one beautiful place, discover ideas
            from cooks around the world, and share what happens in your kitchen.
          </p>
          <div className="btn-holder">
            <button
              className="hero-btn hero-btn-primary"
              onClick={() => navigate("/recipes")}
            >
              Explore recipes <span aria-hidden="true">→</span>
            </button>
            <button
              className="hero-btn hero-btn-secondary"
              onClick={handleAddRecipe}
            >
              <i className="fa-solid fa-plus" aria-hidden="true"></i> Add your
              recipe
            </button>
          </div>
          <div className="hero-note">
            <span></span> Real recipes from real cooks
          </div>
        </div>
      </section>
    </div>
  );
}
