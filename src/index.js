const express = require("express");
const crypto = require("crypto");

const { getEvents } = require("./events");
const { getDLQ } = require("./dlq");
const { getMetrics } = require("./metrics");
const { validateEvent } = require("./validator");

const { initStream, addEventToStream } = require("./stream");
const { startStreamProcessor } = require("./streamProcessor");

const app = express();
const PORT = 3000;

app.use(express.json());

/**
 * Initialize Redis Stream
 */
initStream()
  .then(() => {
    console.log("Redis stream initialized");
  })
  .catch((err) => {
    console.error("Failed to init Redis stream", err);
    process.exit(1);
  });

/**
 * Ingest event
 */
app.post("/events", async (req, res) => {
  const error = validateEvent(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const event = {
    ...req.body,
    id: crypto.randomUUID(),
    retryCount: 0,
    createdAt: Date.now()
  };

  await addEventToStream(event);

  res.status(201).json({
    message: "Event accepted and queued (Redis Stream)",
    eventId: event.id
  });
});

/**
 * View processed events
 */
app.get("/events", (req, res) => {
  res.json(getEvents());
});

/**
 * View permanently failed events (DLQ)
 */
app.get("/failed-events", (req, res) => {
  res.json(getDLQ());
});

/**
 * View system metrics
 */
app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});

/**
 * Start Redis Stream processor
 */
startStreamProcessor();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
