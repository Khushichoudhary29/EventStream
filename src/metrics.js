const metrics = {
  received: 0,
  processed: 0,
  failed: 0,
  retried: 0
};

function inc(type) {
  if (metrics[type] !== undefined) {
    metrics[type]++;
  }
}

function getMetrics() {
  return metrics;
}

module.exports = {
  inc,
  getMetrics
};
