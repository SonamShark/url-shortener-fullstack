const crypto = require("crypto");
const Link = require("../db/models/Link");
const cache = require("./cache");
const config = require("../config");
const { HttpError } = require("../middleware/errorHandler");

const RESERVED_SLUGS = new Set([
  "api",
  "health",
  "stats",
  "admin",
  "login",
  "logout",
  "signup",
  "static",
  "assets",
  "favicon.ico",
]);

const PLATFORM_SUFFIXES = [
  ".vercel.app",
  ".netlify.app",
  ".github.io",
  ".pages.dev",
  ".herokuapp.com",
  ".onrender.com",
  ".fly.dev",
  ".workers.dev",
  ".repl.co",
];

const GENERIC_HOSTS = new Set([
  "github",
  "gitlab",
  "medium",
  "dev",
  "youtube",
  "youtu",
  "twitter",
  "x",
  "linkedin",
  "reddit",
  "stackoverflow",
  "npmjs",
]);

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-_]{1,30}[a-z0-9]$/i;

const randomSlug = (length = config.slugLength) =>
  crypto.randomBytes(length).toString("base64url").slice(0, length).toLowerCase();

const randomSuffix = (length = 4) =>
  crypto.randomBytes(length).toString("base64url").slice(0, length).toLowerCase();

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const sanitize = (raw) =>
  raw
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

const deriveSlugFromUrl = (rawUrl) => {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }

  let host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  for (const suffix of PLATFORM_SUFFIXES) {
    if (host.endsWith(suffix)) {
      host = host.slice(0, -suffix.length);
      break;
    }
  }

  const firstLabel = host.split(".")[0] || "";
  const pathSegments = parsed.pathname.split("/").filter(Boolean);
  const lastPathSeg = pathSegments[pathSegments.length - 1] || "";

  let candidate = firstLabel;
  if (GENERIC_HOSTS.has(firstLabel) && lastPathSeg) {
    candidate = lastPathSeg;
  }

  // Take the first hyphen-separated chunk so "ethereum-explained" -> "ethereum"
  const head = candidate.split("-")[0];
  const cleaned = sanitize(head);

  if (cleaned.length < 3 || RESERVED_SLUGS.has(cleaned)) return null;
  return cleaned.slice(0, 24);
};

const validateCustomSlug = (slug) => {
  const normalized = String(slug).trim().toLowerCase();
  if (!SLUG_PATTERN.test(normalized)) {
    throw new HttpError(
      400,
      "Custom slug must be 3-32 chars, alphanumeric with - or _, starting and ending with a letter or digit."
    );
  }
  if (RESERVED_SLUGS.has(normalized)) {
    throw new HttpError(409, `"${normalized}" is reserved, pick another.`);
  }
  return normalized;
};

const buildShortUrl = (slug) => `${config.publicBaseUrl}/${slug}`;

const toDto = (link) => ({
  slug: link.slug,
  shortUrl: buildShortUrl(link.slug),
  originalUrl: link.originalUrl,
  clicks: Number(link.clicks),
  createdAt: link.createdAt,
});

const tryInsert = async (slug, originalUrl) => {
  try {
    return await Link.create({ slug, originalUrl });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") return null;
    throw err;
  }
};

const createShortLink = async (rawUrl, customSlug) => {
  if (!rawUrl || typeof rawUrl !== "string" || !isValidUrl(rawUrl.trim())) {
    throw new HttpError(400, "A valid http(s) URL is required.");
  }
  const originalUrl = rawUrl.trim();

  if (customSlug) {
    const slug = validateCustomSlug(customSlug);
    const link = await tryInsert(slug, originalUrl);
    if (!link) {
      throw new HttpError(409, `"${slug}" is already taken, pick another.`);
    }
    await cache.setCachedUrl(slug, originalUrl).catch(() => {});
    return toDto(link);
  }

  const derived = deriveSlugFromUrl(originalUrl);
  const candidates = [];
  if (derived) {
    candidates.push(derived);
    for (let i = 0; i < 4; i++) candidates.push(`${derived}-${randomSuffix(3)}`);
  }
  for (let i = 0; i < 5; i++) candidates.push(randomSlug());

  for (const slug of candidates) {
    const link = await tryInsert(slug, originalUrl);
    if (link) {
      await cache.setCachedUrl(slug, originalUrl).catch(() => {});
      return toDto(link);
    }
  }
  throw new HttpError(500, "Could not allocate a unique slug, try again.");
};

const resolveSlug = async (slug) => {
  const cached = await cache.getCachedUrl(slug).catch(() => null);
  if (cached) {
    cache.incrementClick(slug).catch(() => {});
    return { originalUrl: cached };
  }

  const link = await Link.findOne({ where: { slug } });
  if (!link) throw new HttpError(404, "Short link not found.");

  cache.setCachedUrl(slug, link.originalUrl).catch(() => {});
  cache.incrementClick(slug).catch(() => {});
  return { originalUrl: link.originalUrl };
};

const listRecentLinks = async (limit = 25) => {
  const links = await Link.findAll({
    order: [["createdAt", "DESC"]],
    limit,
  });
  return links.map(toDto);
};

const flushClickBuffer = async () => {
  const links = await Link.findAll({ attributes: ["slug"] });
  for (const { slug } of links) {
    const delta = await cache.getAndResetClicks(slug).catch(() => 0);
    if (delta > 0) {
      await Link.increment({ clicks: delta }, { where: { slug } });
    }
  }
};

module.exports = {
  createShortLink,
  resolveSlug,
  listRecentLinks,
  flushClickBuffer,
  buildShortUrl,
  deriveSlugFromUrl,
};
