const { dequeueEvent, enqueueEvent } = require("./queue");
const { addEvent } = require("./events");
const { shouldRetry, incrementRetry } = require("./retry");
const { addToDLQ } = require("./dlq");
const metrics = require("./metrics");
const processedIds = new Set();


function processEvent(event) {
  // Simulate failure for demo
  if (processedIds.has(event.id)) {
  console.log("Duplicate event ignored:", event.id);
  return;
}

processedIds.add(event.id);


  addEvent({
    ...event,
    processedAt: new Date().toISOString()
  });

  metrics.inc("processed");
}

async function startProcessor() {
  setInterval(async () => {
    const event = await dequeueEvent();
    if (!event) return;

    try {
      console.log("Processing event:", event.type);
      processEvent(event);
    } catch (err) {
      console.error("Processing failed:", err.message);
    }
  }, 1000);
}


module.exports = { startProcessor };
