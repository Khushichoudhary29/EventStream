const {
  redis,
  STREAM_KEY,
  GROUP_NAME,
  CONSUMER_NAME
} = require("./stream");

const { addEvent } = require("./events");
const { shouldRetry, incrementRetry } = require("./retry");
const { addToDLQ } = require("./dlq");
const metrics = require("./metrics");

async function startStreamProcessor() {
  console.log("Stream processor started");

  while (true) {
    try {
      const response = await redis.xreadgroup(
        "GROUP",
        GROUP_NAME,
        CONSUMER_NAME,
        "BLOCK",
        5000,
        "COUNT",
        1,
        "STREAMS",
        STREAM_KEY,
        ">"
      );

      if (!response) continue;

      const [[, messages]] = response;

      for (const [id, fields] of messages) {
        const event = JSON.parse(fields[1]);

        try {
          console.log("Processing stream event:", event.type);

          addEvent({
            ...event,
            processedAt: new Date().toISOString()
          });

          metrics.inc("processed");

          await redis.xack(STREAM_KEY, GROUP_NAME, id);
        } catch (err) {
          metrics.inc("failed");

          if (shouldRetry(event)) {
            metrics.inc("retried");
            await redis.xadd(
              STREAM_KEY,
              "*",
              "data",
              JSON.stringify(incrementRetry(event))
            );
          } else {
            addToDLQ(event, err.message);
          }

          await redis.xack(STREAM_KEY, GROUP_NAME, id);
        }
      }
    } catch (err) {
      console.error("Stream processor error:", err.message);
    }
  }
}

module.exports = { startStreamProcessor };
