const cache = require("../services/cache");
const config = require("../config");
const { HttpError } = require("./errorHandler");

const rateLimit = ({
  windowSeconds = config.rateLimit.windowSeconds,
  max = config.rateLimit.max,
  keyPrefix = "rl",
} = {}) => {
  return async (req, _res, next) => {
    try {
      await cache.connect();
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const key = `${keyPrefix}:${ip}`;
      const count = await cache.client.incr(key);
      if (count === 1) {
        await cache.client.expire(key, windowSeconds);
      }
      if (count > max) {
        return next(new HttpError(429, "Too many requests, slow down."));
      }
      next();
    } catch (err) {
      console.warn("[rateLimit] bypassed due to redis error:", err.message);
      next();
    }
  };
};

module.exports = rateLimit;
