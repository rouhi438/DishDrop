const User = require("../models/User");
const Recipe = require("../models/Recipe");

exports.getAdminStats = async (req, res) => {
  if (!req.userIsAdmin) return res.status(403).json({ error: "Access denied" });
  try {
    const users = await User.find({});
    const recipes = await Recipe.find({});
    const usersStats = users.map((user) => {
      const userRecipes = recipes.filter((r) => r.creator_id === user._id);
      let ratingsGiven = 0;
      let ratedRecipesIds = [];
      recipes.forEach((recipe) => {
        const found = recipe.ratings?.find((r) => r.userId === user._id);
        if (found) {
          ratingsGiven++;
          ratedRecipesIds.push(recipe._id);
        }
      });
      return {
        userId: user._id,
        username: user.username,
        email: user.email,
        joined: user.createdAt.toISOString().split("T")[0],
        recipeCount: userRecipes.length,
        ratingsGiven,
        ratedRecipesIds,
      };
    });
    const global = {
      totalUsers: users.length,
      totalRecipes: recipes.length,
      totalRatings: recipes.reduce(
        (acc, r) => acc + (r.ratings?.length || 0),
        0,
      ),
    };
    res.json({ global, users: usersStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get stats" });
  }
};
