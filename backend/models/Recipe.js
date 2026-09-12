const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false },
);

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  ingredients: { type: String, required: true, trim: true, maxlength: 10000 },
  instructions: { type: String, required: true, trim: true, maxlength: 20000 },
  category: { type: String, required: true, trim: true },
  cuisine: { type: String, default: "Other" },
  images: [{ type: String, maxlength: 8_000_000 }],
  creator_id: { type: String, required: true, index: true },
  creator_username: { type: String, required: true },
  date: { type: Date, default: Date.now },
  ratings: [ratingSchema],
});

module.exports = mongoose.model("Recipe", recipeSchema);
