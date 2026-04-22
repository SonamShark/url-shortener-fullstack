const express = require("express");
const cors = require("cors");

const config = require("./config");
const { sequelize } = require("./db");
require("./db/models/Link");

const cache = require("./services/cache");
const linkService = require("./services/linkService");

const shortenRouter = require("./routes/shorten");
const linksRouter = require("./routes/links");
const { notFound, errorHandler, HttpError } = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", true);
const corsOrigin = config.corsOrigin.includes("*")
  ? true
  : config.corsOrigin;
app.use(cors({ origin: corsOrigin, credentials: false }));
app.use(express.json({ limit: "16kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: config.env });
});

app.use("/api/shorten", shortenRouter);
app.use("/api/links", linksRouter);

app.get("/:slug", async (req, res, next) => {
  try {
    const { originalUrl } = await linkService.resolveSlug(req.params.slug);
    res.redirect(302, originalUrl);
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) {
      return res.status(404).send("Short link not found");
    }
    next(err);
  }
});

app.use(notFound);
app.use(errorHandler);

const FLUSH_INTERVAL_MS = 30_000;
let flushTimer = null;

const startClickFlusher = () => {
  flushTimer = setInterval(() => {
    linkService
      .flushClickBuffer()
      .catch((err) => console.error("[clickFlusher]", err.message));
  }, FLUSH_INTERVAL_MS);
  flushTimer.unref?.();
};

const start = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  await cache.connect().catch((err) => {
    console.warn("[redis] initial connect failed:", err.message);
  });

  const server = app.listen(config.port, () => {
    console.log(`[server] listening on http://localhost:${config.port}`);
  });

  startClickFlusher();

  const shutdown = async (signal) => {
    console.log(`[server] received ${signal}, shutting down...`);
    if (flushTimer) clearInterval(flushTimer);
    server.close(() => console.log("[server] http closed"));
    try {
      await linkService.flushClickBuffer();
    } catch (err) {
      console.error("[shutdown] click flush failed:", err.message);
    }
    try {
      if (cache.client.isOpen) await cache.client.quit();
    } catch (err) {
      console.error("[shutdown] redis quit failed:", err.message);
    }
    try {
      await sequelize.close();
    } catch (err) {
      console.error("[shutdown] sequelize close failed:", err.message);
    }
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

if (require.main === module) {
  start().catch((err) => {
    console.error("[server] failed to start:", err);
    process.exit(1);
  });
}

module.exports = { app, start };
