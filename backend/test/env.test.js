const test = require("node:test");
const assert = require("node:assert/strict");
const { getJwtSecret } = require("../config/env");

test("JWT_SECRET has no insecure fallback", () => {
  const previous = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  assert.throws(() => getJwtSecret(), /Missing required environment variable: JWT_SECRET/);
  if (previous) process.env.JWT_SECRET = previous;
});
