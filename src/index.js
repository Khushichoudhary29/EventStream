const express = require("express");
const crypto = require("crypto");

const { enqueueEvent } = require("./queue");
const { getEvents } = require("./events");
const { startProcessor } = require("./processor");
const { getDLQ } = require("./dlq");
const { getMetrics } = require("./metrics");
const { validateEvent } = require("./validator");

const app = express();
const PORT = 3000;

app.use(express.json());

// Ingest event
app.post("/events", async (req, res) => {
  const error = validateEvent(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const event = {
    ...req.body,
    id: crypto.randomUUID(),
    retryCount: 0
  };

  await enqueueEvent(event);

  res.status(201).json({
    message: "Event accepted and queued (Redis)",
    eventId: event.id
  });
});

// View processed events
app.get("/events", (req, res) => {
  res.json(getEvents());
});

// View failed events (DLQ)
app.get("/failed-events", (req, res) => {
  res.json(getDLQ());
});

// View metrics
app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});

// Start background processor
startProcessor();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
