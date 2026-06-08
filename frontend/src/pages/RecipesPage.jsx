import { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";
import { useAuth } from "../context/AuthContext";
import RecipeList from "../components/recipes/RecipeList";
import Modal from "../components/common/Modal";
import "../styles/recipes.css";

const cuisineList = [
  "Italian",
  "Japanese",
  "Chinese",
  "Indian",
  "Mexican",
  "Thai",
  "Turkish",
  "Iranian",
  "French",
  "Greek",
  "Spanish",
  "Korean",
  "Vietnamese",
  "Lebanese",
  "Moroccan",
  "Scandinavian",
  "American",
  "Other",
];
const categoryList = [
  "main",
  "appetizer",
  "dessert",
  "beverage",
  "vegetarian",
  "quick",
];

export default function RecipesPage() {
  const navigate = useNavigate();
  const { recipes, currentUserId, remove, refetch, updateRecipeRating } =
    useRecipes();
  const { user } = useAuth();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    console.log("selectedCuisine changed:", selectedCuisine);
  }, [selectedCuisine]);

  useEffect(() => {
    refetch();
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth <= 768 ? 9 : 12);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCuisine, selectedCategory]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const recipeCuisine = (recipe.cuisine || "Other").toLowerCase();
      const matchCuisine =
        !selectedCuisine || recipeCuisine === selectedCuisine.toLowerCase();
      const recipeCategory = (recipe.category || "").toLowerCase();
      const matchCategory =
        !selectedCategory || recipeCategory === selectedCategory.toLowerCase();
      return matchCuisine && matchCategory;
    });
  }, [recipes, selectedCuisine, selectedCategory]);

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      await remove(id);
      refetch();
    }
  };

  const clearFilters = () => {
    setSelectedCuisine("");
    setSelectedCategory("");
  };

  const sortedRecipes = [...recipes].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  const recipeRankMap = new Map();
  sortedRecipes.forEach((recipe, index) => {
    recipeRankMap.set(recipe.id, index + 1);
  });

  const cuisineScrollRef = useRef(null);
  const categoryScrollRef = useRef(null);

  const startDrag = (e, scrollRef) => {
    const container = scrollRef.current;
    if (!container) return;
    let startX = e.pageX - container.offsetLeft;
    let scrollLeft = container.scrollLeft;
    const onMove = (moveEvent) => {
      moveEvent.preventDefault();
      const x = moveEvent.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.2;
      container.scrollLeft = scrollLeft - walk;
    };
    const onEnd = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onEnd);
  };

  const handleCuisineClick = (cuisine) => {
    console.log("Clicked cuisine:", cuisine);
    setSelectedCuisine((prev) => {
      const newValue = prev === cuisine ? "" : cuisine;
      console.log("Setting selectedCuisine to:", newValue);
      return newValue;
    });
  };

  const handleCategoryClick = (cat) => {
    console.log("Clicked category:", cat);
    setSelectedCategory((prev) => {
      const newValue = prev === cat ? "" : cat;
      console.log("Setting selectedCategory to:", newValue);
      return newValue;
    });
  };

  return (
    <div id="recipes">
      <span className="recipes-back-btn" onClick={() => navigate("/")}>
        <i className="fa-solid fa-arrow-left"></i>
      </span>

      <div className="filters-container">
        <div className="filter-group">
          <div
            className="filter-chips"
            ref={cuisineScrollRef}
            onMouseDown={(e) => startDrag(e, cuisineScrollRef)}
            onTouchStart={(e) => startDrag(e, cuisineScrollRef)}
            style={{ cursor: "grab" }}
          >
            <button
              className={`filter-chip ${selectedCuisine === "" ? "active" : ""}`}
              onClick={() => handleCuisineClick("")}
            >
              All cuisine
            </button>
            {cuisineList.map((cuisine) => (
              <button
                key={cuisine}
                className={`filter-chip ${selectedCuisine === cuisine ? "active" : ""}`}
                onClick={() => handleCuisineClick(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div
            className="filter-chips"
            ref={categoryScrollRef}
            onMouseDown={(e) => startDrag(e, categoryScrollRef)}
            onTouchStart={(e) => startDrag(e, categoryScrollRef)}
            style={{ cursor: "grab" }}
          >
            <button
              className={`filter-chip ${selectedCategory === "" ? "active" : ""}`}
              onClick={() => handleCategoryClick("")}
            >
              All recipes
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-actions">
          {(selectedCuisine || selectedCategory) && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
          <span className="result-count">
            {filteredRecipes.length} recipes found
          </span>
        </div>
      </div>

      <RecipeList
        recipes={paginatedRecipes}
        currentUserId={currentUserId}
        onView={setSelectedRecipe}
        onEdit={(recipe) => navigate(`/edit-recipe/${recipe.id}`)}
        onDelete={handleDelete}
      />

      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <button
            className="pagination-arrow prev"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagination-info">
            page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-arrow next"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      <Modal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        currentUserId={currentUserId}
        recipeNumber={recipeRankMap.get(selectedRecipe?.id)}
        onEdit={(recipe) => navigate(`/edit-recipe/${recipe.id}`)}
        onDelete={handleDelete}
        onUpdateRating={updateRecipeRating}
      />
    </div>
  );
}
