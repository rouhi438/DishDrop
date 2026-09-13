import { Swiper, SwiperSlide } from "swiper/react";
import {Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/recipes.css";

export default function RecipeCard({ recipe, currentUserId, onView, onEdit, onDelete }) {
  const isOwner = currentUserId && String(recipe.creator_id) === String(currentUserId);
  const images = recipe.images?.filter(Boolean) || [];
  const average = Number(recipe.averageRating || 0);
  const count = Number(recipe.ratingCount || 0);

  return (
    <article className="recipe-card">
      <button className="recipe-image-button" onClick={() => onView(recipe)} aria-label={`View ${recipe.name}`}>
        {images.length ? <Swiper modules={[Autoplay, Navigation, Pagination]} navigation={images.length > 1} pagination={images.length > 1 ? { clickable: true } : false} autoplay={images.length > 1 ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true } : false} speed={650} loop={images.length > 1} className="card-swiper">
          {images.map((image, index) => <SwiperSlide key={`${image.slice(0, 30)}-${index}`}><img src={image} alt={index === 0 ? recipe.name : `${recipe.name}, image ${index + 1}`} loading="lazy" /></SwiperSlide>)}        </Swiper> : <div className="recipe-placeholder" aria-hidden="true"><i className="fa-solid fa-utensils" /></div>}
      </button>
      <div className="recipe-card-body">
        <div className="meta-tags"><span>{recipe.category}</span><span>{recipe.cuisine || "Other"}</span></div>
        <h2 dir="auto">{recipe.name}</h2>
        <p className="creator">By {recipe.creator_username || "DishDrop cook"}</p>
        <div className="card-footer">
          <div className="rating-summary" aria-label={count ? `${average.toFixed(1)} out of 5 from ${count} ratings` : "Not rated yet"}>
            <i className="fa-solid fa-star" aria-hidden="true" /><strong>{count ? average.toFixed(1) : "New"}</strong>{count > 0 && <span>({count})</span>}
          </div>
          <div className="card-actions">
            <button onClick={() => onView(recipe)} aria-label={`View ${recipe.name}`}><i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
            {isOwner && <button onClick={() => onEdit(recipe)} aria-label={`Edit ${recipe.name}`}><i className="fa-solid fa-pen" aria-hidden="true" /></button>}
            {isOwner && <button className="danger" onClick={() => onDelete(recipe.id)} aria-label={`Delete ${recipe.name}`}><i className="fa-solid fa-trash" aria-hidden="true" /></button>}
          </div>
        </div>
      </div>
    </article>
  );
}
