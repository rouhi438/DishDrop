export function mergeRatingSummary(recipe, summary) {
  return {
    ...recipe,
    averageRating: Number(summary.averageRating || 0),
    ratingCount: Number(summary.ratingCount || 0),
    userRating: summary.userRating == null ? null : Number(summary.userRating),
  };
}
