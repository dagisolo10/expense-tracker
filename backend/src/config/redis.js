const Redis = require("ioredis");
const ENV = require("./env");

const redis = ENV.NODE_ENV === "development" ? new Redis({ host: ENV.REDIS_HOST, port: ENV.REDIS_PORT }) : new Redis(ENV.REDIS_URL);

redis.on("connect", () => console.log("✅ Redis connected"));

redis.on("error", (err) => console.log("Redis Client Error", err));

module.exports = redis;
