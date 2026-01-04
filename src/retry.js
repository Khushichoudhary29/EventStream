const MAX_RETRIES = 3;

function shouldRetry(event) {
  return event.retryCount < MAX_RETRIES;
}

function incrementRetry(event) {
  return {
    ...event,
    retryCount: (event.retryCount || 0) + 1
  };
}

module.exports = {
  shouldRetry,
  incrementRetry,
  MAX_RETRIES
};
