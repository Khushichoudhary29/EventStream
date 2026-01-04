const { dequeueEvent } = require("./queue");
const { addEvent } = require("./events");

function startProcessor() {
  setInterval(() => {
    const event = dequeueEvent();

    if (event) {
      console.log("Processing event:", event.type);
      addEvent({ ...event, processedAt: new Date().toISOString() });
    }
  }, 2000); // every 2 seconds
}

module.exports = { startProcessor };
