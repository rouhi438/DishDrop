const fs = require("fs");
const path = require("path");
const userPath = path.join(__dirname, "../users.json");
const recipePath = path.join(__dirname, "../recipes.json");

function readUsers() {
  return JSON.parse(fs.readFileSync(userPath, "utf-8"));
}

function readRecipes() {
  if (!fs.existsSync(recipePath)) return [];
  const data = fs.readFileSync(recipePath, "utf-8").trim();
  return data ? JSON.parse(data) : [];
}

exports.getAdminStats = (req, res) => {
  if (!req.userIsAdmin) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  const users = readUsers();
  const recipes = readRecipes();

  //users info
  const userStats = users.map((user) => {
    const userRecipes = recipes.filter((r) => r.creator_id === user.id);

    const recipeCount = userRecipes.length;

    let ratingsGiven = 0;
    let ratedRecipesIds = [];

    recipes.forEach((recipe) => {
      if (recipe.ratings) {
        const userRating = recipe.ratings.find((r) => r.userId === user.id);
        if (userRating) {
          ratingsGiven++;
          ratedRecipesIds.push(recipe.id);
        }
      }
    });

    return {
      userId: user.id,
      username: user.username,
      email: user.email || "No email",
      recipeCount,
      ratingsGiven,
      ratedRecipesIds,
      joined: user.createdAt || new Date(user.id).toISOString().split("T")[0],
    };
  });

  const totalRecipes = recipes.length;
  const totalUsers = users.length;
  let totalRatings = 0;
  recipes.forEach((r) => {
    if (r.ratings) totalRatings += r.ratings.length;
  });

  res.json({
    global: { totalRecipes, totalUsers, totalRatings },
    users: userStats,
  });
};
