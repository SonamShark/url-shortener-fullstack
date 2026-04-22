const { createClient } = require("redis");
const config = require("../config");

const client = createClient({ url: config.redisUrl });

client.on("error", (err) => console.error("[redis] error:", err.message));

let connecting = null;

const connect = () => {
  if (client.isOpen) return Promise.resolve();
  if (!connecting) connecting = client.connect();
  return connecting;
};

const slugKey = (slug) => `slug:${slug}`;
const clicksKey = (slug) => `clicks:${slug}`;

const getCachedUrl = async (slug) => {
  await connect();
  return client.get(slugKey(slug));
};

const setCachedUrl = async (slug, url) => {
  await connect();
  await client.set(slugKey(slug), url, { EX: config.cacheTtlSeconds });
};

const invalidateUrl = async (slug) => {
  await connect();
  await client.del(slugKey(slug));
};

const incrementClick = async (slug) => {
  await connect();
  return client.incr(clicksKey(slug));
};

const getAndResetClicks = async (slug) => {
  await connect();
  const value = await client.getDel(clicksKey(slug));
  return value ? Number(value) : 0;
};

module.exports = {
  client,
  connect,
  getCachedUrl,
  setCachedUrl,
  invalidateUrl,
  incrementClick,
  getAndResetClicks,
};
