import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageGallery from "./ImageGallery";

export default function Modal({ recipe, onClose, currentUserId, onEdit, onDelete, onRate }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!recipe) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [recipe, onClose]);

  if (!recipe) return null;
  const isOwner = currentUserId && String(recipe.creator_id) === String(currentUserId);
  const images = recipe.images?.filter(Boolean) || [];
  const average = Number(recipe.averageRating || 0);
  const count = Number(recipe.ratingCount || 0);

  const handleRate = async (rating) => {
    if (!currentUserId) { navigate("/login", { state: { from: "/recipes" } }); return; }
    setIsSubmitting(true);
    setMessage("");
    try {
      await onRate(recipe.id, rating);
      setMessage("Your rating was saved. You can change it anytime.");
    } catch (error) {
      setMessage(error?.response?.data?.error || "We couldn’t save your rating. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  return <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <article className="modal-card" role="dialog" aria-modal="true" aria-labelledby="recipe-dialog-title">
      <button className="modal-close" onClick={onClose} aria-label="Close recipe">×</button>
      <ImageGallery images={images} name={recipe.name} />
      <div className="modal-content">
        <div className="modal-kicker"><span>{recipe.category}</span><span>{recipe.cuisine || "Other"}</span></div>
        <h2 id="recipe-dialog-title">{recipe.name}</h2>
        <p className="added-by">By {recipe.creator_username || "DishDrop cook"} · {new Date(recipe.date).toLocaleDateString()}</p>
        <section className="user-rating" aria-label="Rate this recipe">
          <div><strong>{count ? `${average.toFixed(1)} / 5` : "Not rated yet"}</strong><span>{count ? `${count} rating${count === 1 ? "" : "s"}` : "Be the first to rate it"}</span></div>
          <div className="rating-buttons">
            {[1,2,3,4,5].map((star) => <button key={star} disabled={isSubmitting} className={star <= Number(recipe.userRating || 0) ? "selected" : ""} onClick={() => handleRate(star)} aria-label={`${star} star${star === 1 ? "" : "s"}`} aria-pressed={star === recipe.userRating}><i className="fa-solid fa-star" aria-hidden="true" /></button>)}
          </div>
          {!currentUserId && <small>Log in to leave a rating.</small>}
          {message && <small role="status">{message}</small>}
        </section>
        <section className="recipe-copy"><h3>Ingredients</h3><p dir="auto">{recipe.ingredients}</p><h3>Instructions</h3><p dir="auto">{recipe.instructions}</p></section>
        {isOwner && <div className="modal-actions"><button onClick={() => onEdit(recipe)}>Edit recipe</button><button className="danger" onClick={() => onDelete(recipe.id)}>Delete recipe</button></div>}
      </div>
    </article>
  </div>;
}
