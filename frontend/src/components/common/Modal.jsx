import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/recipes.css";
import ImageGallery from "./ImageGallery";

export default function Modal({
  recipe,
  onClose,
  currentUserId,
  recipeNumber,
  onEdit,
  onDelete,
  onUpdateRating,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getEffectiveUserId = () => {
    if (currentUserId) return currentUserId;
    if (user?.token) {
      try {
        const payload = JSON.parse(atob(user.token.split(".")[1]));
        return payload.id;
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  };
  const effectiveUserId = getEffectiveUserId();

  const images = recipe?.images?.length
    ? recipe.images
    : recipe?.image
      ? [recipe.image]
      : [];

  const getExistingRating = () => {
    //if (!currentUserId || !recipe?.ratings) return null;
    if (!effectiveUserId || !recipe?.ratings) return null;

    const found = recipe.ratings.find((r) => r.userId === effectiveUserId);
    return found ? found.rating : null;
  };

  const [userRating, setUserRating] = useState(getExistingRating());
  const [average, setAverage] = useState(recipe?.averageRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rated, setRated] = useState(!!getExistingRating());

  useEffect(() => {
    const existing = getExistingRating();
    if (existing) {
      setUserRating(existing);
      setRated(true);
    }
  }, [effectiveUserId, recipe?.ratings]);

  useEffect(() => {
    // Keep average and rated state in sync when parent updates the recipe
    if (recipe?.ratings) {
      const sum = recipe.ratings.reduce((acc, r) => acc + r.rating, 0);
      const avg = recipe.ratings.length ? sum / recipe.ratings.length : 0;
      setAverage(avg);
      const existing = getExistingRating();
      setUserRating(existing);
      setRated(!!existing);
    } else if (typeof recipe?.averageRating === "number") {
      setAverage(recipe.averageRating || 0);
    }
  }, [recipe?.ratings, recipe?.averageRating, effectiveUserId]);

  if (!recipe) return null;

  const handleRate = async (rating) => {
    if (rated || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/recipes/${recipe.id}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save rating");
        return;
      }
      const newRatings = data.ratings || [];
      const sum = newRatings.reduce((acc, r) => acc + r.rating, 0);
      const newAvg = newRatings.length ? sum / newRatings.length : 0;
      setAverage(newAvg);
      setUserRating(rating);
      setRated(true);
      if (typeof onUpdateRating === "function")
        onUpdateRating(recipe.id, newRatings);
    } catch (err) {
      console.error("Error in handleRate:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (star) => {
    if (!effectiveUserId) {
      const confirmLogin = window.confirm(
        "You must be logged in to rate this recipe. Would you like to go to the login page?",
      );
      if (confirmLogin) {
        navigate("/login");
      }
      return;
    }
    if (!rated) {
      handleRate(star);
    }
  };

  const isOwner =
    effectiveUserId && String(recipe.creator_id) === String(effectiveUserId);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <ImageGallery images={images} />
        {recipeNumber && <div className="recipe-number">#{recipeNumber} </div>}

        {isOwner && (
          <div className="modal-actions">
            <button className="modal-edit-btn" onClick={() => onEdit(recipe)}>
              <i className="fas fa-edit"></i> Edit
            </button>
            <button
              className="modal-delete-btn"
              onClick={() => {
                if (window.confirm("Are you sure to delete this recipe?")) {
                  onDelete(recipe.id);
                  onClose();
                }
              }}
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        )}

        <div className="user-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fa-star ${star <= (userRating || 0) ? "fas" : "far"}`}
                style={{
                  cursor: !effectiveUserId || rated ? "not-allowed" : "pointer",
                  color: star <= (userRating || 0) ? "#ff9a5a" : "#ccc",
                  fontSize: "25px",
                  opacity: rated ? 0.4 : 1,
                }}
                onClick={() => handleStarClick(star)}
              ></i>
            ))}
          </div>
          <div className="average-display">
            Rate : <span className="rate-num">{average.toFixed(1)}</span> / 5
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <h2>{recipe.name}</h2>
          <p className="recipe-id">
            <b>ID:</b> {recipe.id}
          </p>
          <p className="added-by">
            <b>Creator:</b> {recipe.creator_username || recipe.creator_id}
          </p>
          <p className="added-by">
            <b>Date:</b> {new Date(recipe.date).toLocaleDateString()}
          </p>
          <h4>Ingredients</h4>
          <p>{recipe.ingredients}</p>
          <h4>Instructions</h4>
          <p>{recipe.instructions}</p>
        </div>
      </div>
    </div>
  );
}
