const test = require("node:test");
const assert = require("node:assert/strict");
const { pickRecipeFields, summarizeRecipe, validateRecipeInput } = require("../controllers/recipeController");

test("public recipe summaries do not expose voter identities", () => {
  const result = summarizeRecipe({ _id: "r1", name: "Soup", ratings: [{ userId: "u1", rating: 5 }, { userId: "u2", rating: 3 }] }, "u1");
  assert.equal(result.averageRating, 4);
  assert.equal(result.ratingCount, 2);
  assert.equal(result.userRating, 5);
  assert.equal("ratings" in result, false);
});

test("guests receive aggregate rating data only", () => {
  const result = summarizeRecipe({ _id: "r1", ratings: [{ userId: "u1", rating: 4 }] });
  assert.equal(result.userRating, null);
  assert.equal(result.averageRating, 4);
});

test("legacy duplicate votes are counted once per user", () => {
  const result = summarizeRecipe({ _id: "r1", ratings: [{ userId: "u1", rating: 2 }, { userId: "u1", rating: 5 }] }, "u1");
  assert.equal(result.ratingCount, 1);
  assert.equal(result.averageRating, 5);
  assert.equal(result.userRating, 5);
});

test("protected recipe fields are discarded", () => {
  const result = pickRecipeFields({ name: "Safe", ratings: [{ rating: 5 }], creator_id: "attacker" });
  assert.deepEqual(result, { name: "Safe" });
});

test("required recipe content is validated", () => {
  assert.equal(validateRecipeInput({ name: "Soup" }), "ingredients is required");
});
