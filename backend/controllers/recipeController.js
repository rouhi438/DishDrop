const Recipe = require("../models/rec");

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    const recipesWithAvg = recipes.map((recipe) => {
      let avg = 0;
      if (recipe.ratings && recipe.ratings.length) {
        const sum = recipe.ratings.reduce((acc, r) => acc + r.rating, 0);
        avg = sum / recipe.ratings.length;
      }
      return { ...recipe, averageRating: avg };
    });
    res.json({ recipes: recipesWithAvg, currentUserId: req.userId || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

exports.addRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      creator_id: req.userId,
      creator_username: req.userUsername,
      date: new Date(),
      images: req.body.images || [],
      cuisine: req.body.cuisine || "Other",
    });
    await newRecipe.save();
    res.json(newRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add recipe" });
  }
};

exports.updateRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Not found" });
    if (recipe.creator_id !== req.userId)
      return res.status(403).json({ error: "Not owner" });
    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Not found" });
    if (recipe.creator_id !== req.userId)
      return res.status(403).json({ error: "Not owner" });
    await Recipe.deleteOne({ _id: id });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};

exports.rateRecipe = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const userId = req.userId;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    if (!recipe.ratings) recipe.ratings = [];
    const existing = recipe.ratings.find((r) => r.userId === userId);
    if (existing) {
      return res
        .status(403)
        .json({ error: "You have already rated this recipe" });
    }
    recipe.ratings.push({ userId, rating });
    await recipe.save();
    res.json({ message: "Rating saved", ratings: recipe.ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rating failed" });
  }
};
