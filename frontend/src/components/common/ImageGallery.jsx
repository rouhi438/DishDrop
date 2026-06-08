import { useState } from "react";
import "../../styles/recipes.css";

export default function ImageGallery({ images }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0)
    return <div className="no-image">No image</div>;

  return (
    <div className="image-gallery">
      <img
        src={images[current]}
        alt={`slide ${current}`}
        className="gallery-main"
        style={{ width: "100%", height: "260px", objectFit: "cover" }}
      />
      {images.length > 1 && (
        <div
          className="gallery-thumbs"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            marginTop: "10px",
            overflowX: "auto",
          }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              onClick={() => setCurrent(idx)}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "8px",
                cursor: "pointer",
                opacity: idx === current ? 1 : 0.6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
