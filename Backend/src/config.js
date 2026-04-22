require("dotenv").config();

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  corsOrigin: (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  publicBaseUrl: (process.env.PUBLIC_BASE_URL || "http://localhost:4000").replace(/\/$/, ""),
  databaseUrl: required("DATABASE_URL"),
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  slugLength: Number(process.env.SLUG_LENGTH) || 7,
  cacheTtlSeconds: 60 * 60 * 24,
  rateLimit: {
    windowSeconds: 60,
    max: 20,
  },
};
