const failedEvents = [];

function addToDLQ(event, reason) {
  failedEvents.push({
    ...event,
    failedAt: new Date().toISOString(),
    reason
  });
}

function getDLQ() {
  return failedEvents;
}

module.exports = {
  addToDLQ,
  getDLQ
};
