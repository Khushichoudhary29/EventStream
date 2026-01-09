# EventStream Processor

A production-inspired **event-driven backend system** built using **Node.js, Express, and Redis Streams**. This project demonstrates how to design a **reliable, fault-tolerant event ingestion and processing pipeline** with retries, dead-letter handling, metrics, and crash recovery.

This is not a toy queue — it mirrors real-world backend patterns used in scalable systems and behaves like a mini Kafka-style pipeline using Redis.

---

## 🔍 Problem Statement

Modern backend systems often need to:

* Accept events quickly (HTTP APIs)
* Process them asynchronously
* Handle failures safely
* Avoid data loss during crashes

Traditional in-memory queues fail under crashes. This project solves that problem using **Redis Streams**.

---

## ✅ What This Project Does

* Accepts incoming events via REST API
* Stores events durably in Redis Streams
* Processes events using a background consumer
* Retries failed events with limits
* Moves permanently failed events to a Dead Letter Queue (DLQ)
* Recovers unacknowledged events after crashes
* Exposes processing metrics

---

## 🧠 Architecture Overview

**Flow:**

Client → Express API → Redis Stream → Stream Processor →

* Success → Stored events
* Retry → Re-queued
* Failure → DLQ

**Key Concepts Used:**

* Redis Streams (`XADD`, `XREADGROUP`, `XACK`)
* Consumer Groups
* Pending Entries List (PEL)
* Crash Recovery (`XPENDING`, `XCLAIM`)

---

## 🛠 Tech Stack

* **Node.js** (v18+)
* **Express.js** – REST API
* **Redis** – Stream-based message queue
* **ioredis** – Redis client

---

## 📁 Project Structure

```
EventStream/
│
├── src/
│   ├── index.js              # Express server entry point
│   ├── stream.js             # Redis stream & consumer group setup
│   ├── streamProcessor.js    # Background event processor
│   ├── recovery.js           # Pending event recovery logic
│   ├── retry.js              # Retry strategy
│   ├── queue.js              # (legacy / optional)
│   ├── events.js             # Processed events store
│   ├── dlq.js                # Dead Letter Queue
│   ├── metrics.js            # Metrics tracking
│   └── validator.js          # Event validation
│
├── package.json
└── README.md
```

## 1️⃣ Event Ingestion (index.js)
* Accepts events via REST API
* Validates input

* Assigns:
  * id (UUID)
  * retryCount
  * Pushes events to Redis Stream

📌 Why Redis Streams?
* Persistent
* Ordered
* Supports consumer groups
* Handles crash recovery

## 2️⃣ Redis Stream (stream.js)
* Responsibilities:
  * Initialize Redis connection
  * Create stream & consumer group
  * Add events using XADD

📌 Why consumer groups?
  * Multiple workers can scale horizontally
  * Redis tracks which messages are pending
  * Enables recovery if a worker crashes

## 3️⃣ Stream Processor (streamProcessor.js)
* Responsibilities:
  * Reads events using XREADGROUP
  * Processes one event at a time
  * Acknowledges events using XACK

Processing logic:

✅ Success → stored in events.json

🔁 Retryable failure → re-added to stream

❌ Permanent failure → sent to DLQ

📌 This is the heart of the system

## 4️⃣ Retry Logic (retry.js)
Controls:
 * Maximum retry attempts
I* ncrementing retry counters

📌 Why retry?

Transient failures (network, timeout) should not kill events.

## 5️⃣ Dead Letter Queue (dlq.js)
* Stores permanently failed events
* Keeps:
  * original event
  * failure reason
  * timestamp

📌 Why DLQ?

In production, failed events must be inspected, not deleted.

## 6️⃣ Recovery System (recovery.js)
* Uses:
  * XPENDING
  * XCLAIM

* Purpose:
  * Detect messages stuck with crashed consumers
  * Reassign them to active consumers

## 7️⃣ Metrics (metrics.js)
* Tracks:
  * processed events
  * failed events
  * retried events

* Exposed via:
  * GET /metrics

📌 Observability is mandatory in real systems

---

## 🌐 API Endpoints

### 1️⃣ Ingest Event

`POST /events`

**Request Body:**

```json
{
  "type": "USER_SIGNUP",
  "payload": {
    "userId": "123"
  }
}
```

**Response:**

```json
{
  "message": "Event accepted and queued (Redis)",
  "eventId": "uuid"
}
```

---

### 2️⃣ View Processed Events

`GET /events`

---

### 3️⃣ View Failed Events (DLQ)

`GET /failed-events`

---

### 4️⃣ View Metrics

`GET /metrics`

Example metrics:

```json
{
  "processed": 10,
  "failed": 2,
  "retried": 1
}
```

---

## 🔁 Retry & Failure Handling

* Each event has a retry counter
* Failed events are retried until limit is reached
* After max retries, event is moved to **Dead Letter Queue (DLQ)**

This prevents infinite retry loops.

---

## ♻️ Crash Recovery (Important)

If the server crashes **after reading but before acknowledging** an event:

* Redis keeps the event in the **Pending Entries List (PEL)**
* On restart, `recovery.js`:

  * Scans pending events
  * Claims stuck events using `XCLAIM`
  * Reprocesses them safely

This guarantees **at-least-once delivery**.

---

## 🚀 How to Run Locally

### 1️⃣ Start Redis

```bash
redis-server
```

*or using Docker*

```bash
docker run -p 6379:6379 redis
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Server

```bash
node src/index.js
```

Server runs on:

```
http://localhost:3000
```

---

## 🎯 Project Status

✅ Core features completed

✅ Stable & tested locally

✅ Ready for GitHub

Possible future improvements (optional):

* Persistent database storage
* Multiple consumers
* Rate limiting
* Docker Compose

---

## 📌 Why This Project Matters

This project demonstrates:

* Understanding of **distributed systems basics**
* Real-world **message queue patterns**
* Fault tolerance & recovery strategies

---

## Future Enhancements
* Technical
  * Persist processed events in PostgreSQL / MongoDB
  * Multiple consumers for parallel processing
  * Docker Compose setup (API + Redis)
  * Authentication & rate limiting

* System
  * Event schema versioning
  * Exponential backoff retry
  * Separate retry stream
  * Admin dashboard / alerts on DLQ growth

---

## 📝 Notes

* Keep redis running (port 6379)
* Use unique CONSUMER_NAME if scaling consumers
* MAX_RETRIES can be configured in retry.js
* IDLE_TIME_MS in recovery.js controls when pending events are reclaimed

---