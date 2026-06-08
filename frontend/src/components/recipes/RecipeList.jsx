import RecipeCard from "./RecipeCard";

export default function RecipeList({
  recipes,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="recipes-page">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          currentUserId={currentUserId}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
