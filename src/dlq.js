const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.join(__dirname, "storage");
const DLQ_FILE = path.join(STORAGE_DIR, "dlq.json");

function ensureDLQ() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  if (!fs.existsSync(DLQ_FILE)) {
    fs.writeFileSync(DLQ_FILE, JSON.stringify([]));
  }
}

function loadDLQ() {
  ensureDLQ();

  const raw = fs.readFileSync(DLQ_FILE, "utf-8").trim();
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    fs.writeFileSync(DLQ_FILE, JSON.stringify([]));
    return [];
  }
}

let dlq = loadDLQ();

function addToDLQ(event, reason) {
  dlq.push({
    ...event,
    failedAt: new Date().toISOString(),
    reason
  });

  fs.writeFileSync(DLQ_FILE, JSON.stringify(dlq, null, 2));
}

function getDLQ() {
  return dlq;
}

module.exports = { addToDLQ, getDLQ };
