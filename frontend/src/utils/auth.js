export function decodeToken(token) {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;
    const normalized = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function createUserFromSession(token, username, now = Date.now()) {
  const payload = token ? decodeToken(token) : null;
  if (!token || !username || !payload?.id || (payload.exp && payload.exp * 1000 <= now)) {
    return null;
  }

  return {
    username,
    token,
    id: String(payload.id),
    isAdmin: Boolean(payload.isAdmin),
  };
}
