const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null
});

const STREAM_KEY = "event-stream";
const GROUP_NAME = "event-processors";

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

async function initStream() {
  try {
    // Create consumer group (MKSTREAM creates stream if missing)
    await redis.xgroup(
      "CREATE",
      STREAM_KEY,
      GROUP_NAME,
      "0",
      "MKSTREAM"
    );
    console.log("Consumer group created");
  } catch (err) {
    // Ignore if group already exists
    if (!err.message.includes("BUSYGROUP")) {
      throw err;
    }
    console.log("Consumer group already exists");
  }
}

async function addEventToStream(event) {
  await redis.xadd(
    STREAM_KEY,
    "*",
    "event",
    JSON.stringify(event)
  );
}

module.exports = {
  redis,
  STREAM_KEY,
  GROUP_NAME,
  initStream,
  addEventToStream
};
