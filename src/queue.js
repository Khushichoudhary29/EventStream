const eventQueue = [];


function enqueueEvent(event) {
  eventQueue.push(event);
}

function dequeueEvent() {
  return eventQueue.shift();
}

function getQueueSize() {
  return eventQueue.length;
}

module.exports = {
  enqueueEvent,
  dequeueEvent,
  getQueueSize
};
