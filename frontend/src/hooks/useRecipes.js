import { useState, useCallback } from "react";
import {
  fetchRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  getApiError,
} from "../services/api";
import { mergeRatingSummary } from "../utils/ratings";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchRecipes();
      setRecipes(Array.isArray(res.data.recipes) ? res.data.recipes : []);
      setCurrentUserId(res.data.currentUserId);
    } catch (err) {
      setError(getApiError(err, "We could not load the recipes."));
    } finally {
      setLoading(false);
    }
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
  const submitRating = async (recipeId, rating) => {
    const { data } = await rateRecipe(recipeId, rating);
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === recipeId ? mergeRatingSummary(recipe, data) : recipe,
      ),
    );
    return data;
  };
  return {
    recipes,
    currentUserId,
    loading,
    error,
    add,
    update,
    remove,
    refetch: loadRecipes,
    submitRating,
  };
};
