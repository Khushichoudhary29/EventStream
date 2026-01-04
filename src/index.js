const express = require("express");

const { enqueueEvent } = require("./queue");
const { getEvents } = require("./events");
const { startProcessor } = require("./processor");
const { getDLQ } = require("./dlq");
const { getMetrics } = require("./metrics");

const app = express();
const PORT = 3000;

app.use(express.json());

/**
 * Ingest event
 * Adds retryCount at entry point (important for Day 3)
 */
app.post("/events", (req, res) => {
  const event = {
    ...req.body,
    retryCount: 0
  };

  enqueueEvent(event);

  res.status(201).json({
    message: "Event accepted and queued"
  });
});

/**
 * View successfully processed events
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
 * Start background processor
 */
startProcessor();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
