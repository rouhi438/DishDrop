const express = require("express");
const {
  getAllRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
} = require("../controllers/recipeController");
const auth = require("../middleware/authMiddleware");
const { optionalAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", optionalAuth, getAllRecipes);
router.post("/", auth, addRecipe);
router.put("/:id", auth, updateRecipe);
router.delete("/:id", auth, deleteRecipe);
router.post("/:id/rate", auth, rateRecipe);

module.exports = router;
