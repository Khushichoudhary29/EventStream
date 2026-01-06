function validateEvent(event) {
  if (!event) return "Event body missing";

  const required = ["id", "source", "type", "severity", "timestamp", "payload"];

  for (const field of required) {
    if (!event[field]) {
      return `Missing field: ${field}`;
    }
  }

  return null;
}

module.exports = { validateEvent };
