import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";
import { useAuth } from "../context/AuthContext";
import RecipeList from "../components/recipes/RecipeList";
import Modal from "../components/common/Modal";
import "../styles/recipes.css";

const cuisineList = ["Italian", "Japanese", "Chinese", "Indian", "Mexican", "Thai", "Turkish", "Iranian", "French", "Greek", "Spanish", "Korean", "Vietnamese", "Lebanese", "Moroccan", "Scandinavian", "American", "Other"];
const categoryList = ["Main", "Appetizer", "Dessert", "Beverage", "Vegetarian", "Quick Meal"];

export default function RecipesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recipes, loading, error, remove, refetch, submitRating } = useRecipes();
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => { refetch(); }, [user, refetch]);
  useEffect(() => { setCurrentPage(1); }, [selectedCuisine, selectedCategory]);

  const filteredRecipes = useMemo(() => recipes.filter((recipe) => {
    const cuisine = String(recipe.cuisine || "Other").toLowerCase();
    const category = String(recipe.category || "").toLowerCase();
    return (!selectedCuisine || cuisine === selectedCuisine.toLowerCase()) &&
      (!selectedCategory || category === selectedCategory.toLowerCase());
  }), [recipes, selectedCuisine, selectedCategory]);

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const paginatedRecipes = filteredRecipes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) || null;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) return;
    await remove(id);
    setSelectedRecipeId(null);
  };

  return (
    <main id="recipes">
      <section className="recipes-intro">
        <button className="recipes-back-btn" onClick={() => navigate("/")} aria-label="Back to home"><i className="fa-solid fa-arrow-left" aria-hidden="true" /></button>
        <p className="recipes-eyebrow">The community cookbook</p>
        <h1>Find your next <em>favorite.</em></h1>
        <p>Browse real recipes, filter by cuisine, and save your vote for the dishes worth repeating.</p>
      </section>

      <section className="recipes-shell" aria-label="Recipe collection">
        <div className="filters-container">
          <div className="filter-row" aria-label="Filter by cuisine">
            <span className="filter-label">Cuisine</span>
            <div className="filter-chips">
              {["", ...cuisineList].map((cuisine) => (
                <button key={cuisine || "all"} className={`filter-chip ${selectedCuisine === cuisine ? "active" : ""}`} aria-pressed={selectedCuisine === cuisine} onClick={() => setSelectedCuisine(cuisine)}>
                  {cuisine || "All"}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-row" aria-label="Filter by category">
            <span className="filter-label">Category</span>
            <div className="filter-chips">
              {["", ...categoryList].map((category) => (
                <button key={category || "all"} className={`filter-chip ${selectedCategory === category ? "active" : ""}`} aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)}>
                  {category || "All"}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-actions">
            <span className="result-count">{loading ? "Loading recipes…" : `${filteredRecipes.length} recipe${filteredRecipes.length === 1 ? "" : "s"}`}</span>
            {(selectedCuisine || selectedCategory) && <button className="clear-filters-btn" onClick={() => { setSelectedCuisine(""); setSelectedCategory(""); }}>Clear filters</button>}
          </div>
        </div>

        {loading && <div className="recipes-state" role="status"><span className="loader" />Waking up the kitchen…</div>}
        {!loading && error && <div className="recipes-state error-state" role="alert"><h2>We couldn’t load the recipes.</h2><p>{error}</p><button onClick={refetch}>Try again</button></div>}
        {!loading && !error && paginatedRecipes.length === 0 && <div className="recipes-state"><h2>No recipes found.</h2><p>Try a different filter or add the first recipe in this category.</p></div>}
        {!loading && !error && <RecipeList recipes={paginatedRecipes} currentUserId={user?.id || null} onView={(recipe) => setSelectedRecipeId(recipe.id)} onEdit={(recipe) => navigate(`/edit-recipe/${recipe.id}`)} onDelete={handleDelete} />}

        {totalPages > 1 && <nav className="pagination-wrapper" aria-label="Recipe pages">
          <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} aria-label="Previous page">←</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} aria-label="Next page">→</button>
        </nav>}
      </section>

      <Modal recipe={selectedRecipe} onClose={() => setSelectedRecipeId(null)} currentUserId={user?.id || null} onEdit={(recipe) => navigate(`/edit-recipe/${recipe.id}`)} onDelete={handleDelete} onRate={submitRating} />
    </main>
  );
}
