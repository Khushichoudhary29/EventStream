const express = require("express");
const router = express.Router();

// IMPORTANT: this must be outside routes
const events = [];

// POST /events
router.post("/", (req, res) => {
  const event = req.body;

  if (!event || !event.type) {
    return res.status(400).json({ error: "Invalid event data" });
  }

  events.push(event);

  console.log("Event stored:", event);

  res.status(200).json({ message: "Event ingested successfully" });
});

// GET /events
router.get("/", (req, res) => {
  res.json(events);
});

module.exports = router;
