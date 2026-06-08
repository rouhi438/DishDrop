import { useRef } from "react";

export default function ImageUploader({ image, setImage }) {
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file (jpg, png, etc.)");
    }
  };

  const triggerFileInput = () => {
    inputRef.current.click();
  };

  return (
    <div className="image-frame">
      {image ? (
        <img
          id="recipe-image"
          src={image}
          alt="Recipe"
          onClick={triggerFileInput}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <div
          className="image-placeholder"
          onClick={triggerFileInput}
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: "#f0f0f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "12px",
            border: "2px dashed #ccc",
          }}
        >
          <i
            className="fa-solid fa-cloud-upload-alt"
            style={{ fontSize: "48px", color: "#999" }}
          ></i>
          <p style={{ marginTop: "10px", color: "#666" }}>
            Click to upload image
          </p>
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      {image && (
        <button
          type="button"
          onClick={() => setImage("")}
          className="remove-image-btn"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
