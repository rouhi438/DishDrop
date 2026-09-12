const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

const EDITABLE_FIELDS = ["name", "ingredients", "instructions", "category", "cuisine", "images"];

function pickRecipeFields(body = {}) {
  return Object.fromEntries(
    EDITABLE_FIELDS.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]),
  );
}

function validateRecipeInput(input, partial = false) {
  if (!partial) {
    const missing = ["name", "ingredients", "instructions", "category"].find(
      (field) => !String(input[field] || "").trim(),
    );
    if (missing) return `${missing} is required`;
  }
  if (input.images !== undefined && !Array.isArray(input.images)) return "images must be an array";
  if (input.images?.length > 3) return "A recipe can have at most 3 images";
  return null;
}

function summarizeRecipe(recipe, currentUserId) {
  const ratingByUser = new Map();
  for (const item of Array.isArray(recipe.ratings) ? recipe.ratings : []) {
    if (item?.userId && Number(item.rating) >= 1 && Number(item.rating) <= 5) {
      ratingByUser.set(String(item.userId), { userId: String(item.userId), rating: Number(item.rating) });
    }
  }
  const ratings = [...ratingByUser.values()];
  const total = ratings.reduce((sum, item) => sum + Number(item.rating || 0), 0);
  const userRating = currentUserId
    ? ratings.find((item) => String(item.userId) === String(currentUserId))?.rating ?? null
    : null;
  const { ratings: _privateRatings, _id: _privateId, __v: _privateVersion, ...publicRecipe } = recipe;
  return {
    ...publicRecipe,
    id: String(recipe._id),
    averageRating: ratings.length ? total / ratings.length : 0,
    ratingCount: ratings.length,
    userRating,
  };
}

exports.getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ date: -1 }).lean();
    res.json({ recipes: recipes.map((recipe) => summarizeRecipe(recipe, req.userId)), currentUserId: req.userId || null });
  } catch (error) {
    next(error);
  }
};

exports.addRecipe = async (req, res, next) => {
  const fields = pickRecipeFields(req.body);
  const validationError = validateRecipeInput(fields);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const recipe = await Recipe.create({
      ...fields,
      creator_id: req.userId,
      creator_username: req.userUsername,
      cuisine: fields.cuisine || "Other",
      images: fields.images || [],
    });
    return res.status(201).json(summarizeRecipe(recipe.toObject(), req.userId));
  } catch (error) {
    return next(error);
  }
};

exports.updateRecipe = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid recipe id" });
  const fields = pickRecipeFields(req.body);
  const validationError = validateRecipeInput(fields, true);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    if (String(recipe.creator_id) !== String(req.userId)) {
      return res.status(403).json({ error: "Only the recipe owner can edit it" });
    }
    Object.assign(recipe, fields);
    await recipe.save();
    return res.json(summarizeRecipe(recipe.toObject(), req.userId));
  } catch (error) {
    return next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid recipe id" });
  try {
    const deleted = await Recipe.findOneAndDelete({ _id: req.params.id, creator_id: String(req.userId) });
    if (deleted) return res.json({ message: "Recipe deleted" });
    const exists = await Recipe.exists({ _id: req.params.id });
    return res.status(exists ? 403 : 404).json({
      error: exists ? "Only the recipe owner can delete it" : "Recipe not found",
    });
  } catch (error) {
    return next(error);
  }
};

exports.rateRecipe = async (req, res, next) => {
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be an integer from 1 to 5" });
  }
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid recipe id" });

  try {
    const userId = String(req.userId);
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id },
      [{ $set: { ratings: { $concatArrays: [
        { $filter: { input: { $ifNull: ["$ratings", []] }, as: "item", cond: { $ne: ["$$item.userId", userId] } } },
        [{ userId, rating }],
      ] } } }],
      { new: true },
    ).lean();
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    const summary = summarizeRecipe(recipe, userId);
    return res.json({
      message: "Rating saved",
      averageRating: summary.averageRating,
      ratingCount: summary.ratingCount,
      userRating: summary.userRating,
    });
  } catch (error) {
    return next(error);
  }
};

exports.pickRecipeFields = pickRecipeFields;
exports.summarizeRecipe = summarizeRecipe;
exports.validateRecipeInput = validateRecipeInput;
