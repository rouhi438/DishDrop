import { useState } from "react";
import "../../styles/recipes.css";

export default function ImageGallery({ images, name = "Recipe" }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0)
    return <div className="no-image">No image</div>;

  return (
    <div className="image-gallery">
      <img
        src={images[current]}
        alt={`${name}, image ${current + 1}`}
        className="gallery-main"
      />
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={idx === current ? "active" : ""}
              aria-label={`Show image ${idx + 1} of ${images.length}`}
              aria-pressed={idx === current}
            >
              <img src={img} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
