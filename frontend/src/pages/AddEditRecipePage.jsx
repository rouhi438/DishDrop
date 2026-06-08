import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRecipes, addRecipe, updateRecipe } from "../services/api";
import RecipeForm from "../components/recipes/RecipeForm";
import BackButton from "../components/common/BackButton";
import "../styles/add.css";

export default function AddEditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchRecipes()
        .then((res) => {
          const recipe = res.data.recipes.find((r) => String(r.id) === id);
          if (recipe) setInitialData(recipe);
        })
        .catch(console.error);
    }
  }, [id, isEditing]);

  const handleSubmit = async (data) => {
    try {
      if (isEditing) await updateRecipe(id, data);
      else await addRecipe(data);
      navigate("/");
    } catch (err) {
      alert("Error saving recipe");
    }
  };

  return (
    <div id="add">
      <BackButton to="/" />
      <RecipeForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </div>
  );
}
