const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.join(__dirname, "storage");
const EVENTS_FILE = path.join(STORAGE_DIR, "events.json");

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify([]));
  }
}

function loadEvents() {
  ensureStorage();

  const raw = fs.readFileSync(EVENTS_FILE, "utf-8").trim();
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify([]));
    return [];
  }
}

let events = loadEvents();

function addEvent(event) {
  events.push(event);
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

function getEvents() {
  return events;
}

module.exports = { addEvent, getEvents };
