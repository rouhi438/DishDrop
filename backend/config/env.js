function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getJwtSecret() {
  return requireEnv("JWT_SECRET");
}

module.exports = { getJwtSecret, requireEnv };
