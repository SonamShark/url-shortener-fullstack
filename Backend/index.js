const { start } = require("./src/server");

start().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
