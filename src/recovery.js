const { redis, STREAM_KEY, GROUP_NAME } = require("./stream");

const IDLE_TIME_MS = 10000; // 10 seconds
const MAX_CLAIM = 10;

async function recoverPending(consumerName) {
  try {
    const pending = await redis.xpending(
      STREAM_KEY,
      GROUP_NAME,
      "-",
      "+",
      MAX_CLAIM
    );

    if (!pending || pending.length === 0) return;

    for (const p of pending) {
      const [id, owner, idle] = p;

      if (idle > IDLE_TIME_MS) {
        console.log("Recovering pending event:", id);

        await redis.xclaim(
          STREAM_KEY,
          GROUP_NAME,
          consumerName,
          IDLE_TIME_MS,
          id
        );
      }
    }
  } catch (err) {
    console.error("Recovery error:", err.message);
  }
}

module.exports = { recoverPending };
