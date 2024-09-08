/* eslint-disable @typescript-eslint/no-var-requires */
const { CacheHandler } = require("@neshca/cache-handler");
const createRedisHandler = require("@neshca/cache-handler/redis-stack").default;
const createLruHandler = require("@neshca/cache-handler/local-lru").default;
const { createClient } = require("redis");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/* from https://caching-tools.github.io/next-shared-cache/redis */
CacheHandler.onCreation(async () => {
  let client;

  if (PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
    try {
      // Create a Redis client.
      client = createClient({
        url: process.env.REDIS_URL ?? "redis://localhost:6379",
      });

      client.on("error", (e) => {
        if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== "undefined") {
          console.warn("Redis error", e);
        }
      });
    } catch (error) {
      console.warn("Failed to create Redis client:", error);
    }
  }

  if (client) {
    try {
      console.info("Connecting Redis client...");

      await client.connect();
      console.info("Redis client connected.");
    } catch (error) {
      console.warn("Failed to connect Redis client:", error);

      console.warn("Disconnecting the Redis client...");
      client
        .disconnect()
        .then(() => {
          console.info("Redis client disconnected.");
        })
        .catch(() => {
          console.warn("Failed to quit the Redis client after failing to connect.");
        });
    }
  }

  /** @type {import("@neshca/cache-handler").Handler | null} */
  let redisHandler = null;
  if (client?.isReady) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    redisHandler = await createRedisHandler({
      client,
      keyPrefix: "prefix:",
      timeoutMs: 1000,
    });
  }

  const LRUHandler = createLruHandler();
  console.warn("Falling back to LRU handler because Redis client is not available.");

  return {
    handlers: [redisHandler, LRUHandler],
  };
});

module.exports = CacheHandler;
