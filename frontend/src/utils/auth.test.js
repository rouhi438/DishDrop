import test from "node:test";
import assert from "node:assert/strict";
import { createUserFromSession, decodeToken } from "./auth.js";

function tokenFor(payload) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none" })}.${encode(payload)}.`;
}

test("decodeToken reads a base64url JWT payload", () => {
  const payload = decodeToken(tokenFor({ id: 42, isAdmin: true }));
  assert.deepEqual(payload, { id: 42, isAdmin: true });
});

test("createUserFromSession restores a valid user", () => {
  const token = tokenFor({ id: "abc", isAdmin: false, exp: 2_000 });
  assert.deepEqual(createUserFromSession(token, "Helena", 1_000_000), {
    id: "abc",
    isAdmin: false,
    token,
    username: "Helena",
  });
});

test("createUserFromSession rejects malformed and expired sessions", () => {
  assert.equal(createUserFromSession("not-a-token", "Helena"), null);
  assert.equal(
    createUserFromSession(tokenFor({ id: "abc", exp: 1_000 }), "Helena", 1_000_000),
    null,
  );
});
