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
      <section className="form-left form-panel">
        <div className="form-section-heading">
          <span className="section-number">01</span>
          <div>
            <h2>Recipe details</h2>
            <p>Tell the community what makes this dish special.</p>
          </div>
        </div>
        <div className="input-holder">
          <div className="food-name-input field-group">
            <label htmlFor="recipe-name">Recipe name</label>
            <input
              id="recipe-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Creamy mushroom pasta"
              required
            />
          </div>
          <div className="cuisine field-group">
            <label htmlFor="recipe-cuisine">Cuisine</label>
            <select
              id="recipe-cuisine"
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
          <div className="category field-group">
            <label htmlFor="recipe-category">Category</label>
            <select
              id="recipe-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Main">Main Dish</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Quick Meal">Quick Meal</option>
            </select>
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="recipe-ingredients">Ingredients</label>
          <textarea
            id="recipe-ingredients"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            placeholder="List each ingredient and quantity..."
            rows="5"
            required
          />
          <small>Tip: put each ingredient on a new line.</small>
        </div>
        <div className="field-group">
          <label htmlFor="recipe-instructions">Instructions</label>
          <textarea
            id="recipe-instructions"
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            placeholder="Describe the cooking steps clearly..."
            rows="7"
            required
          />
          <small>Keep the steps short and easy to follow.</small>
        </div>
        <div className="btn-holder">
          <button className="add-item-btn" type="submit">
            <i className="fa-solid fa-check" aria-hidden="true" />
            {initialData ? "Update Recipe" : "Add Recipe"}
          </button>
          <button className="cancel-btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </section>
      <aside className="form-right form-panel">
        <div className="form-section-heading">
          <span className="section-number">02</span>
          <div>
            <h2>Recipe photos</h2>
            <p>Show the finished dish from its best side.</p>
          </div>
        </div>
        <div className="images-grid">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`image-card${idx === 0 ? " cover-image-card" : ""}`}
              onClick={() => fileInputRefs[idx].current.click()}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRefs[idx].current.click();
                }
              }}
            >
              {form.images[idx] ? (
                <div className="image-preview">
                  <img
                    src={form.images[idx]}
                    alt={`Recipe preview ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="remove-img"
                    aria-label={`Remove image ${idx + 1}`}
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
                  <span className="upload-icon-wrap">
                    <i className="fas fa-cloud-upload-alt upload-icon" />
                  </span>
                  <strong>
                    {idx === 0 ? "Add cover photo" : `Add photo ${idx + 1}`}
                  </strong>
                  <small>JPG, PNG or WebP</small>
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
          <i className="fa-solid fa-circle-info" aria-hidden="true" />
          Add up to three images. The first image becomes your recipe cover.
        </small>
      </aside>
    </form>
  );
}
