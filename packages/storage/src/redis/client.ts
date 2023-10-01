import { type RedisClientType } from "@redis/client";
import { createClient } from "redis";

let redis: RedisClientType;

void (async () => {
  redis = createClient({
    url: process.env.REDIS_URL,
  });

  redis.on("error", (error) => console.error(`Error : ${error}`));

  await redis.connect();
})();

export { redis };
