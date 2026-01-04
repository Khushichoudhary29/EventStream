const { dequeueEvent, enqueueEvent } = require("./queue");
const { addEvent } = require("./events");
const { shouldRetry, incrementRetry } = require("./retry");
const { addToDLQ } = require("./dlq");
const metrics = require("./metrics");

function processEvent(event) {
  // Simulate failure for demo
  if (event.type === "LOGIN" && Math.random() < 0.4) {
    throw new Error("Random processing failure");
  }

  addEvent({
    ...event,
    processedAt: new Date().toISOString()
  });

  metrics.inc("processed");
}

function startProcessor() {
  setInterval(() => {
    const event = dequeueEvent();
    if (!event) return;

    try {
      console.log("Processing event:", event.type);
      processEvent(event);
    } catch (err) {
      console.error("Processing failed:", err.message);
      metrics.inc("failed");

      if (shouldRetry(event)) {
        metrics.inc("retried");
        enqueueEvent(incrementRetry(event));
      } else {
        addToDLQ(event, err.message);
      }
    }
  }, 1000);
}

module.exports = { startProcessor };
