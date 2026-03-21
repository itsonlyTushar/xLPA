import { SDTopic } from "../types";

export const messageQueueTopics: SDTopic[] = [
  {
    id: "sd-mq-pub-sub",
    chapterId: 5,
    title: "Pub/Sub & Message Queues",
    order: 1,
    difficulty: "beginner",
    estimatedMinutes: 12,
    overview:
      "Message queues decouple producers (who create messages) from consumers (who process them). A producer publishes a message to a topic/queue; consumers subscribe and process messages asynchronously. This enables: loose coupling between services, buffering traffic spikes, retry on failure, and independent scaling of producers and consumers. Two models: Point-to-Point (one message → one consumer) and Pub/Sub (one message → many subscribers). The insight that changes how you think about queues: a message queue is NOT just a communication mechanism. It's a BUFFER that absorbs the difference between production rate and consumption rate. When your web servers receive 10,000 orders/second during Black Friday but your payment processor handles only 500/second, the queue absorbs the 9,500/second difference. Without it, you'd either lose orders or crash the payment system.",
    keyPoints: [
      "Point-to-Point: message goes to exactly ONE consumer (task queue — SQS, RabbitMQ work queues)",
      "Pub/Sub: message goes to ALL subscribers on a topic (event broadcasting — Kafka, SNS, Redis Pub/Sub)",
      "Decoupling: producer and consumer don't need to know about each other",
      "Buffering: queue absorbs traffic spikes — consumers process at their own pace",
      "Retry & Dead Letter Queues: failed messages can be retried or moved to a DLQ for investigation",
      "At-least-once vs exactly-once delivery: most systems guarantee at-least-once; exactly-once is extremely hard",
      "HIDDEN GOTCHA: Message ordering is NOT guaranteed in most queue systems! SQS standard queues can deliver messages out of order. RabbitMQ can deliver out of order under failure. Even Kafka only guarantees order WITHIN a partition, not across partitions. If your system requires 'process order creation before order payment,' you must design your partition key (Kafka) or use FIFO queues (SQS FIFO, but 300 msg/sec limit) or handle reordering in the consumer",
      "MOST DEVS DON'T KNOW: Dead Letter Queues (DLQ) are not just for logging failures. They're your safety net. A DLQ receives messages that failed processing N times (typically 3-5). Monitor DLQ depth — if it grows, something is systematically wrong. You should have an automated alert on DLQ depth > 0 and a manual replay mechanism to re-process DLQ messages after fixing the bug. Companies that lack DLQ monitoring silently lose data for weeks before anyone notices",
      "CRITICAL: Queue depth (number of pending messages) is your most important monitoring metric. Growing queue depth means consumers can't keep up with producers. Options: add more consumers, increase consumer throughput, identify and fix slow consumers, or accept that processing is delayed. Shrinking queue depth means you have excess consumer capacity",
      "The 'poison message' problem: a malformed message that causes the consumer to crash every time it tries to process it. The message goes back to the queue, is picked up again, crashes again — infinite loop. Solution: track processing attempts per message. After N failures, move to DLQ. Every production queue system MUST have this",
    ],
    deepDive: [
      {
        title: "Why Message Queues Matter",
        content:
          "Without a queue: Service A calls Service B synchronously. If B is slow or down, A is also slow or down. With a queue: A publishes a message and returns immediately. B processes it whenever it's ready. If B crashes, the message stays in the queue until B recovers. Example: user places an order → Order Service publishes 'order.created' → Email Service, Inventory Service, and Analytics Service each process it independently at their own pace.",
        diagram: `Without Queue (Tight Coupling):
  Order ──sync──► Email Service (if down, order fails!)
  
With Queue (Loose Coupling):
  Order ──► [Message Queue] ──► Email Service
                             ──► Inventory Service
                             ──► Analytics Service
  (order succeeds even if email is down)`,
      },
      {
        title: "Delivery Guarantees",
        content:
          "At-most-once: message may be lost but never duplicated. Used for non-critical notifications. At-least-once: message is guaranteed delivered but may be duplicated. Most common — consumers must be idempotent (processing the same message twice produces the same result). Exactly-once: message delivered exactly once — nearly impossible in distributed systems. Kafka achieves it within its ecosystem using idempotent producers + transactions.",
      },
      {
        title: "SQS vs RabbitMQ vs Kafka — The Real-World Decision",
        content:
          "This is one of the most common architecture decisions, and most tutorials get it wrong by comparing features. Here's how to actually choose:\n\n**Amazon SQS (Simple Queue Service)**: Use when you want ZERO operational overhead. It's fully managed — no servers, no clusters, no patching. Pay per message. Standard queues: unlimited throughput, at-least-once, possibly out-of-order. FIFO queues: exactly-once, ordered, but limited to 300 messages/second (3,000 with batching). Best for: task queues, simple producer-consumer patterns, teams that don't want to operate infrastructure.\n\n**RabbitMQ**: Use when you need complex routing patterns. RabbitMQ has exchanges (direct, topic, fanout, headers) that route messages based on rules. You can route 'order.created.us' to the US processing queue and 'order.created.eu' to the EU queue using topic patterns. Also supports request-reply pattern and priority queues. Best for: complex routing, legacy system integration, when you need fine-grained message flow control.\n\n**Apache Kafka**: Use when you need event STREAMING, not just queuing. Kafka retains messages (doesn't delete after consumption), supports replay, handles millions of messages/second, and enables multiple consumer groups. Best for: event-driven architectures, data pipelines, real-time analytics, event sourcing, when you need to replay events.\n\nThe decision shortcut:\n▸ Simple task queue → SQS\n▸ Complex routing → RabbitMQ\n▸ Event streaming + replay → Kafka\n▸ Don't want to operate anything → SQS\n▸ Need 100K+ msg/sec → Kafka\n\nThe anti-pattern: using Kafka as a simple task queue. Kafka is complex to operate (ZooKeeper/KRaft, partitions, consumer groups, offset management). If you just need 'process these jobs in the background,' SQS or RabbitMQ is dramatically simpler.",
      },
    ],
    realWorldExamples: [
      { company: "Uber", description: "Uses Kafka for all inter-service events: ride requests, driver locations, trip updates, payment events. Millions of events per second flow through Kafka topics. Services subscribe to relevant topics independently." },
      { company: "Slack", description: "Uses message queues to decouple the write path (sending messages) from side effects (push notifications, search indexing, link previews). A message send returns instantly; everything else happens asynchronously." },
    ],
    tradeOffs: [
      { optionA: "Synchronous (direct calls)", optionB: "Asynchronous (message queue)", comparison: "Sync: simple, immediate response, tight coupling, cascading failures. Async: decoupled, resilient, delayed processing, harder to debug, eventual consistency." },
    ],
    interviewTips: [
      "Introduce a message queue whenever services need to communicate asynchronously",
      "Always mention idempotent consumers when discussing at-least-once delivery",
      "Dead letter queues are important — show you handle failure cases",
    ],
    practiceQuestions: [
      { question: "A user uploads a video that needs to be transcoded to 5 resolutions. How would you architect this?", answer: "User uploads to Storage Service → publishes 'video.uploaded' event to a message queue. A Transcoding Worker pool subscribes to the queue. Each worker picks up a job, transcodes to one resolution, and publishes 'transcode.complete'. The queue enables: (1) async processing (upload returns instantly), (2) parallel transcoding (multiple workers process different resolutions), (3) retry on failure (if a worker crashes, message goes back to queue), (4) independent scaling (add more workers during peak upload times)." },
    ],
    tags: ["message-queue", "pub-sub", "async", "decoupling", "at-least-once"],
  },
  {
    id: "sd-mq-kafka",
    chapterId: 5,
    title: "Apache Kafka Deep Dive",
    order: 2,
    difficulty: "intermediate",
    estimatedMinutes: 15,
    overview:
      "Kafka is a distributed event streaming platform designed for high-throughput, fault-tolerant, real-time data pipelines. Unlike traditional message queues (RabbitMQ/SQS) where messages are deleted after consumption, Kafka retains messages for a configurable retention period, enabling replayability. Kafka is the backbone of event-driven architectures at LinkedIn, Netflix, Uber, and thousands of companies. The insight that changes everything: Kafka is NOT a message queue. It's a distributed commit log — fundamentally an append-only file system with consumer position tracking. This distinction matters because once you understand that Kafka is just a log, partition design, consumer groups, and compaction all make intuitive sense.",
    keyPoints: [
      "Topics: logical channels for messages. Each topic has N partitions.",
      "Partitions: ordered, append-only logs. Key for parallelism — more partitions = more throughput.",
      "Consumer Groups: each message goes to ONE consumer per group. Multiple groups each get all messages.",
      "Offsets: each message has a position (offset) in its partition. Consumers track their offset.",
      "Retention: messages are kept for days/weeks (configurable), not deleted on read. Enables replay.",
      "Throughput: single Kafka cluster can handle millions of messages/sec with ms latency.",
      "HIDDEN GOTCHA — Consumer Group Rebalancing Storms: When a consumer joins or leaves a group, Kafka redistributes all partitions (a 'rebalance'). During rebalance, ALL consumers in the group STOP processing. With 100 partitions and slow consumers, rebalancing can take 30+ seconds. During that time: zero processing. Solutions: (1) Use static group membership (group.instance.id) to avoid rebalancing on restarts, (2) Use cooperative/incremental rebalancing (partition.assignment.strategy=cooperative-sticky) which only reassigns affected partitions, (3) Avoid frequent consumer restarts during deploys — use rolling restarts with adequate session.timeout.ms",
      "MOST DEVS DON'T KNOW — Offset Management Gotcha: By default, Kafka auto-commits offsets every 5 seconds. If your consumer crashes AFTER auto-commit but BEFORE processing the message: data is LOST (offset moved forward, message never processed). If it crashes AFTER processing but BEFORE auto-commit: message is REPROCESSED (duplicate). The SAFE pattern: disable auto-commit (enable.auto.commit=false) and manually commit AFTER processing each batch. This gives you at-least-once — combine with idempotent consumers for exactly-once semantics",
      "CRITICAL — Partition Count is (Almost) Permanent: Increasing partition count is easy. DECREASING is impossible without recreating the topic. And increasing partition count BREAKS ordering for existing keys (because hash(key) % new_num_partitions gives different results). Start with a reasonable number (e.g., 6× the number of consumers you expect) and plan ahead. Changing partition count on a live topic is a data reprocessing event",
      "Log Compaction — The Hidden Superpower: Besides time-based retention (delete after 7 days), Kafka supports log compaction: keep only the LATEST value per message key. This transforms Kafka into a key-value store! Use case: user profile changes. After compaction, each user_id has exactly one entry — the latest profile. New consumers get the full current state without replaying years of history. This is how Kafka can replace materialized views",
    ],
    deepDive: [
      {
        title: "Kafka Architecture",
        content:
          "A Kafka cluster has multiple brokers (servers). Each topic is split into partitions distributed across brokers. Each partition has a leader broker (handles reads/writes) and N replicas (for fault tolerance). Producers write to the partition leader. Consumers read from the leader (or replicas in newer versions). ZooKeeper (or KRaft in newer versions) manages broker metadata and leader election.",
        diagram: `Kafka Cluster:

  Producer ──► Topic: "orders"
               ├── Partition 0 (Broker 1)  [0,1,2,3,4,5...]
               ├── Partition 1 (Broker 2)  [0,1,2,3,4...]
               └── Partition 2 (Broker 3)  [0,1,2,3...]
                        │
               Consumer Group A:
               ├── Consumer 1 ← Partition 0
               ├── Consumer 2 ← Partition 1
               └── Consumer 3 ← Partition 2`,
      },
      {
        title: "Partitioning & Ordering",
        content:
          "Messages within a partition are strictly ordered. Messages across partitions have NO ordering guarantee. Kafka assigns messages to partitions by: hash(message_key) % num_partitions. So messages with the same key always go to the same partition, guaranteeing order for that key. Example: all events for user_id=123 go to partition 7, in order. This is critical for use cases like: order events (created → paid → shipped must be in order per order).",
      },
      {
        title: "Producer Delivery Guarantees — acks Configuration",
        content:
          "The producer's `acks` setting controls durability and has a massive impact on data safety:\n\n**acks=0**: Producer doesn't wait for any acknowledgment. Messages can be lost (broker might not have received it). Fastest throughput. Use for: metrics, clickstream where losing 0.01% is acceptable.\n\n**acks=1**: Producer waits for the partition LEADER to write the message. If the leader crashes right after acknowledgment but BEFORE replication, the message is LOST. This is the default and it loses data!\n\n**acks=all (or acks=-1)**: Producer waits for ALL in-sync replicas (ISR) to write the message. Combined with `min.insync.replicas=2`, this means at least 2 brokers must confirm the write. This is the safe option for any data you can't lose.\n\nThe combination that every production Kafka cluster should use:\n▸ acks=all\n▸ min.insync.replicas=2 (with replication.factor=3)\n▸ enable.idempotence=true (prevents duplicate messages from producer retries)\n\nThis gives you: no data loss from broker failures + no duplicates from network retries. The cost: ~2-5ms additional latency per produce call. Worth it for any financial, transactional, or business-critical data.",
      },
      {
        title: "Kafka Connect & Schema Registry — The Production Stack",
        content:
          "Most tutorials teach you Kafka the message broker. Production Kafka is an ecosystem:\n\n**Kafka Connect**: Framework for streaming data between Kafka and other systems WITHOUT writing code. Source connectors pull data IN (e.g., Debezium captures database changes — CDC — and pushes them to Kafka topics). Sink connectors push data OUT (e.g., JDBC Sink writes Kafka events to a database, Elasticsearch Sink indexes events for search). This replaces hundreds of custom integration scripts.\n\n**Schema Registry**: Stores Avro/Protobuf/JSON schemas for Kafka messages. Producers register schemas, consumers validate against them. This PREVENTS the #1 cause of Kafka production incidents: a producer changes the message format and breaks all consumers. Schema evolution rules: (1) Backward compatible — new schema can read old data (add optional fields), (2) Forward compatible — old schema can read new data (don't remove fields), (3) Full compatible — both. In practice, always start with backward compatibility.\n\n**The Interview Pattern**: When designing a system with Kafka, mention the full stack: Kafka brokers + Schema Registry + Kafka Connect (for integrations) + consumer groups (for processing). This shows production experience, not just textbook knowledge.",
      },
    ],
    realWorldExamples: [
      { company: "LinkedIn", description: "Created Kafka. Processes 7+ trillion messages per day. Used for activity feeds, metrics, logging, and ETL pipelines. LinkedIn's entire data infrastructure flows through Kafka." },
      { company: "Netflix", description: "Uses Kafka for real-time analytics, event processing, and as the backbone of their data pipeline. Every user action (play, pause, search) is a Kafka event that feeds into ML models and monitoring." },
    ],
    tradeOffs: [
      { optionA: "Kafka", optionB: "RabbitMQ / SQS", comparison: "Kafka: high throughput, message retention (replay), complex to operate, overkill for simple task queues. RabbitMQ/SQS: simpler, message deleted after consumption, better for task queues and fan-out to small numbers of consumers." },
    ],
    interviewTips: [
      "Use Kafka when you need: event streaming, replay capability, high throughput, or event sourcing",
      "Use SQS/RabbitMQ for simple task queues where replay isn't needed",
      "Mention partition key design — it determines ordering guarantees and parallelism",
    ],
    practiceQuestions: [
      { question: "How would you use Kafka to ensure order events are processed in order?", answer: "Set the partition key to order_id. All events for the same order (created, paid, shipped, delivered) go to the same partition, guaranteeing order within that partition. Use a consumer group where each consumer handles N partitions. Number of partitions = max parallelism (e.g., 32 partitions = up to 32 consumers). If a consumer fails, Kafka rebalances its partitions to other consumers in the group. Messages are NOT deleted after processing — they stay for the retention period, enabling replay if needed." },
    ],
    tags: ["kafka", "event-streaming", "partitions", "consumer-groups", "distributed-log"],
  },
  {
    id: "sd-mq-event-driven",
    chapterId: 5,
    title: "Event-Driven Architecture",
    order: 3,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "Event-Driven Architecture (EDA) is a design pattern where services communicate by producing and consuming events rather than through direct API calls. An event is an immutable record of something that happened ('OrderPlaced', 'PaymentProcessed', 'UserRegistered'). EDA enables loose coupling, independent scaling, and auditability. It's the foundation of microservices at scale. Here's the key insight: EDA is not about technology (Kafka, RabbitMQ, SNS). It's about a fundamental shift in how you think about communication. In synchronous systems, you think 'A calls B.' In event-driven systems, you think 'A announces what happened, and whoever cares can react.' This inversion of control is what makes EDA so powerful — and so tricky to debug.",
    keyPoints: [
      "Event: an immutable fact — 'something happened' (past tense naming: OrderCreated, not CreateOrder)",
      "Event Producer: service that emits events (doesn't know who consumes them)",
      "Event Consumer: service that reacts to events (doesn't know who produced them)",
      "Event Bus/Broker: Kafka, SNS+SQS, EventBridge — routes events from producers to consumers",
      "Choreography vs Orchestration: choreography = services react to events independently; orchestration = a central coordinator manages the flow",
      "Saga pattern: long transactions across services using compensating events (not distributed transactions)",
      "HIDDEN GOTCHA — The Dual Write Problem: When a service needs to update its database AND publish an event, you have a dual write. If the DB write succeeds but the event publish fails (or vice versa), your system is inconsistent. This is THE most common bug in event-driven systems. Solutions: (1) Transactional Outbox Pattern: write the event to an 'outbox' table in the SAME database transaction as the business data. A separate process polls the outbox table and publishes events. This guarantees both happen or neither happens. (2) CDC (Change Data Capture): Use Debezium to capture database changes and automatically publish them to Kafka. No application code needed. (3) Event Sourcing: The event IS the write — no dual write problem because events are the source of truth",
      "MOST DEVS DON'T KNOW — Event Schema Evolution is the #1 Operational Headache: Your OrderCreated event today has {orderId, userId, total}. Next month, you add {currency}. Next quarter, you rename {total} to {amount}. Every consumer must handle old AND new schemas. Use Avro/Protobuf with a Schema Registry (not JSON!) because: (1) They enforce schema compatibility rules (backward, forward, full), (2) They're more compact (save 40-60% bandwidth over JSON), (3) They generate typed code in consumer languages. The worst possible approach: raw JSON events with no schema enforcement — guaranteed to break consumers within months",
      "CRITICAL — Event Ordering and Idempotency Must Be Part of Your Contract: Your event contract should specify: (1) Is ordering guaranteed? (Within partition for Kafka, not guaranteed for SNS/SQS), (2) Can events be duplicated? (Yes, almost always), (3) What's the format version? Events are an API contract between services — treat them with the same discipline as REST APIs (versioning, backward compatibility, documentation)",
      "The Temporal Coupling Trap: 'We're event-driven so we're decoupled!' — not if Consumer B crashes and misses events, and your system has no way to recover. True decoupling requires: persistent events (Kafka, not Redis Pub/Sub), replay capability, and consumers that can rebuild state from the event log. If you use fire-and-forget pub/sub, you've replaced request-response with an unreliable message system — worse than what you had",
    ],
    deepDive: [
      {
        title: "Choreography vs Orchestration",
        content:
          "Choreography: each service knows what to do when it sees an event. OrderService emits OrderCreated → PaymentService charges card → emits PaymentProcessed → InventoryService reserves stock → emits StockReserved → ShippingService ships. No central controller. Flexible but hard to debug the full flow. Orchestration: a Saga Coordinator service directs the flow. It calls PaymentService, then InventoryService, then ShippingService. Each step is explicit. Easier to understand but creates a central dependency.",
        diagram: `Choreography (Event-Driven):
  Order ──► [OrderCreated] ──► Payment ──► [PaymentDone]
                                              │
                               Inventory ◄────┘
                                  │
                            [StockReserved] ──► Shipping

Orchestration (Coordinator):
  ┌──────────────────┐
  │ Saga Coordinator │
  │  1. Pay          │
  │  2. Reserve Stock│
  │  3. Ship         │
  └──────────────────┘`,
      },
      {
        title: "The Transactional Outbox Pattern — Your Best Friend in EDA",
        content:
          "This is the single most important pattern in production event-driven systems. Here's the problem: you need to write to your database AND publish an event atomically. You can't use a distributed transaction (2PC) because it's slow and fragile. You can't publish first then write (what if the write fails? You published a lie). You can't write first then publish (what if publish fails? The event is lost).\n\nThe Outbox Pattern:\n1. In the SAME database transaction, write your business data AND insert a row into an 'outbox' table\n2. A separate Outbox Publisher process reads from the outbox table and publishes to Kafka/SNS\n3. After successful publish, mark the outbox row as published (or delete it)\n\nBecause step 1 is a single database transaction, atomicity is guaranteed. The outbox publisher is a simple polling loop or CDC-based relay.\n\nImplementation options:\n▸ Polling Publisher: SELECT * FROM outbox WHERE published = false ORDER BY created_at — Simple, adds ~100ms latency\n▸ CDC-based (Debezium): Watches the database WAL/binlog and publishes changes — Near real-time, more operational complexity\n▸ Listen/Notify (PostgreSQL): pg_notify on outbox insert — Instant, PostgreSQL-specific",
        diagram: `Transactional Outbox Pattern:

  BEGIN TRANSACTION
    INSERT INTO orders (id, user_id, total) VALUES (...)
    INSERT INTO outbox (event_type, payload) VALUES ('OrderCreated', '{...}')
  COMMIT
          │
          ▼
  ┌─────────────────┐       ┌──────────┐
  │ Outbox Publisher │──────►│  Kafka   │
  │ (poll or CDC)   │       │ Topic    │
  └─────────────────┘       └──────────┘`,
      },
      {
        title: "Saga Pattern Deep Dive — Distributed Transactions Without 2PC",
        content:
          "The Saga pattern replaces distributed transactions with a sequence of local transactions + compensating actions. Each step either succeeds and triggers the next step, or fails and triggers compensations for all previous steps.\n\nExample — E-commerce Order:\n1. Order Service: Create order (PENDING) ✓\n2. Payment Service: Charge customer ✓\n3. Inventory Service: Reserve stock ✗ (OUT OF STOCK)\n4. Compensate Step 2: Refund customer ✓\n5. Compensate Step 1: Cancel order ✓\n\nKey insight: Compensating actions are NOT rollbacks. A refund is not the same as 'the charge never happened.' The customer sees a charge AND a refund on their statement. Design your compensations from the beginning — every saga step must have a defined compensation. Steps without compensations must be the LAST step (the 'pivot transaction').\n\nImplementation strategies:\n▸ **Choreography Saga**: Each service publishes events, next service reacts. Simple for 2-3 steps, becomes a debugging nightmare for 5+ steps. How do you trace the full saga? Correlation IDs (propagate a saga_id through every event).\n▸ **Orchestration Saga**: A central coordinator (saga orchestrator) tells each service what to do. Better observability, easier failure handling, but the orchestrator is a critical service. Frameworks: Temporal.io, AWS Step Functions, Netflix Conductor.\n\nThe reality check: Sagas introduce significant complexity. You need to handle: partial failures, compensation failures (what if the refund fails?), concurrent sagas (two orders for the same last item), and semantic consistency. Only use sagas when distributed transactions are truly unavoidable.",
      },
    ],
    realWorldExamples: [
      { company: "Amazon", description: "Order processing is heavily event-driven. When you place an order, events flow through payment processing, fraud detection, inventory management, warehouse picking, and shipping — all as independent services reacting to events." },
    ],
    tradeOffs: [
      { optionA: "Choreography", optionB: "Orchestration", comparison: "Choreography: fully decoupled, no single point of failure, harder to trace/debug, complex failure handling. Orchestration: clear flow, easier to debug, central coordinator is a bottleneck/SPOF, tighter coupling." },
    ],
    interviewTips: [
      "Use event-driven architecture for complex multi-service workflows",
      "Mention the Saga pattern for distributed transactions (NOT 2-phase commit)",
      "Discuss compensating actions: if step 3 fails, undo steps 1 and 2 via compensating events",
    ],
    practiceQuestions: [
      { question: "How would you handle a payment failure in an order processing pipeline?", answer: "Using the Saga pattern with compensating events: (1) OrderService creates order → event: OrderCreated. (2) PaymentService attempts charge → FAILS → event: PaymentFailed. (3) OrderService receives PaymentFailed → marks order as failed → event: OrderCancelled. (4) InventoryService (if stock was already reserved) receives OrderCancelled → releases reserved stock → event: StockReleased. Each service handles its own rollback via compensating actions. No distributed transactions needed." },
    ],
    tags: ["event-driven", "choreography", "orchestration", "saga", "microservices"],
  },
  {
    id: "sd-mq-cqrs",
    chapterId: 5,
    title: "CQRS & Event Sourcing",
    order: 4,
    difficulty: "advanced",
    estimatedMinutes: 12,
    overview:
      "CQRS (Command Query Responsibility Segregation) separates read and write models. Instead of one database handling both reads and writes, you have a write-optimized store (command side) and one or more read-optimized stores (query side). Event Sourcing stores every state change as an immutable event rather than overwriting the current state. Together, CQRS + Event Sourcing provide a complete audit trail, temporal queries, and independent scaling of reads vs writes. The uncomfortable truth: CQRS is the most overused pattern in system design interviews and the most underused in actual production. 95% of applications don't need CQRS. But for the 5% that do (financial systems, audit-heavy compliance, high-read/low-write dashboards), it's absolutely the right approach. Know when to use it AND when to explicitly say 'this is overkill.'",
    keyPoints: [
      "CQRS: separate models for reads (queries) and writes (commands)",
      "Write side: optimized for data integrity and transactions (PostgreSQL, event store)",
      "Read side: optimized for query patterns — denormalized views, search indexes, caches",
      "Event Sourcing: store events, not state. Current state = replay all events from the beginning.",
      "Projections: derived read models built by replaying events (e.g., a leaderboard projection from score events)",
      "Overkill for most CRUD apps — use when audit trails, temporal queries, or extreme read/write scaling is needed",
      "HIDDEN GOTCHA — Eventual Consistency Between Read and Write Models: When a user creates an order (write side) and immediately views their orders (read side), the order might NOT appear yet. The event hasn't been projected to the read model. This is called 'read-your-writes consistency violation' and it WILL confuse users. Solutions: (1) After a write, read from the write model for that specific user for a few seconds (session-level consistency), (2) Include a version/timestamp in the write response and have the read side wait until that version is projected, (3) Use optimistic UI — show the change immediately on the client before the read model catches up. Every CQRS system must address this — don't hand-wave about eventual consistency in interviews",
      "MOST DEVS DON'T KNOW — Event Sourcing Event Store Gets Huge, and Replay Gets Slow: If your user account accumulates 10,000 events over 2 years, replaying all events to get the current state takes time. Solution: SNAPSHOTS. Periodically save the current state as a snapshot (e.g., every 100 events). To rebuild state: load latest snapshot + replay events after the snapshot. This reduces replay from 10,000 events to ~100. But snapshots add complexity: snapshot format must be versioned, snapshots must be consistent with events, and corrupted snapshots can cascade failures. Some teams create snapshots after every N events; others create them lazily on read",
      "CRITICAL — Projection Rebuild is Your Most Dangerous Operation: As your system evolves, you'll need to rebuild projections (e.g., you added a new dashboard that needs different aggregations). This means replaying ALL events through a new projector. For a system with 100M events, this can take hours. During that time, the read model is stale or incomplete. Best practice: (1) Version your projections, (2) Build new projections alongside old ones (blue/green), (3) Switch traffic to the new projection only after it's fully caught up, (4) Keep old projection running as fallback. Netflix rebuilds projections from Kafka topics — they can replay months of events to populate new read models",
      "When to Use CQRS (and When NOT To): USE: Read/write ratio is heavily skewed (100:1), read and write models are fundamentally different shapes, need regulatory audit (finance, healthcare), multiple read views from same data (dashboard, search, reports). DON'T USE: Standard CRUD apps, small teams (< 5 devs), when read/write models are similar, when you don't need an audit trail, when learning microservices (add AFTER you understand the basics)",
    ],
    deepDive: [
      {
        title: "Event Sourcing Example",
        content:
          "Traditional: UPDATE accounts SET balance = balance - 100 WHERE id = 1. You know the current balance, but not HOW it got there. Event Sourcing: store events: [AccountOpened(id=1), Deposited(500), Withdrawn(100), Deposited(200), Withdrawn(100)]. Current balance = 500 (replay). You get a full audit trail, can reconstruct state at any point in time, and can build new read models from the event log. Banks, financial trading, and compliance-heavy systems use this pattern.",
      },
      {
        title: "CQRS Architecture in Practice — The Full Picture",
        content:
          "Here's what a production CQRS system actually looks like, including the parts tutorials skip:\n\n**Write Side (Command Side)**:\n▸ Receives commands: CreateOrder, CancelOrder, UpdateAddress\n▸ Validates commands against business rules\n▸ Writes events to an Event Store (append-only database)\n▸ Publishes events to Kafka / event bus\n\n**Event Store Options**:\n▸ EventStoreDB (Greg Young's project): purpose-built, supports projections natively, great for event sourcing\n▸ PostgreSQL + outbox table: pragmatic choice, familiar ops, use JSONB for event payloads\n▸ DynamoDB: good for high-scale, natural append-only pattern\n▸ Kafka itself as event store: controversial — works with log compaction but lacks querying capabilities. Axon framework uses this approach.\n\n**Read Side (Query Side)**:\n▸ Event handlers consume events from Kafka\n▸ Build 'projections' — denormalized views optimized for specific queries\n▸ Multiple projections from the same events: order list for the dashboard, order analytics for the admin, order search for ElasticSearch\n▸ Each projection can use a different database (PostgreSQL for lists, Elasticsearch for search, Redis for hot data)\n\n**The Gap Between Theory and Reality**:\n▸ You need a reliable event bus (Kafka, not Redis Pub/Sub)\n▸ You need idempotent projectors (same event processed twice → same result)\n▸ You need a mechanism to rebuild projections from scratch (event replay)\n▸ You need monitoring: projection lag (how far behind is the read model?)\n▸ You need correlation IDs to trace a command through the write side → event → projection → query result",
        diagram: `CQRS + Event Sourcing Architecture:

  ┌─── Command Side ───┐        ┌──── Query Side ────┐
  │                     │        │                     │
  │  Command ──► Domain │   ┌───►│  Projector A → DB   │
  │              Model  │   │    │  (Order Dashboard)  │
  │                │    │   │    │                     │
  │                ▼    │   │    │  Projector B → ES   │
  │          Event Store│───┤    │  (Order Search)     │
  │          (append)   │   │    │                     │
  │                     │   │    │  Projector C → Redis│
  └─────────────────────┘   │    │  (Hot Data Cache)   │
                            │    └─────────────────────┘
                            │
                       Event Bus (Kafka)`,
      },
      {
        title: "Event Sourcing Anti-Patterns (Learn From Others' Mistakes)",
        content:
          "1. **Too Fine-Grained Events**: Events like 'FieldChanged(field=name, old=John, new=Jane)' are useless. Instead, use domain-meaningful events: 'NameCorrected(newName=Jane, reason=legal_change)'. Events should tell a story.\n\n2. **Storing Derived Data in Events**: Don't put 'currentBalance=500' in a Withdrawal event. The balance is a derived value — it should be computed by replaying events. If you store it, you create contradictions when you fix event handling bugs.\n\n3. **GDPR and Event Sourcing**: Events are immutable. But GDPR says users can request deletion of personal data. How do you delete data from an immutable log? Options: (a) Crypto-shredding — encrypt personal data in events with a per-user key. To 'delete,' destroy the key. Events remain but personal data is unreadable. (b) Tombstone events — publish a 'UserDataPurged' event that projectors use to clear personal data from read models. The event stream still contains the original events, but they reference encrypted/deleted data.\n\n4. **'Let's Event Source Everything!'**: Event sourcing adds significant complexity: snapshot management, projection rebuilds, schema evolution, debugging difficulty (can't just look at a row in the DB). Use it surgically — event source the domain aggregates that benefit from it (accounts, orders, audit-sensitive entities), not your entire system.",
      },
    ],
    realWorldExamples: [
      { company: "Event Store (Greg Young)", description: "The canonical event sourcing database. Stores streams of events, supports projections, and enables temporal queries ('what was the state at 3pm yesterday?')." },
      { company: "Banking Systems", description: "Ledgers are inherently event-sourced: every transaction is recorded as an immutable event. The 'balance' is a derived value (projection) computed from the transaction history." },
    ],
    tradeOffs: [
      { optionA: "CQRS + Event Sourcing", optionB: "Traditional CRUD", comparison: "CQRS+ES: full audit trail, temporal queries, independent scaling, extreme complexity, eventual consistency between read/write models. CRUD: simple, well-understood, harder to audit, single model for reads and writes." },
    ],
    interviewTips: [
      "Don't propose CQRS for a simple app — mention it only when the problem demands it",
      "Good signals: 'we need an audit trail', 'read and write patterns are very different', 'we need to scale reads and writes independently'",
      "Event Sourcing is great for financial systems, gaming, and compliance-heavy domains",
    ],
    practiceQuestions: [
      { question: "When would CQRS be overkill?", answer: "For simple CRUD apps where read and write models are similar (blog posts, basic user profiles), where you don't need an audit trail, where traffic is moderate (single DB handles both reads and writes fine), and where the team is small (CQRS adds operational complexity). CQRS shines when: read patterns differ significantly from write patterns (e.g., writes are events, reads are aggregated dashboards), you need independent scaling, or regulatory requirements demand a complete audit trail." },
    ],
    tags: ["cqrs", "event-sourcing", "audit-trail", "projections", "temporal-queries"],
  },
  {
    id: "sd-mq-idempotency",
    chapterId: 5,
    title: "Idempotency & Exactly-Once Processing",
    order: 5,
    difficulty: "intermediate",
    estimatedMinutes: 10,
    overview:
      "In distributed systems, messages can be delivered more than once (network retries, consumer crashes). An idempotent operation produces the same result whether executed once or multiple times. Designing idempotent consumers is the practical solution to the at-least-once delivery guarantee that most message systems provide. Without idempotency, a user could be charged twice, an email sent twice, or inventory decremented twice. Here's the fundamental insight: 'Exactly-once delivery' is a marketing myth in distributed systems. What actually exists is 'at-least-once delivery + idempotent processing = effectively-once execution.' Every system that claims 'exactly-once' (including Kafka's exactly-once semantics) is actually using idempotent writes behind the scenes. Once you internalize this, you stop chasing the impossible and start building robust systems.",
    keyPoints: [
      "Idempotent: f(x) = f(f(x)) — executing the operation again doesn't change the result",
      "Natural idempotency: SET balance = 500 (always results in 500, regardless of how many times executed)",
      "Not idempotent: UPDATE balance = balance - 100 (each execution reduces by another 100)",
      "Idempotency key: a unique ID per request — store processed IDs to detect duplicates",
      "Database-level: UPSERT / INSERT ... ON CONFLICT DO NOTHING — naturally idempotent",
      "API-level: clients send an Idempotency-Key header; server deduplicates using this key",
      "HIDDEN GOTCHA — The Idempotency Key Storage Race Condition: Two identical messages arrive at the same time (two consumers, or network duplicate). Both check the processed_events table — neither finds the ID — both process the message. You've just double-charged the customer. Solution: use a UNIQUE CONSTRAINT on the idempotency key column. The first INSERT succeeds. The second INSERT fails with a constraint violation. Catch the constraint violation and treat it as 'already processed.' Check-then-insert is NOT safe. Insert-and-catch-conflict IS safe. The database enforces uniqueness atomically",
      "MOST DEVS DON'T KNOW — Idempotency Has Layers: You need idempotency at EVERY layer: (1) API layer: Idempotency-Key header (client → server), (2) Message consumer: deduplicate before processing (event_id in processed table), (3) Database writes: UPSERT or INSERT ON CONFLICT, (4) External API calls: what if you call Stripe and the response times out? Did the charge go through? Use Stripe's Idempotency-Key on YOUR outgoing call too. The chain of idempotency must be unbroken from client to the deepest external dependency",
      "CRITICAL — The 'Idempotency Window' Problem: You store processed message IDs to detect duplicates, but you can't store them forever (table grows infinitely). So you set a TTL: delete IDs older than 24 hours. But what if a message is retried AFTER 24 hours? (Stuck in DLQ, then replayed.) The duplicate won't be detected. Solutions: (1) Make the TTL longer than the maximum possible retry window (e.g., 7 days), (2) Use natural idempotency where possible (SET balance = X instead of INCREMENT balance BY Y), (3) Accept that nothing is perfect — design for detection and correction, not just prevention",
      "Stripe's Idempotency Implementation (The Gold Standard): (1) Client sends POST /v1/charges with 'Idempotency-Key: req_123'. (2) Stripe checks: have I seen req_123 before? If yes → return the stored result (same status code, same body). If no → process the charge, store the result keyed by req_123. (3) Keys expire after 24 hours. (4) Stripe stores the key BEFORE processing — so if processing crashes, the key exists but has no result. On retry, Stripe detects the in-progress state and waits. This prevents both double-processing AND race conditions",
    ],
    deepDive: [
      {
        title: "Implementing Idempotent Consumers",
        content:
          "For each message, extract or generate a unique ID (e.g., event_id). Before processing, check a 'processed_events' table. If the ID exists, skip (already processed). If not, process the message and record the ID — both in a single database transaction. This ensures: even if the message is delivered 5 times, the side effect happens exactly once. The processed_events table has a TTL to avoid growing forever.",
        diagram: `Idempotent Consumer:

  Message: {id: "evt-123", action: "charge $10"}
  
  1. Check: SELECT 1 FROM processed WHERE id = 'evt-123'
  2. Found? → Skip (already processed)
  3. Not found? →
     BEGIN TRANSACTION
       Process charge ($10)
       INSERT INTO processed (id) VALUES ('evt-123')
     COMMIT`,
      },
      {
        title: "Natural vs Artificial Idempotency — Choose Wisely",
        content:
          "There are two approaches to idempotency, and one is dramatically simpler:\n\n**Natural Idempotency** — Design the operation itself to be idempotent:\n▸ SET user.email = 'new@example.com' (always produces the same state)\n▸ UPSERT order SET status = 'SHIPPED' WHERE id = 'order-123'\n▸ PUT /resources/{id} replaces the entire resource (same PUT twice = same result)\n▸ DELETE /resources/{id} (deleting twice = resource is still deleted)\n\n**Artificial Idempotency** — Track processed IDs to handle non-idempotent operations:\n▸ Debit $10 from account (inherently not idempotent — each execution deducts $10)\n▸ Send notification email (sending twice = user annoyed)\n▸ Increment page view counter (each execution adds 1)\n\nThe key insight: **restructure operations to be naturally idempotent whenever possible**. Instead of 'deduct $10,' use 'set balance to $490 for transaction txn_123.' Instead of 'increment counter,' use 'record that user_123 viewed page_456 at timestamp_789.' Natural idempotency doesn't need a processed_events table, doesn't have TTL problems, and doesn't have race conditions.\n\nOnly use artificial idempotency (processed_events table) when you truly can't restructure the operation — typically when calling external APIs with side effects (sending an email, charging a credit card, dispatching a shipment).",
      },
      {
        title: "The 'Exactly-Once' Myth — What Kafka Really Does",
        content:
          "Kafka claims 'exactly-once semantics' (EOS). Let's demystify what this actually means:\n\n**Kafka EOS = Idempotent Producer + Transactions**\n\n1. **Idempotent Producer** (enable.idempotence=true): Kafka assigns a sequence number to each message from each producer. If the broker receives a duplicate (same producer + same sequence number), it silently drops it. This prevents producer retries from creating duplicates. But this is ONLY within Kafka — it doesn't prevent YOUR consumer from processing a message twice.\n\n2. **Kafka Transactions**: A producer can group multiple writes across multiple partitions into an atomic transaction. Either all writes happen or none. Combined with consumer isolation (read_committed), consumers only see committed messages. This enables read-process-write loops within Kafka.\n\n**Where EOS breaks down**: The second your consumer has a side effect OUTSIDE Kafka (write to PostgreSQL, call HTTP API, send email), you're back to at-least-once + idempotency. Kafka can guarantee exactly-once for Kafka-to-Kafka operations (stream processing within KStreams). The moment you leave the Kafka ecosystem, it's at-least-once.\n\n**The honest truth for interviews**: 'Exactly-once is achievable within Kafka's ecosystem using idempotent producers and transactions. For end-to-end exactly-once across services, we use at-least-once delivery with idempotent consumers — which achieves effectively-once processing.'",
      },
    ],
    realWorldExamples: [
      { company: "Stripe", description: "Every API endpoint accepts an Idempotency-Key header. If you retry a payment with the same key, Stripe returns the original response without charging again. Keys are stored for 24 hours." },
    ],
    tradeOffs: [
      { optionA: "Idempotent design", optionB: "Exactly-once delivery", comparison: "Idempotent design: practical, works with any message system, requires application logic. Exactly-once delivery: theoretical ideal, extremely hard to achieve across system boundaries, Kafka achieves it only within its own ecosystem." },
    ],
    interviewTips: [
      "Always mention idempotency when discussing message queues or payment systems",
      "The Stripe Idempotency-Key pattern is the gold standard example",
      "Combine with database transactions for bulletproof deduplication",
    ],
    practiceQuestions: [
      { question: "A payment message is delivered twice. How do you prevent double-charging?", answer: "Each payment request includes a unique idempotency key (e.g., order_id + payment_attempt). Before processing: check if this key exists in a 'processed_payments' table. If yes, return the stored result (idempotent response). If no, process the payment and store the key + result in a single database transaction. This guarantees exactly-once processing even with at-least-once message delivery. Set a TTL on the processed_payments table (24-48 hours) to prevent indefinite growth." },
    ],
    tags: ["idempotency", "exactly-once", "deduplication", "distributed-systems", "payment"],
  },
];
