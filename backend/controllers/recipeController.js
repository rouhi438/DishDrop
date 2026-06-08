const fs = require("fs");
const path = require("path");
const recipesPath = path.join(__dirname, "../recipes.json");

function readRecipes() {
  if (!fs.existsSync(recipesPath)) return [];
  const data = fs.readFileSync(recipesPath, "utf-8").trim();
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("Invalid recipes.json format, resetting to []:", err);
    return [];
  }
}
function writeRecipes(recipes) {
  fs.writeFileSync(recipesPath, JSON.stringify(recipes, null, 2));
}

exports.addRecipe = (req, res) => {
  console.log("Received body:", req.body);
  try {
    const recipes = readRecipes();
    const newRecipe = {
      ...req.body,
      id: Date.now(),
      creator_id: req.userId,
      creator_username: req.userUsername,
      date: new Date().toISOString(),
      images: req.body.images || [],
      cuisine: req.body.cuisine || "Other",
      ratings: req.body.ratings || [],
    };
    recipes.push(newRecipe);
    writeRecipes(recipes);
    res.json(newRecipe);
  } catch (err) {
    console.error("Error in addRecipe:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecipe = (req, res) => {
  const { id } = req.params;
  let recipes = readRecipes();
  const index = recipes.findIndex((r) => r.id == id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  if (recipes[index].creator_id !== req.userId)
    return res.status(403).json({ error: "Not owner" });
  recipes[index] = {
    ...recipes[index],
    ...req.body,
    cuisine: req.body.cuisine || recipes[index].cuisine || "Other",
    images: req.body.images || recipes[index].images || [],
  };
  writeRecipes(recipes);
  res.json(recipes[index]);
};

exports.deleteRecipe = (req, res) => {
  const { id } = req.params;
  let recipes = readRecipes();
  const recipe = recipes.find((r) => r.id == id);
  if (!recipe) return res.status(404).json({ error: "Not found" });
  if (recipe.creator_id !== req.userId)
    return res.status(403).json({ error: "Not owner" });
  recipes = recipes.filter((r) => r.id != id);
  writeRecipes(recipes);
  res.json({ message: "Deleted" });
};

exports.rateRecipe = (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const userId = req.userId;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }
  let recipes = readRecipes();
  const recipeIndex = recipes.findIndex((r) => r.id == id);

  if (recipeIndex === -1)
    return res.status(404).json({ error: "Recipe not found" });
  const recipe = recipes[recipeIndex];

  if (!recipe.ratings) recipe.ratings = [];

  const existingIndex = recipe.ratings.findIndex((r) => r.userId === userId);
  if (existingIndex !== -1) {
    return res
      .status(403)
      .json({ error: "You have already rated this recipe" });
    //recipe.ratings[existingIndex].rating = rating;
  } else {
    recipe.ratings.push({ userId, rating });
  }
  writeRecipes(recipes);
  res.json({ message: "Rating saved", ratings: recipe.ratings });
};

exports.getAllRecipes = (req, res) => {
  const recipes = readRecipes();
  const recipesWithCuisine = recipes.map((recipe) => ({
    ...recipe,
    cuisine: recipe.cuisine || "Other",
  }));
  const recipesWithStats = recipesWithCuisine.map((recipe) => {
    let avg = 0;
    if (recipe.ratings && recipe.ratings.length) {
      const sum = recipe.ratings.reduce((acc, r) => acc + r.rating, 0);
      avg = sum / recipe.ratings.length;
    }
    return {
      ...recipe,
      averageRating: avg,
    };
  });
  res.json({ recipes: recipesWithStats, currentUserId: req.userId || null });
};
