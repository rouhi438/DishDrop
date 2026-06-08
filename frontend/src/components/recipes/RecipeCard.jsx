import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/recipes.css";
import { useAuth } from "../../context/AuthContext";

export default function RecipeCard({
  recipe,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}) {
  const { user } = useAuth();
  let effectiveUserId = currentUserId;
  if (!effectiveUserId && user?.token) {
    try {
      const payload = JSON.parse(atob(user.token.split(".")[1]));
      effectiveUserId = payload.id;
    } catch (e) {}
  }
  const isOwner =
    effectiveUserId && String(recipe.creator_id) === String(effectiveUserId);
  const images = recipe.images?.length
    ? recipe.images
    : recipe.image
      ? [recipe.image]
      : [];

  return (
    <div className="recipe-card">
      <div className="image-slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={images.length > 1}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={images.length > 1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="card-swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`${recipe.name} - ${idx + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="details">
        <h3 className="recipe-name">
          <span className="label">Recipe Name:</span>
          <br />
          <span>{recipe.name}</span>
        </h3>
        <div className="meta-tags">
          <span className="category-name">{recipe.category}</span>
          <span className="cuisine-name">{recipe.cuisine || "Other"}</span>
        </div>
      </div>
      <div className="icon-holder">
        <div className="icons">
          <i
            className="fas fa-eye"
            onClick={() => onView(recipe)}
            title="View"
          ></i>
          {isOwner && (
            <i
              className="fas fa-edit"
              onClick={() => onEdit(recipe)}
              title="Edit"
            ></i>
          )}
          {isOwner && (
            <i
              className="fas fa-trash"
              onClick={() => onDelete(recipe.id)}
              title="Delete"
            ></i>
          )}
        </div>
        <div className="star">
          {(() => {
            const avg =
              recipe.averageRating ??
              (recipe.ratings && recipe.ratings.length
                ? recipe.ratings.reduce((a, b) => a + b.rating, 0) /
                  recipe.ratings.length
                : 0);
            const total = recipe.ratings ? recipe.ratings.length : 0;
            const filled = Math.round(avg);
            return (
              <>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <i
                      key={s}
                      className={`fa-star ${s <= filled ? "fas" : "far"}`}
                      style={{
                        color: s <= filled ? "#ff9a5a" : "#ccc",
                      }}
                    ></i>
                  ))}
                </div>
                <div className="avg-holder">
                  <strong style={{ color: "#ff9a5a" }}>{avg.toFixed(1)}</strong>
                  <span style={{ marginLeft: 6, color: "#666" }}>
                    ( {total} )
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
