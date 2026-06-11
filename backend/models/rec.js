const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: Number,
  rating: Number,
});

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  instructions: String,
  category: String,
  cuisine: { type: String, default: "Other" },
  images: [String],
  creator_id: Number,
  creator_username: String,
  date: { type: Date, default: Date.now },
  ratings: [ratingSchema],
});

module.exports = mongoose.model("Recipe", recipeSchema);
