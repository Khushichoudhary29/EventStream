const { createClient } = require("redis");

const client = createClient({
  url: "redis://localhost:6379"
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await client.connect();
  console.log("Redis connected");
})();

const QUEUE_KEY = "eventstream:queue";

async function enqueueEvent(event) {
  await client.rPush(QUEUE_KEY, JSON.stringify(event));
}

async function dequeueEvent() {
  const result = await client.lPop(QUEUE_KEY);
  return result ? JSON.parse(result) : null;
}

module.exports = { enqueueEvent, dequeueEvent };
