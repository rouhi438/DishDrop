import { useState, useEffect, useRef } from "react";
import "../../styles/add.css";

export default function RecipeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    cuisine: "Other",
    category: "",
    images: ["", "", ""],
  });
  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (initialData) {
      const existingImages =
        initialData.images || (initialData.image ? [initialData.image] : []);
      const filled = [...existingImages];
      while (filled.length < 3) filled.push("");
      setForm({
        name: initialData.name || "",
        ingredients: initialData.ingredients || "",
        instructions: initialData.instructions || "",
        cuisine: initialData.cuisine || "Other",
        category: initialData.category || "",
        images: filled.slice(0, 3),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newImages = [...form.images];
      newImages[index] = ev.target.result;
      setForm({ ...form, images: newImages });
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // reset input
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.ingredients ||
      !form.instructions ||
      !form.category
    ) {
      alert("Please fill all fields");
      return;
    }
    const validImages = form.images.filter((img) => img && img.trim() !== "");
    if (validImages.length === 0) {
      alert("Please add at least one image");
      return;
    }
    onSubmit({ ...form, images: validImages });
  };

  return (
    <form className="recipe-form-grid" onSubmit={handleSubmit}>
      <div className="form-left">
        <div className="input-holder">
          <div className="food-name-input">
            <label>Name Of Food :</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Food Name..."
              required
            />
          </div>
          <div className="cuisine">
            <label>Cuisine :</label>
            <select
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              required
            >
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Chinese">Chinese</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option>
              <option value="Thai">Thai</option>
              <option value="Turkish">Turkish</option>
              <option value="Iranian">Iranian</option>
              <option value="French">French</option>
              <option value="Greek">Greek</option>
              <option value="Spanish">Spanish</option>
              <option value="Korean">Korean</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Lebanese">Lebanese</option>
              <option value="Moroccan">Moroccan</option>
              <option value="Scandinavian">Scandinavian</option>
              <option value="American">American</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="category">
            <label>Choose Category :</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Main">Main Dish</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Quick Meal">Quick Meal</option>
            </select>
          </div>
        </div>
        <label>Ingredients :</label>
        <textarea
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          placeholder="Ingredients..."
          rows="4"
          required
        />
        <label>Instructions :</label>
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          placeholder="Instructions..."
          rows="6"
          required
        />
        <div className="btn-holder">
          <button className="add-item-btn" type="submit">
            {initialData ? "Update Recipe" : "Add Recipe"}
          </button>
          <button className="cancel-btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
      <div className="form-right">
        <div className="images-grid">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="image-card"
              onClick={() => fileInputRefs[idx].current.click()}
            >
              {form.images[idx] ? (
                <div className="image-preview">
                  <img src={form.images[idx]} alt={`preview ${idx}`} />
                  <button
                    type="button"
                    className="remove-img"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newImages = [...form.images];
                      newImages[idx] = "";
                      setForm({ ...form, images: newImages });
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <i className="fas fa-cloud-upload-alt upload-icon"></i>
                  <span>Upload Image {idx + 1}</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRefs[idx]}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(idx, e)}
              />
            </div>
          ))}
        </div>
        <small className="hint-right">
          Click on each box to upload an image (max 3). First image is cover.
        </small>
      </div>
    </form>
  );
}
