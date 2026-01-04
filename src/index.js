const express = require("express");
const { enqueueEvent } = require("./queue");
const { getEvents } = require("./events");
const { startProcessor } = require("./processor");

const app = express();
const PORT = 3000;

app.use(express.json());

// Ingest event
app.post("/events", (req, res) => {
  enqueueEvent(req.body);

  res.status(201).json({
    message: "Event accepted and queued"
  });
});

// View processed events
app.get("/events", (req, res) => {
  res.json(getEvents());
});

// Start background worker
startProcessor();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
