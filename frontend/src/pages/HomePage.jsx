import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FoodTicker from "../components/common/FoodTicker";
import "../styles/home.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddRecipe = () => {
    if (user) {
      navigate("/add-recipe");
    } else {
      const confirmLogin = window.confirm(
        "You must be logged in to add a recipe. Would you like to proceed to the login page?",
      );
      if (confirmLogin) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="home-wrapper">
      <section className="hero">
        <video
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          title=""
        >
          <source src="/images/video.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <p className="welcome">Welcome to</p>
          <h2 className="title">DishDrop</h2>
          <p className="description">Manage Your Favorite Recipes Easily!</p>
          <div className="btn-holder">
            <div className="add-holder" onClick={handleAddRecipe}>
              <i className="fa-solid fa-plus plus-icon"></i>
              <button className="add-btn">Add New Recipe</button>
            </div>
            <div className="view-holder" onClick={() => navigate("/recipes")}>
              <i className="fa-solid fa-receipt plus-icon"></i>
              <button className="view-btn">View Recipes</button>
            </div>
          </div>
        </div>
        <FoodTicker />
      </section>
    </div>
  );
}
