import { useState, useEffect } from "react";
import {
  fetchRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
} from "../services/api";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    try {
      const res = await fetchRecipes();
      setRecipes(res.data.recipes);
      setCurrentUserId(res.data.currentUserId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const add = async (recipe) => {
    const res = await addRecipe(recipe);
    await loadRecipes();
    return res.data;
  };

  const update = async (id, recipe) => {
    await updateRecipe(id, recipe);
    await loadRecipes();
  };

  const remove = async (id) => {
    await deleteRecipe(id);
    await loadRecipes();
  };
  const updateRecipeRating = (recipeId, newAverage) => {
    setRecipes((prev) =>
      prev.map((recipe) => {
        if (recipe.id !== recipeId) return recipe;
        const ratings =
          newAverage && Array.isArray(newAverage)
            ? newAverage
            : recipe.ratings || [];
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const avg = ratings.length ? sum / ratings.length : 0;
        return { ...recipe, ratings, averageRating: avg };
      }),
    );
  };
  return {
    recipes,
    currentUserId,
    loading,
    add,
    update,
    remove,
    refetch: loadRecipes,
    updateRecipeRating,
  };
};
