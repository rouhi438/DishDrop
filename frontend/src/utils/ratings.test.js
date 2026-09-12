import test from "node:test";
import assert from "node:assert/strict";
import { mergeRatingSummary } from "./ratings.js";

test("mergeRatingSummary updates the list and modal values together", () => {
  const result = mergeRatingSummary({ id: "r1", name: "Soup" }, { averageRating: 4.25, ratingCount: 8, userRating: 5 });
  assert.deepEqual(result, { id: "r1", name: "Soup", averageRating: 4.25, ratingCount: 8, userRating: 5 });
});

test("mergeRatingSummary normalizes an unrated recipe", () => {
  const result = mergeRatingSummary({ id: "r1" }, { averageRating: 0, ratingCount: 0, userRating: null });
  assert.equal(result.userRating, null);
  assert.equal(result.ratingCount, 0);
});
