import { SDTopic } from "../types";

export const storageTopics: SDTopic[] = [
  {
    id: "sd-store-object-storage",
    chapterId: 7,
    title: "Object & Blob Storage",
    order: 1,
    difficulty: "beginner",
    estimatedMinutes: 10,
    overview:
      "Object storage (like AWS S3) stores unstructured data as objects — files, images, videos, backups, logs. Each object has a unique key, the data itself, and metadata. Unlike file systems (hierarchical directories) or block storage (raw disk sectors), object storage is flat, infinitely scalable, and highly durable (11 9's of durability for S3 = 99.999999999%). It's the default for any system that handles user-uploaded content, static assets, or large-scale data. The insight that changes how you think about storage: S3 is not a file system. It's an HTTP-accessible key-value store where values happen to be large binary blobs. There are no directories — 'users/123/avatar.jpg' is a SINGLE KEY, not a path with nested folders. S3's 'folder view' in the AWS console is an illusion created by filtering keys that share a prefix. Once you understand this, S3's API design, performance patterns, and pricing all make sense.",
    keyPoints: [
      "S3-compatible APIs are the industry standard (AWS S3, GCS, MinIO, Cloudflare R2)",
      "Objects are immutable — you can't modify a byte range, only replace the entire object",
      "Flat namespace with key-based access — 'users/123/avatar.jpg' is a key, not a directory path",
      "Storage classes: hot (frequent access, standard), warm (infrequent, cheaper), cold (archive, cheapest)",
      "Pre-signed URLs: temporary authenticated URLs for direct upload/download from client to storage",
      "Lifecycle policies: auto-transition objects from hot to cold storage, auto-delete after N days",
      "HIDDEN GOTCHA — S3 Key Design Affects Performance: Before 2018, S3 had a well-known performance bottleneck: keys with the same prefix (e.g., all starting with '2024-01-15/') were routed to the same partition, limiting throughput to ~3,500 PUT/5,500 GET per second per prefix. AWS fixed this by automatically distributing keys across partitions. BUT — if you're using S3-compatible storage (MinIO, Ceph), this problem still exists! Also, S3 LIST operations are still slow and expensive (1,000 objects per page, sequential). If you need to list millions of objects regularly, maintain a metadata index in DynamoDB or PostgreSQL instead of listing from S3",
      "MOST DEVS DON'T KNOW — The True Cost of S3: Storage cost per GB is cheap ($0.023/GB/month for Standard). But the HIDDEN costs add up: (1) PUT/POST requests: $5 per million. If you write 100M small objects/month = $500. (2) GET requests: $0.40 per million. A CDN origin-pull pattern can save 90% of GET costs. (3) Data transfer OUT: $0.09/GB after the first 100GB. If you serve 10TB/month directly from S3 = $900. CDN (CloudFront) is cheaper for egress! (4) Cross-region replication: storage + transfer costs are doubled. The lesson: S3 is cheapest when used as a write-once, read-via-CDN system. Direct access at high volume is expensive",
      "CRITICAL — Multipart Upload is Mandatory for Large Files: S3 single-object PUT has a 5GB limit. For files > 100MB, use multipart upload: split the file into parts (5MB-5GB each), upload parts in parallel, then complete the upload. Benefits: (1) Parallel upload is 3-5x faster, (2) If one part fails, retry ONLY that part, (3) You can upload parts from different machines. AWS SDK does this automatically for files > configurable threshold. WARNING: incomplete multipart uploads consume storage and you're charged for the parts! Set a lifecycle policy to abort incomplete multipart uploads after 7 days",
    ],
    deepDive: [
      {
        title: "Direct Upload Pattern",
        content:
          "Instead of: Client → Your Server → S3 (double bandwidth), use: (1) Client requests an upload URL from your server. (2) Server generates a pre-signed S3 PUT URL (valid for 15 minutes). (3) Client uploads directly to S3 using the pre-signed URL. (4) S3 triggers a notification (Lambda/SQS) that your server processes (resize image, scan for malware, etc.). This eliminates your server as a bottleneck for large file uploads.",
        diagram: `Direct Upload with Pre-signed URLs:

  1. Client ──► Your Server: "I want to upload"
  2. Server ──► Client: pre-signed S3 URL (15 min)
  3. Client ──► S3: PUT file directly
  4. S3 ──► Lambda/SQS: "new file uploaded"
  5. Lambda ──► Process file (resize, scan, etc.)`,
      },
      {
        title: "S3 Consistency Model — It Changed and Most Tutorials Are Outdated",
        content:
          "For YEARS, S3 had eventual consistency: after a PUT, a subsequent GET might return the old version or 404. This caused countless bugs (upload file, read file, get nothing). In December 2020, AWS made S3 STRONGLY CONSISTENT for all operations — no extra cost, no configuration. After a successful PUT, any subsequent GET returns the new version. After a DELETE, any subsequent GET returns 404.\n\nWhy this matters: Many existing architectures include workarounds for S3's old eventual consistency (e.g., writing to DynamoDB first, then S3, then reading from DynamoDB to check if S3 write landed). These workarounds are now unnecessary but still exist in many codebases.\n\nThe exception: S3 bucket listing is still eventually consistent when listing objects across multiple partitions. If you put an object and immediately list the bucket, the new object might not appear. For workflows that depend on listing, use an external index.\n\nGoogle Cloud Storage (GCS) has always been strongly consistent. Azure Blob Storage is strongly consistent. The S3 eventual consistency era created an entire class of distributed systems problems that no longer exist.",
      },
      {
        title: "Storage Tiers — Building a Cost-Optimized Pipeline",
        content:
          "A single piece of content goes through different access patterns over its lifetime:\n\n▸ **Day 1-7**: Uploaded, processed, frequently accessed. Storage: S3 Standard ($0.023/GB).\n▸ **Day 7-90**: Occasionally accessed (user views old photos). Storage: S3 Infrequent Access ($0.0125/GB) — 46% cheaper. Higher per-request cost.\n▸ **Day 90-365**: Rarely accessed but must be available. Storage: S3 Glacier Instant Retrieval ($0.004/GB) — 82% cheaper. Request cost higher.\n▸ **After 1 year**: Compliance/legal hold. Storage: S3 Glacier Deep Archive ($0.00099/GB) — 95% cheaper. 12-48 hour retrieval time.\n\nAutomate with S3 Lifecycle Policies:\n```\nTransition to IA after 30 days\nTransition to Glacier after 90 days\nTransition to Deep Archive after 365 days\nDelete after 7 years (compliance requirement)\n```\n\nReal impact: A 100TB dataset costs $2,300/month in Standard. With lifecycle policies and proper tiering, the effective cost drops to ~$500/month after 6 months as old data migrates to cheaper tiers.",
      },
    ],
    realWorldExamples: [
      { company: "Dropbox", description: "Migrated from S3 to their own object storage (Magic Pocket) to save costs at petabyte scale. At smaller scale, S3 is the right choice — Dropbox built custom storage because their entire business IS storage." },
      { company: "Netflix", description: "Stores every video master and all transcoded versions in S3. Petabytes of content. S3's durability guarantee means they never lose a movie file. Content is served from their Open Connect CDN, not directly from S3." },
    ],
    tradeOffs: [
      { optionA: "Object Storage (S3)", optionB: "File System (EFS/NFS)", comparison: "Object Storage: infinite scale, 11 9's durability, high latency per object, no partial updates. File System: low latency, POSIX compatible, supports random access, limited scale, more expensive per GB." },
    ],
    interviewTips: [
      "Use object storage for any user-uploaded content (images, videos, documents)",
      "Always mention pre-signed URLs for direct client-to-storage uploads",
      "Discuss storage classes for cost optimization",
    ],
    practiceQuestions: [
      { question: "How would you store and serve user profile images at scale?", answer: "Upload: client gets a pre-signed S3 URL, uploads directly to S3. On upload, a Lambda function triggers: resize to 3 sizes (thumbnail, medium, original), store all in S3 with predictable keys (users/{id}/avatar_{size}.jpg). Serve: put CloudFront (CDN) in front of S3. Images are cached at edge locations globally. Cache-Control: max-age=31536000 (1 year) with versioned S3 keys. When a user updates their avatar, the key changes, busting the cache. Cost: S3 Standard for recent, S3 Infrequent Access for old versions." },
    ],
    tags: ["object-storage", "s3", "blob", "pre-signed-url", "cdn"],
  },
  {
    id: "sd-store-data-pipelines",
    chapterId: 7,
    title: "Batch vs Stream Processing",
    order: 2,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "Batch processing handles large volumes of data at scheduled intervals (nightly, hourly). Stream processing handles data in real-time as events arrive. Batch: high throughput, high latency — MapReduce, Spark, data warehousing. Stream: lower throughput, low latency — Kafka Streams, Flink, real-time dashboards. Most data platforms use both: stream for real-time insights, batch for heavy computation and backfilling. The key insight most tutorials miss: batch and stream are not competing approaches — they solve different problems. Batch asks 'what happened yesterday?' Stream asks 'what's happening right now?' Almost every production data platform needs BOTH. The question isn't 'batch or stream?' but 'which workloads need real-time and which can tolerate delay?' Netflix uses stream for real-time recommendations and batch for monthly billing. Both are correct for their use case.",
    keyPoints: [
      "Batch: process accumulated data periodically. ETL jobs, report generation, ML model training.",
      "Stream: process each event as it arrives. Real-time alerts, live dashboards, fraud detection.",
      "Lambda Architecture: batch layer (accurate) + speed layer (real-time) + serving layer (merged view).",
      "Kappa Architecture: single stream processing pipeline for both real-time and batch (simpler).",
      "Batch frameworks: MapReduce, Apache Spark, dbt, Airflow.",
      "Stream frameworks: Kafka Streams, Apache Flink, Spark Streaming.",
      "HIDDEN GOTCHA — Late-Arriving Data Destroys Stream Processing: In the real world, events don't arrive in order. A mobile app sends a 'page_view' event, but the user is on a subway with no signal. The event arrives 2 hours late. Your stream processor already computed 'page views in the 3pm window' and emitted the result. Now what? Options: (1) Watermarks (Flink/Beam): declare 'I'll wait up to N minutes for late data, then close the window.' Events after the watermark are either dropped or sent to a late-data side output. (2) Allowed lateness: keep windows open for late arrivals and emit updated results (but downstream must handle retractions). (3) Hybrid: stream processes real-time data approximately, then a nightly batch job re-computes exact numbers from the complete dataset. This is why Lambda Architecture exists — stream gives you 'good enough now,' batch gives you 'correct later'",
      "MOST DEVS DON'T KNOW — Apache Flink vs Kafka Streams: These are NOT the same thing. Kafka Streams is a LIBRARY that you embed in your Java/Kotlin application — no separate cluster needed. It reads from Kafka, processes, writes to Kafka. Simple to deploy (just deploy your app), limited to Kafka ecosystem. Apache Flink is a CLUSTER — a separate distributed system with job managers, task managers, state management, and savepoints. It can read from Kafka, files, databases, sockets. Much more powerful (complex event processing, exactly-once, millisecond latency) but much more operational overhead. Decision shortcut: if your data is in Kafka and your processing is straightforward → Kafka Streams. If you need complex processing, time windows, exactly-once, or non-Kafka sources → Flink",
      "CRITICAL — The ETL to ELT Revolution: Traditional ETL (Extract, Transform, Load): extract data from sources, transform it on an ETL server, load into the warehouse. This requires an expensive, complex ETL tool (Informatica, Talend). Modern ELT (Extract, Load, Transform): extract raw data, load it directly into the warehouse (BigQuery, Snowflake), then transform inside the warehouse using SQL (dbt). Why? Modern warehouses have massive compute power — it's cheaper to transform data inside the warehouse than on a separate server. dbt (data build tool) is the poster child — you write SQL SELECT statements, dbt manages dependencies, testing, and documentation. This is the modern data stack",
    ],
    deepDive: [
      {
        title: "Lambda Architecture",
        content:
          "Two parallel processing paths: (1) Batch Layer: processes ALL historical data periodically (hourly/daily). Produces accurate, complete batch views. Slow but correct. (2) Speed Layer: processes only recent events in real-time. Produces approximate real-time views. Fast but may have gaps. (3) Serving Layer: merges batch and speed layer views to serve queries. When a new batch view is ready, it replaces the speed layer data for that time range.",
        diagram: `Lambda Architecture:

  Data Source ──┬──► [Batch Layer]     ──► Batch Views
                │    (Spark, 1hr cycle)         │
                │                                ├──► [Serving Layer] ──► Query
                │                                │
                └──► [Speed Layer]     ──► Real-time Views
                     (Kafka Streams)`,
      },
      {
        title: "Building a Real Data Pipeline — The Practical Architecture",
        content:
          "Tutorials show simple pipelines. Production data pipelines are messy. Here's what a real one looks like:\n\n**Source → Ingestion → Lake → Warehouse → BI**\n\n1. **Sources**: Production database (PostgreSQL), third-party APIs (Stripe, Salesforce), application events (Kafka), files (CSV uploads).\n\n2. **Ingestion**: CDC (Debezium) for database changes → Kafka. API connectors (Fivetran, Airbyte) for third-party data → warehouse directly. Application events already in Kafka.\n\n3. **Data Lake (S3/GCS)**: Raw data lands here in Parquet format. Partitioned by date. This is your 'source of truth' — never delete raw data.\n\n4. **Transformation (dbt)**: SQL-based transformations run inside the warehouse. Staging models clean raw data. Mart models produce business-ready tables (revenue_by_day, active_users_by_region). dbt runs tests (not_null, unique, relationships) to catch data quality issues.\n\n5. **Data Warehouse (BigQuery/Snowflake)**: Analysts and BI tools query here. Organized into raw (untouched), staging (cleaned), and mart (business-ready) layers.\n\n6. **BI (Metabase/Looker/Tableau)**: Dashboards, reports, ad-hoc analysis.\n\n7. **Orchestration (Airflow/Dagster)**: Schedules everything. 'At 6am: run Fivetran sync, wait 30 min, run dbt models, send Slack notification when done.'\n\nThe key insight: this entire pipeline is IDEMPOTENT. If any step fails, re-run it from the beginning. Raw data is immutable, transformations are deterministic, and the warehouse is overwritten (not appended). This makes data pipelines debuggable and reliable.",
      },
    ],
    realWorldExamples: [
      { company: "Spotify", description: "Uses batch processing (daily Spark jobs) for Discover Weekly playlist generation — needs to process all user listening history. Uses stream processing (real-time) for Spotify Wrapped real-time stats and live listening activity." },
      { company: "Uber", description: "Real-time ride matching and surge pricing use stream processing (Apache Flink). Historical analytics, driver payments, and financial reconciliation use batch processing (Apache Spark)." },
    ],
    tradeOffs: [
      { optionA: "Batch Processing", optionB: "Stream Processing", comparison: "Batch: higher throughput, easier to reason about (full dataset), higher latency (results delayed). Stream: real-time results, lower throughput, harder to handle late/out-of-order data, more complex exactly-once semantics." },
    ],
    interviewTips: [
      "Discuss whether the use case needs real-time data or if hourly/daily batch is acceptable",
      "Lambda architecture is a common answer for systems needing both accuracy and real-time",
      "Mention specific tools: Spark for batch, Flink for stream, Kafka as the event bus",
    ],
    practiceQuestions: [
      { question: "You need to detect fraudulent transactions within 5 seconds. Batch or stream?", answer: "Stream processing — 5-second latency rules out batch. Use Apache Flink or Kafka Streams. Each transaction event flows through a pipeline that: (1) enriches with user profile data (cache lookup), (2) applies rule-based checks (amount > $10K, unusual location), (3) runs ML model for anomaly scoring, (4) if fraud score > threshold → block transaction and alert. The model itself is trained in batch (daily Spark jobs) but applied in real-time. Stream handles detection, batch handles model training." },
    ],
    tags: ["batch-processing", "stream-processing", "lambda-architecture", "spark", "flink"],
  },
  {
    id: "sd-store-data-warehouse",
    chapterId: 7,
    title: "Data Warehouse & Data Lake",
    order: 3,
    difficulty: "intermediate",
    estimatedMinutes: 10,
    overview:
      "A data warehouse (Snowflake, BigQuery, Redshift) stores structured, processed data optimized for analytical queries (OLAP). A data lake (S3 + Spark, Databricks) stores raw data in any format (structured, semi-structured, unstructured) at massive scale. Data lakes store everything cheaply; data warehouses provide fast query performance on curated data. The modern data stack: sources → ingestion → data lake → transformation (dbt) → data warehouse → BI tools. Here's the evolution that simplifies things: for years, you had to choose between a data lake (cheap, messy, slow queries) and a data warehouse (expensive, structured, fast queries). The DATA LAKEHOUSE (Delta Lake, Apache Iceberg, Apache Hudi) combines both: S3-stored files with warehouse-like performance. Databricks, Snowflake, and BigQuery all now support lakehouse patterns. The future is: store in S3 (cheap), query like a warehouse (fast).",
    keyPoints: [
      "OLTP (Online Transaction Processing): row-stored, optimized for reads/writes (PostgreSQL, MySQL)",
      "OLAP (Online Analytical Processing): column-stored, optimized for aggregation queries (BigQuery, Snowflake)",
      "Column storage: stores each column together, enabling massive compression and fast aggregations",
      "Data Lake: raw data dump in S3/GCS, schemaless, cheap storage, requires processing to query",
      "Data Warehouse: structured, schema-enforced, fast queries, more expensive storage",
      "Data Lakehouse: combines both — structured queries on data lake (Delta Lake, Iceberg tables on S3)",
      "HIDDEN GOTCHA — The 'Data Swamp' Anti-Pattern: A data lake becomes a data swamp when: (1) No metadata catalog — nobody knows what data exists, what format it's in, or when it was last updated, (2) No schema enforcement — producers change formats without notice, breaking downstream consumers, (3) No retention policy — data accumulates forever, storage costs grow, and most data is never accessed. Fix: Use a data catalog (AWS Glue Catalog, Apache Hive Metastore), enforce schemas at write time (Schema Registry, Iceberg), and set retention policies. The companies that get the most value from data lakes treat them as managed assets, not dumpsters",
      "MOST DEVS DON'T KNOW — BigQuery vs Snowflake vs Redshift: They're NOT interchangeable. BigQuery: serverless, pay per query ($5 per TB scanned), zero infrastructure management, great for unpredictable/bursty workloads. Start here if you're on GCP. Snowflake: separate storage and compute, multiple 'virtual warehouses' can query the same data, cross-cloud (AWS/GCP/Azure). Best for multi-cloud or heavy concurrent access. Redshift: tightly coupled with AWS, provisioned clusters (not serverless — Serverless option now exists but expensive), best when you need tight integration with other AWS services. The real differentiator: cost model. BigQuery charges per query — cheap for few big queries, expensive for many small queries. Snowflake charges per compute-second — predictable but you pay even when queries are efficient. Know your query pattern before choosing",
      "CRITICAL — Never Query Your Production Database for Analytics: This is the #1 architecture mistake startups make. Running a 'SELECT COUNT(*) FROM orders WHERE date > ...' on your production PostgreSQL during peak hours will: (1) Lock rows or tables, slowing user-facing writes, (2) Consume CPU and memory, degrading API response times, (3) Potentially cause an outage if the query is expensive. The minimum viable analytics setup: create a read replica of your production DB, point your BI tool at the replica. Better: CDC (Debezium) → Kafka → data warehouse. Best: full modern data stack with dbt transformations. The cost of a read replica ($100/month) is infinitely less than the cost of a production outage",
    ],
    deepDive: [
      {
        title: "Columnar Storage for Analytics",
        content:
          "Row storage: each row stored together [id, name, age, salary]. To compute AVG(salary), you read entire rows. Column storage: each column stored together [all salaries]. To compute AVG(salary), you read ONLY the salary column. With 100 columns, you read 1% of the data. Plus, same-type values compress extremely well: 1M salary values compress 10-100x. This is why data warehouses are columnar — analytical queries typically touch few columns but many rows.",
        diagram: `Row vs Column Storage:

  Row Storage (OLTP):          Column Storage (OLAP):
  [id, name, age, salary]      [id]:     [1, 2, 3, 4, ...]
  [id, name, age, salary]      [name]:   [Alice, Bob, ...]
  [id, name, age, salary]      [age]:    [28, 35, 42, ...]
  [id, name, age, salary]      [salary]: [90K, 110K, 85K, ...]
  
  Read one row → fast           Read one column → fast
  Scan column → slow            Scan column → fast (10-100x)`,
      },
      {
        title: "Apache Iceberg / Delta Lake — The Lakehouse Revolution",
        content:
          "Traditional data lake files (Parquet/ORC on S3) are just files — no ACID transactions, no schema evolution, no time travel. Apache Iceberg and Delta Lake add a METADATA LAYER on top of S3 files that provides:\n\n**1. ACID Transactions**: Multiple writers can update the same table concurrently without corruption. Before Iceberg, two Spark jobs writing to the same S3 path would corrupt data.\n\n**2. Schema Evolution**: Add, rename, or reorder columns without rewriting data files. The metadata tracks schema versions.\n\n**3. Time Travel**: Query data as it existed at any point in time. 'SELECT * FROM orders TIMESTAMP AS OF 2024-01-01'. This is incredible for debugging — 'what did this table look like before the bad ETL job corrupted it?'\n\n**4. Partition Evolution**: Change partition scheme without rewriting data. Start with daily partitions, evolve to hourly when data grows. Iceberg handles reads across both partition schemes.\n\n**5. Hidden Partitioning**: Define partitions on column TRANSFORMS (e.g., month(event_date)), not raw values. Queries are automatically pruned to the right partitions without users knowing the partition scheme.\n\nWhy this matters: Iceberg + Spark + S3 gives you 80% of Snowflake's capabilities at 20% of the cost. That's why Snowflake, BigQuery, and AWS all now support Iceberg tables — it's become the standard open table format.\n\nThe decision: if you want ZERO ops overhead → Snowflake/BigQuery (managed). If you want cost control and open formats → Iceberg on Spark/Trino + S3.",
      },
    ],
    realWorldExamples: [
      { company: "Pinterest", description: "Uses a data lakehouse: raw event data lands in S3 (data lake), dbt transforms it into structured tables (stored as Delta Lake on S3), and analysts query via Spark SQL or Trino. Combines cheap storage with fast, structured queries." },
    ],
    tradeOffs: [
      { optionA: "Data Warehouse (Snowflake)", optionB: "Data Lake (S3 + Spark)", comparison: "Warehouse: fast queries, managed infrastructure, schema enforcement, expensive at petabyte scale. Data Lake: cheap storage, any format, flexible, slower queries, more engineering effort." },
    ],
    interviewTips: [
      "Distinguish OLTP from OLAP when discussing database choices",
      "For analytics features, always mention a separate analytics store (don't query the production DB)",
      "The modern data stack (sources → ingestion → lake → dbt → warehouse → BI) is the standard answer",
    ],
    practiceQuestions: [
      { question: "Your CEO wants a real-time analytics dashboard from your production data. How?", answer: "NEVER run analytical queries on the production OLTP database — it will degrade user-facing performance. Solution: (1) CDC (Change Data Capture) from production PostgreSQL to Kafka. (2) Real-time stream processing loads into a data warehouse (BigQuery) or a specialized OLAP store (ClickHouse). (3) Dashboard tool (Metabase, Looker) queries BigQuery. For truly real-time metrics (last 5 minutes), use a pre-aggregation layer like Materialized Views or a time-series DB (TimescaleDB). Keep production DB isolated." },
    ],
    tags: ["data-warehouse", "data-lake", "olap", "columnar", "analytics"],
  },
  {
    id: "sd-store-distributed-fs",
    chapterId: 7,
    title: "Distributed Systems Concepts",
    order: 4,
    difficulty: "advanced",
    estimatedMinutes: 12,
    overview:
      "Distributed systems run on multiple machines that communicate over a network. Key challenges: partial failures (some nodes fail while others work), network unreliability (messages can be lost, delayed, or reordered), clock skew (no global clock), and consensus (getting nodes to agree). Understanding these fundamentals explains WHY distributed systems are hard and HOW solutions like Raft, Paxos, and leader election work. The fundamental lesson that every distributed systems engineer learns the hard way: distributed systems fail in ways that are IMPOSSIBLE in single-machine systems. On one machine, a function either returns or the machine crashes. In distributed systems, you call another service and get... nothing. Did it process your request and crash before responding? Did the network eat the response? Is it still processing? You literally cannot tell. This 'unknown failure' state is the root cause of almost every distributed systems bug — duplicates, lost data, split brains, and inconsistency.",
    keyPoints: [
      "The Eight Fallacies of Distributed Computing: the network is NOT reliable, latency is NOT zero, bandwidth is NOT infinite",
      "Split brain: network partition causes two nodes to both think they're the leader → data corruption",
      "Consensus algorithms: Raft, Paxos — getting a majority of nodes to agree on a value",
      "Leader election: selecting one node to coordinate writes (prevents split brain)",
      "Vector clocks: logical timestamps that track causal ordering across nodes",
      "Heartbeats: periodic signals to detect node failures (if no heartbeat in N seconds → assume dead)",
      "HIDDEN GOTCHA — Clock Skew Breaks Everything You Assume: You cannot use system time to order events across machines. Machine A's clock says 10:00:00.000, Machine B's clock says 10:00:00.050 — but B's event actually happened BEFORE A's. NTP (time sync) only guarantees accuracy to 1-10ms between machines, and during NTP sync adjustments, time can JUMP BACKWARDS. Google solved this with TrueTime (atomic clocks + GPS in every datacenter) giving ~7ms guaranteed uncertainty. Spanner waits out the uncertainty before committing. For everyone else: use LOGICAL CLOCKS (Lamport timestamps, vector clocks) instead of wall-clock time. Or use a centralized timestamp oracle (like TiDB's TSO). NEVER use System.currentTimeMillis() to order events in a distributed system",
      "MOST DEVS DON'T KNOW — The Two Generals Problem is Unsolvable: Two generals need to coordinate an attack. They communicate via messengers through enemy territory (unreliable channel). General A sends 'attack at dawn.' Did General B receive it? General A doesn't know. General B sends an acknowledgment. Did General A receive it? General B doesn't know. This is PROVABLY UNSOLVABLE — no number of acknowledgments can guarantee both sides know the other agrees. This is why you can NEVER achieve 100% reliable coordination over an unreliable network. Every distributed protocol is a trade-off between safety and liveness. TCP 'solves' this with timeouts and retries — but that's not a solution, it's acceptance of imperfection. Understanding this impossibility result changes how you think about all distributed systems",
      "CRITICAL — The Difference Between Failures Most Engineers Ignore: There are THREE types of failures, and your system design depends on which ones you're handling: (1) Crash failures: a node stops responding forever (server dies). Detected by heartbeat timeout. Handled by Raft/Paxos. (2) Omission failures: a node sometimes doesn't send/receive messages (network drops). Harder to detect. Handled by retries with timeouts. (3) Byzantine failures: a node sends wrong/malicious data (compromised server, corruption). Requires 3f+1 nodes (to tolerate f failures). Blockchain uses this. Most internal systems only handle crash and omission failures. Byzantine fault tolerance is only needed for trustless environments (blockchain, multi-party computation)",
      "The FLP Impossibility Theorem: In an asynchronous distributed system (no timing guarantees), it's IMPOSSIBLE to have a consensus protocol that is guaranteed to terminate AND be correct AND tolerate even ONE crash failure. Raft/Paxos work in practice because they make timing assumptions (partially synchronous model — messages are eventually delivered). This is why consensus algorithms have election TIMEOUTS. In a purely asynchronous network (where messages could be delayed forever), consensus is theoretically impossible. This is academic but important: it explains why all practical distributed systems eventually rely on timeouts, and why you can't build a 'perfect' distributed system",
    ],
    deepDive: [
      {
        title: "The Raft Consensus Algorithm",
        content:
          "Raft elects a leader among N nodes (typically 3 or 5). All writes go through the leader. The leader replicates writes to followers. A write is committed when a majority (N/2 + 1) acknowledges it. If the leader fails, followers hold an election and a new leader is chosen (within seconds). This ensures: (1) no split brain (only one leader at a time), (2) committed writes survive minority failures, (3) the system is available as long as a majority of nodes are alive.",
        diagram: `Raft Consensus (N=3):

  Client ──write──► [Leader]
                       │ replicate
                  ┌────┼────┐
                  ▼         ▼
              [Follower] [Follower]
              
  Write committed when 2/3 nodes ACK (majority)
  Leader fails → followers elect new leader`,
      },
      {
        title: "Distributed System Design Patterns You MUST Know",
        content:
          "These patterns appear in EVERY distributed system. Knowing them is like knowing design patterns for distributed architecture:\n\n**1. Sidecar Pattern**: Attach a helper process to your main application (logging agent, proxy, service mesh). The sidecar shares the same lifecycle as the main app but handles cross-cutting concerns. Used by: Istio (Envoy sidecar), Kubernetes (init containers, sidecar containers).\n\n**2. Circuit Breaker Pattern**: When calling a downstream service, track failures. After N failures (threshold), 'open' the circuit — immediately return an error WITHOUT calling the downstream service. After a timeout, try one request ('half-open'). If it succeeds, close the circuit. This prevents cascading failures — a slow downstream service won't bring down your entire system. Libraries: Resilience4j (Java), Polly (.NET), custom implementation.\n\n**3. Bulkhead Pattern**: Isolate failures to specific subsystems. If your payment service uses 50 threads for payments and 50 for refunds, a thread-pool exhaustion in refunds doesn't affect payments. Like bulkheads in a ship — a breach in one compartment doesn't sink the whole ship.\n\n**4. Retry with Exponential Backoff + Jitter**: On failure, retry after: base * 2^attempt + random_jitter. Without jitter, all failed clients retry at the exact same time (thundering herd). Example: retry at 1s, 2s, 4s, 8s ± random 0-1s. Cap at a max delay (30-60s). Used by AWS SDKs, gRPC, and virtually every production HTTP client.\n\n**5. Lease-Based Leadership**: Instead of permanent leadership (which requires split-brain protection), a leader holds a LEASE that expires after N seconds. To remain leader, it must renew the lease. If it dies, the lease expires and another node becomes leader. Used by: Zookeeper, etcd, DynamoDB Lock Client. Simpler than full Raft for single-leader coordination.",
      },
      {
        title: "How to Think About Distributed System Failures — A Mental Model",
        content:
          "When designing a distributed system, for every inter-service call, ask: 'What if this call fails? What if it succeeds but I don't get the response? What if it's slow?'\n\n**The Five Questions for Every RPC**:\n1. What if the call times out? → Retry? Return cached data? Degrade gracefully?\n2. What if the call returns an error? → Retry on 5xx, don't retry on 4xx? Circuit breaker?\n3. What if I retry and the original DID succeed? → Is the operation idempotent? Idempotency key?\n4. What if the downstream is slow (not failed)? → Timeout budget? Async? Queue-based?\n5. What if the downstream is completely down? → Fallback? Cache? Feature degradation?\n\nThe systems that survive at scale have answers to ALL five questions for EVERY external call. The systems that fail at scale have answers to none.\n\nPractical checklist for production readiness:\n▸ Every HTTP client has a timeout (connect, read, write)\n▸ Every retry loop has a maximum attempt count and exponential backoff\n▸ Every call to an external service has a circuit breaker\n▸ Every write operation is idempotent or deduplicated\n▸ Every critical path has a fallback for when dependencies are down\n▸ Every service publishes health checks and metrics",
      },
    ],
    realWorldExamples: [
      { company: "etcd", description: "Kubernetes uses etcd (which uses Raft consensus) to store all cluster state. A 3 or 5 node etcd cluster ensures cluster configuration survives node failures. Every kubectl command reads/writes etcd through the API server." },
      { company: "CockroachDB", description: "Distributed SQL database that uses Raft for consensus across ranges (data shards). Survives any minority of node failures while maintaining strong consistency. Built on the same principles as Google Spanner." },
    ],
    tradeOffs: [
      { optionA: "3-node cluster", optionB: "5-node cluster", comparison: "3 nodes: survives 1 failure, lower write latency (majority = 2), simpler. 5 nodes: survives 2 failures, higher write latency (majority = 3), better disaster tolerance. 3 is sufficient for most systems; 5 for critical infrastructure." },
    ],
    interviewTips: [
      "You don't need to explain Raft in detail, but know what consensus achieves: leader election + replicated log",
      "Mention that distributed consensus requires an ODD number of nodes (3, 5, 7) for majority voting",
      "Discuss failure scenarios: what happens if 1 of 3 nodes fails? What about 2 of 3?",
    ],
    practiceQuestions: [
      { question: "Why do distributed databases typically use 3 or 5 replicas, not 2 or 4?", answer: "Consensus requires a strict majority to agree: (N/2 + 1) nodes. With 2 nodes: majority = 2/2 — if one fails, you can't reach majority (no fault tolerance). With 3: majority = 2/3 — survives 1 failure. With 4: majority = 3/4 — still survives only 1 failure (same as 3, but more expensive). With 5: majority = 3/5 — survives 2 failures. Odd numbers are optimal because the failure tolerance of N and N+1 (when N is odd) is the same. 3 gives you fault tolerance at minimum cost." },
    ],
    tags: ["distributed-systems", "consensus", "raft", "leader-election", "fault-tolerance"],
  },
];
