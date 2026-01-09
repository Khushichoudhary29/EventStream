🚀 EventStream — Distributed Event Processing System (Node.js + Redis)
📌 Overview

EventStream is a backend system designed to ingest, process, and manage high-volume events in a reliable and fault-tolerant way.
It simulates how real-world systems (payment systems, log pipelines, analytics platforms) handle asynchronous events using queues, retries, and dead-letter handling.

This project focuses on backend engineering principles, not UI.

🎯 Problem Statement

In real-world systems:

Events arrive asynchronously

Some events fail during processing

Retrying blindly causes duplicates

Failed events must not be lost

Systems must remain observable and debuggable

Most beginner projects ignore these realities.

EventStream solves this by implementing:

Queue-based ingestion

Background processing

Retry mechanisms

Dead Letter Queue (DLQ)

Metrics and observability

Redis-backed reliability

🧠 System Architecture
Client
  │
  ▼
POST /events
  │
  ▼
Redis Queue
  │
  ▼
Background Processor
  ├── Success → Processed Events Store
  ├── Retry   → Redis Queue
  └── Failure → Dead Letter Queue (DLQ)

⚙️ Tech Stack

Node.js (Backend runtime)

Express.js (API layer)

Redis (Queue & reliability layer)

Docker (Redis containerization)

Crypto (Event IDs & idempotency)

REST APIs (System interaction)

✨ Key Features
1️⃣ Event Ingestion API

Accepts JSON events via REST

Validates required fields

Assigns unique event IDs

Pushes events into Redis queue

2️⃣ Redis-backed Queue

Replaces in-memory queues

Ensures durability and scalability

Decouples ingestion from processing

3️⃣ Background Worker

Runs independently of API

Pulls events from Redis

Processes events asynchronously

4️⃣ Retry Mechanism

Failed events are retried

Retry count tracked per event

Prevents infinite retry loops

5️⃣ Dead Letter Queue (DLQ)

Permanently failed events are isolated

Failure reason is stored

Enables debugging without data loss

6️⃣ Idempotency Handling

Duplicate events are detected

Prevents double processing

Critical for real-world systems

7️⃣ Metrics & Observability

Tracks processed, failed, retried events

Exposed via /metrics endpoint

Helps monitor system health

📂 Project Structure
EventStream/
│
├── src/
│   ├── index.js        # Express API entry point
│   ├── queue.js        # Redis queue logic
│   ├── processor.js   # Background worker
│   ├── events.js      # Processed event storage
│   ├── dlq.js         # Dead Letter Queue
│   ├── retry.js       # Retry policy
│   ├── validator.js   # Input validation
│   └── metrics.js     # System metrics
│
├── data/               # Local storage (JSON files)
├── README.md
└── package.json

🚦 API Endpoints
➤ Ingest Event
POST /events


Request Body

{
  "type": "LOGIN",
  "payload": {
    "user": "khushi"
  }
}


Response

{
  "message": "Event accepted and queued (Redis)",
  "eventId": "uuid"
}

➤ View Processed Events
GET /events

➤ View Failed Events (DLQ)
GET /failed-events

➤ View Metrics
GET /metrics

▶️ How to Run Locally
1️⃣ Start Redis (Docker)
docker run -d -p 6379:6379 redis


Verify:

docker exec -it <container_name> redis-cli ping


Expected:

PONG

2️⃣ Install Dependencies
npm install

3️⃣ Start Server
node src/index.js

🧪 Testing

Use Postman or VS Code REST Client

Send POST requests to /events

Observe:

Redis queue behavior

Retry handling

DLQ population

Metrics incrementing

🚀 Future Enhancements

Planned improvements to make this production-grade:

Redis Streams & Consumer Groups

Persistent database (PostgreSQL)

Authentication (API keys / JWT)

Rate limiting

Event replay support

Horizontal worker scaling

Docker Compose setup

Cloud deployment (AWS / GCP)

Structured logging (Winston / OpenTelemetry)

🧑‍💻 Learning Outcomes

This project demonstrates hands-on understanding of:

Asynchronous systems

Queue-based architectures

Fault tolerance

Backend scalability patterns

Real-world system design

📌 Final Note

This is not a tutorial project.
It is a learning-focused backend system designed to mirror real production challenges.