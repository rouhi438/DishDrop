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
    } catch {
      alert("Error saving recipe");
    }
  };

  return (
    <div id="add">
      <div className="recipe-editor-shell">
        <div className="recipe-editor-topbar">
          <BackButton to="/" />
          <span className="editor-status">
            <i className="fa-regular fa-floppy-disk" aria-hidden="true" />
            {isEditing ? "Editing recipe" : "New recipe"}
          </span>
        </div>
        <header className="recipe-editor-heading">
          <p className="editor-eyebrow">
            {isEditing ? "Refine your creation" : "Share something delicious"}
          </p>
          <h1>{isEditing ? "Edit your recipe" : "Create a new recipe"}</h1>
          <p>
            Add the essential details and a few inviting photos. You can always
            come back and polish it later.
          </p>
        </header>
        <RecipeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/")}
        />
      </div>
    </div>
  );
}
