import { SDTopic } from "../types";

export const databaseTopics: SDTopic[] = [
  {
    id: "sd-db-sql-vs-nosql",
    chapterId: 3,
    title: "SQL vs NoSQL",
    order: 1,
    difficulty: "beginner",
    estimatedMinutes: 15,
    overview:
      "SQL databases (PostgreSQL, MySQL) store data in structured tables with predefined schemas and support ACID transactions. NoSQL databases come in four flavors: key-value (Redis, DynamoDB), document (MongoDB), column-family (Cassandra), and graph (Neo4j). SQL is the default choice — pick NoSQL only when you have a specific reason: extreme scale, flexible schema, or a data model that doesn't fit tables well. The honest truth most senior engineers will tell you: 95% of startups that chose MongoDB because it was 'easier' and 'more flexible' ended up either migrating back to PostgreSQL or spending enormous effort building application-level JOINs, transactions, and data validation that PostgreSQL gives you for free.",
    keyPoints: [
      "SQL: structured schema, ACID transactions, powerful queries (JOINs), mature tooling",
      "NoSQL Key-Value: fast lookups by key, no complex queries (Redis, DynamoDB)",
      "NoSQL Document: flexible JSON schemas, good for nested data (MongoDB, Firestore)",
      "NoSQL Column-Family: optimized for write-heavy, time-series data (Cassandra, HBase)",
      "NoSQL Graph: relationships are first-class citizens, fast traversals (Neo4j, Neptune)",
      "Start with SQL unless you have proven needs for NoSQL — premature NoSQL is a common mistake",
      "HIDDEN GOTCHA: MongoDB didn't support multi-document ACID transactions until version 4.0 (2018). Before that, if you transferred money between two accounts (two documents), a crash mid-operation could leave your data inconsistent. Many systems built on pre-4.0 MongoDB have latent data corruption that nobody found yet. Even now, MongoDB transactions have significant performance overhead",
      "MOST DEVS DON'T KNOW: PostgreSQL has a JSONB column type that gives you 90% of MongoDB's flexibility WITH SQL's power. You can store arbitrary JSON, index specific JSON paths (CREATE INDEX ON orders USING GIN (data->'tags')), and query JSON fields in SQL. This means you can have strict schema for important columns AND flexible JSON for everything else. Instagram, Discord, and many others use this hybrid approach",
      "CRITICAL: 'NoSQL scales better' is a myth in most contexts. PostgreSQL can handle 500,000+ rows/second inserts and store hundreds of millions of rows per table with proper partitioning and indexing. Single-node PostgreSQL outperforms most NoSQL clusters for read-heavy workloads. NoSQL only wins at >100K write operations/second with geographical distribution — which is <0.1% of applications",
      "The real reason companies choose NoSQL in 2024: NOT because SQL can't handle the scale, but because managed NoSQL services (DynamoDB, Firestore) offer zero-ops, auto-scaling, and predictable pricing. It's an operational choice, not a technical one",
    ],
    deepDive: [
      {
        title: "When SQL Wins",
        content:
          "SQL wins when: (1) your data has clear relationships (users, orders, products), (2) you need transactions (payments, inventory), (3) you need complex queries with JOINs, GROUP BY, aggregations, (4) your schema is well-defined and changes slowly, (5) data integrity is critical. PostgreSQL can handle millions of rows per table, thousands of QPS, and has excellent JSON support for semi-structured data.",
      },
      {
        title: "When NoSQL Wins",
        content:
          "NoSQL wins when: (1) you need to scale writes massively (Cassandra handles 1M+ writes/sec), (2) your data structure varies between records (document store), (3) you need sub-millisecond lookups by key (Redis), (4) your data model is a graph (social networks, recommendations), (5) you need geographic distribution with eventual consistency. The most common pattern: SQL as primary database + Redis cache + Elasticsearch for search.",
        diagram: `Common Hybrid Architecture:

  ┌─────────────┐     ┌──────────────┐
  │ PostgreSQL  │     │    Redis     │
  │ (source of  │────►│  (cache for  │
  │   truth)    │     │  hot data)   │
  └──────┬──────┘     └──────────────┘
         │
         │ CDC / sync
         ▼
  ┌──────────────┐
  │Elasticsearch │
  │ (full-text   │
  │   search)    │
  └──────────────┘`,
      },
      {
        title: "NewSQL — The Best of Both Worlds?",
        content:
          "NewSQL databases (CockroachDB, TiDB, Google Spanner, YugabyteDB) promise SQL semantics with NoSQL-level horizontal scalability. They support ACID transactions across distributed nodes, automatic sharding, and geographic distribution.\n\nGoogle Spanner is the gold standard: it uses GPS clocks and atomic clocks (TrueTime) to provide globally consistent transactions across datacenters. When Google says 'externally consistent,' they mean a transaction in Asia and a transaction in Europe see the same ordering of events.\n\nCockroachDB is the open-source equivalent. It distributes data across nodes, survives node failures, and maintains serializable transactions. You get PostgreSQL-compatible SQL with automatic sharding.\n\nThe catch: these databases are 2-5x slower than single-node PostgreSQL for simple queries. The distributed consensus protocol (Raft/Paxos) adds latency to every write. If your data fits on one well-provisioned PostgreSQL server (which handles up to ~500GB active dataset comfortably), NewSQL is slower AND more complex.\n\nWhen NewSQL makes sense: global distribution with strong consistency requirements (financial systems operating across continents), datasets too large for single-node PostgreSQL (1TB+), and organizations with the expertise to operate distributed databases.\n\nThe interview answer: mention NewSQL as an option when the interviewer pushes you on 'SQL can't scale writes.' It shows you know the full spectrum of options.",
      },
      {
        title: "The Data Model Trap — Think in Access Patterns, Not Relationships",
        content:
          "The biggest mistake developers make when choosing a database: designing the data model first, THEN choosing the database. You should do the reverse — list your access patterns first, THEN choose the database that serves them best.\n\nExample for an e-commerce system:\n\nAccess patterns:\n1. Get user by ID (simple lookup)\n2. Get all orders for a user, sorted by date (range query on one user)\n3. Search products by name and filters (full-text + faceted search)\n4. Transfer money between accounts (multi-step transaction)\n5. Real-time analytics on orders per hour (time-series aggregation)\n\nDatabase choices driven by access patterns:\n- #1, #2, #4: PostgreSQL (relational, transactions, range queries)\n- #3: Elasticsearch (full-text search + faceted filtering)\n- #5: TimescaleDB or ClickHouse (time-series aggregation)\n\nIf you chose MongoDB because 'orders are nested documents,' you'd struggle with #4 (transactions across documents) and #3 (MongoDB's text search is weak compared to Elasticsearch).\n\nIf you chose Cassandra because 'it scales,' you'd struggle with #2 (can't easily sort by date within a partition unless you designed the partition key correctly) and #4 (no transactions).\n\nThe mantra: model your data for how you READ it, not how you write it. Denormalize for read performance. Duplicate data across stores if different components need different access patterns on the same data.",
      },
    ],
    realWorldExamples: [
      { company: "Instagram", description: "Runs on PostgreSQL (the world's largest Django deployment). Despite 2B+ monthly users, they've scaled SQL extensively with sharding, read replicas, and aggressive caching." },
      { company: "Discord", description: "Migrated from MongoDB to Cassandra for message storage when they hit scale limits. Cassandra handles their write-heavy workload (billions of messages/day) with predictable latency." },
    ],
    tradeOffs: [
      { optionA: "SQL (PostgreSQL)", optionB: "NoSQL (MongoDB)", comparison: "SQL: ACID transactions, JOINs, mature, harder to scale writes. NoSQL: flexible schema, horizontal scaling, no JOINs (denormalize), eventual consistency." },
    ],
    interviewTips: [
      "Default to SQL and explain why — interviewers respect this",
      "Mention specific databases: PostgreSQL for relational, Redis for cache, Cassandra for heavy writes, Elasticsearch for search",
      "If you choose NoSQL, explain WHAT you're trading away (transactions, JOINs, consistency)",
    ],
    practiceQuestions: [
      { question: "You're designing a social media app. Would you use SQL or NoSQL for the user feed?", answer: "Hybrid approach: SQL (PostgreSQL) for user accounts, relationships, and post metadata — these need referential integrity and transactions. For the feed itself, use a pre-computed feed stored in Redis (sorted set by timestamp) or Cassandra (write-heavy, time-sorted). This gives you ACID for user data and fast reads for feeds. The feed is populated asynchronously through a fan-out service when someone posts." },
    ],
    tags: ["sql", "nosql", "postgresql", "mongodb", "cassandra", "database-selection"],
  },
  {
    id: "sd-db-indexing",
    chapterId: 3,
    title: "Database Indexing",
    order: 2,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "Indexes are data structures that speed up read queries at the cost of slower writes and additional storage. Without an index, a query scans every row (O(n)). With a B-tree index, the same query is O(log n). Choosing the right indexes is one of the highest-impact performance decisions. Over-indexing slows writes; under-indexing causes slow reads and full table scans. Here's what separates senior from junior engineers: juniors add indexes when queries are slow. Seniors design indexes BEFORE writing code, based on the query access patterns they know the application will need. And they regularly audit indexes using pg_stat_user_indexes to remove unused ones that are silently slowing down every INSERT.",
    keyPoints: [
      "B-tree index: the default — great for range queries, equality, sorting (used by PostgreSQL, MySQL)",
      "Hash index: O(1) lookups but no range queries — used for exact match (IN-MEMORY stores)",
      "Composite index: index on multiple columns — order matters! (a, b) supports queries on (a) and (a, b) but NOT (b) alone",
      "Covering index: includes all query columns — avoids the table lookup entirely",
      "Full-text index: for text search (GIN index in PostgreSQL, inverted index in Elasticsearch)",
      "Every index costs: write amplification (insert updates all indexes), storage space, maintenance overhead",
      "HIDDEN GOTCHA — Index bloat: In PostgreSQL, UPDATE doesn't update in-place — it creates a new row version and marks the old one dead. The index entry for the dead row stays until VACUUM cleans it up. Under heavy update workloads, indexes can be 3-5x larger than necessary. Monitor with pgstattuple and REINDEX periodically. This is one of the most common undiagnosed PostgreSQL performance issues",
      "MOST DEVS DON'T KNOW: Partial indexes are a massive performance win that almost nobody uses. CREATE INDEX idx_active_users ON users(email) WHERE active = true. If only 10% of users are active, this index is 10x smaller, 10x faster, and costs 10x less to maintain. Perfect for 'soft delete' patterns where most rows are deleted=true but you only query active ones",
      "CRITICAL: The most common indexing mistake — indexing columns with low cardinality. An index on a 'gender' column (3 values) is almost useless because the database will sequential scan anyway when >15-20% of rows match. B-tree indexes only help when they eliminate >80% of rows. For low-cardinality filtering, use partial indexes or bitmap indexes instead",
      "Expression indexes are PostgreSQL's secret weapon: CREATE INDEX idx_lower_email ON users(LOWER(email)). Now 'WHERE LOWER(email) = ...' uses the index. Without this, querying by lowercase email would ignore your regular email index and do a full table scan. Also works for JSON: CREATE INDEX ON data((payload->>'customer_id'))",
    ],
    deepDive: [
      {
        title: "B-tree Internals",
        content:
          "A B-tree is a self-balancing tree where each node contains multiple keys. For a table with 10 million rows and a B-tree index: tree height ≈ 4 levels. A lookup traverses 4 nodes (4 disk reads ≈ 4ms on HDD, ~0.4ms on SSD) vs scanning 10M rows. Internal nodes contain keys and pointers; leaf nodes contain keys and row pointers (or the row itself in a clustered index). B+ trees (what PostgreSQL uses) store data only in leaf nodes and link leaves together for efficient range scans.",
      },
      {
        title: "Composite Index Strategy",
        content:
          "Index on (country, city, zip_code) supports: WHERE country = 'US' ✓; WHERE country = 'US' AND city = 'NYC' ✓; WHERE city = 'NYC' ✗ (can't skip the first column). Rule: put equality filters first, range filters last. If you query WHERE status = 'active' AND created_at > '2024-01-01', index should be (status, created_at), not (created_at, status).",
      },
      {
        title: "B-tree vs LSM-tree — The Write Amplification Story",
        content:
          "B-trees (PostgreSQL, MySQL) are optimized for reads. LSM-trees (RocksDB, Cassandra, LevelDB) are optimized for writes.\n\nB-tree write path: find the correct page → update in place → write to WAL. Random I/O because the page could be anywhere on disk. Each index update touches different disk locations.\n\nLSM-tree write path: append to in-memory buffer (memtable) → when full, flush to disk as a sorted file (SSTable). All writes are SEQUENTIAL I/O (much faster). Reads merge data from multiple levels.\n\nThe core tradeoff:\n▸ B-tree: Reads are fast (one tree traversal). Writes are slower (random I/O + write amplification from updating multiple indexes)\n▸ LSM-tree: Writes are fast (sequential I/O, append-only). Reads are slower (may check multiple levels + compaction)\n\nWrite amplification numbers:\n- B-tree: A 100-byte write to a row may write a 4KB page (40x amplification) + WAL\n- LSM-tree: A 100-byte write goes to memtable, then gets compacted 3-5 times across levels (also write amplification, but sequential)\n\nWhy this matters: SSDs have limited write endurance (DWPD — Drive Writes Per Day). Write amplification directly affects SSD lifespan AND performance. This is why Cassandra and RocksDB are preferred for write-heavy workloads — they generate less random I/O.\n\nThe industry trend: RocksDB (LSM-tree) is now used inside many databases as the storage engine — CockroachDB, TiDB, and even MySQL's MyRocks storage engine. It's becoming the default for write-heavy systems.",
      },
      {
        title: "Reading EXPLAIN Plans — The Skill That Makes You a 10x Engineer",
        content:
          "The difference between a developer who guesses at performance and one who KNOWS is the ability to read EXPLAIN ANALYZE output.\n\nRun: EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123 AND created_at > '2024-01-01';\n\nKey things to look for:\n\n1. **Seq Scan vs Index Scan**: If you see 'Seq Scan' on a large table, you're missing an index. Index Scan = good. Index Only Scan = even better (covering index, no table access needed).\n\n2. **Rows estimated vs actual**: 'rows=100' (estimated) but 'actual rows=50000'. Stale statistics! Run ANALYZE to update them. Bad estimates cause the optimizer to pick terrible plans.\n\n3. **Nested Loop vs Hash Join**: Nested loop for small tables + index. Hash Join for large tables without usable indexes. Seeing a Nested Loop on a million-row join? You're missing an index or have bad statistics.\n\n4. **Sort cost**: 'Sort Method: external merge Disk: 512000kB' — your sort doesn't fit in work_mem! Increase work_mem or add an index that returns data pre-sorted.\n\n5. **Bitmap Heap Scan**: The database uses MULTIPLE indexes together. Example: one index for user_id, another for date range. Combines them via bitmap AND/OR. It's smart but slower than a single composite index.\n\nThe rule: before deploying ANY query that runs on a table with >10K rows, run EXPLAIN ANALYZE in production (or a production-sized test environment). SELECT has no side effects — it's always safe to EXPLAIN.\n\nBonus: In PostgreSQL, auto_explain extension logs slow query plans to your log automatically. Enable it with: LOAD 'auto_explain'; SET auto_explain.log_min_duration = '100ms';",
      },
    ],
    realWorldExamples: [
      { company: "Uber", description: "Uses geospatial indexes (R-tree / GiST in PostGIS) to query 'find all drivers within 5km'. Without spatial indexing, this query on millions of driver locations would be impossibly slow." },
      { company: "Stack Overflow", description: "Their entire PostgreSQL database fits in RAM (512GB servers). Indexes are tiny compared to the data, making nearly all reads hit the buffer cache. They carefully choose indexes to avoid write amplification." },
    ],
    tradeOffs: [
      { optionA: "More indexes (fast reads)", optionB: "Fewer indexes (fast writes)", comparison: "More indexes: reads are fast, writes are slower (each insert updates every index), more storage. Fewer indexes: writes are fast, some reads may scan the table. Optimize for your workload: read-heavy → more indexes; write-heavy → fewer, well-chosen indexes." },
    ],
    interviewTips: [
      "When designing a schema, always discuss which queries you'll run and what indexes support them",
      "Mention EXPLAIN / query plans to show you debug performance issues in practice",
      "Know the difference between clustered and non-clustered indexes",
    ],
    practiceQuestions: [
      { question: "Your users table is slow on queries filtering by email. The table has 50 million rows. What do you do?", answer: "Add a unique B-tree index on the email column: CREATE UNIQUE INDEX idx_users_email ON users(email). This turns a sequential scan (50M rows) into an index lookup (4-5 tree levels). Since email is unique, it also enforces uniqueness at the DB level. Run EXPLAIN ANALYZE to verify the query uses the index and check the query time dropped from seconds to milliseconds." },
    ],
    tags: ["indexing", "b-tree", "composite-index", "query-optimization", "database"],
  },
  {
    id: "sd-db-sharding",
    chapterId: 3,
    title: "Database Sharding",
    order: 3,
    difficulty: "advanced",
    estimatedMinutes: 15,
    overview:
      "Sharding is horizontal partitioning of data across multiple database instances. Each shard holds a subset of the data (e.g., users A-M on Shard 1, N-Z on Shard 2). It's the nuclear option for database scaling — only necessary when a single database can't handle the load. Sharding introduces massive complexity: cross-shard queries, distributed transactions, rebalancing, and hotspots. Avoid it as long as possible; most apps never need it. Here's the thing nobody tells you: the engineers who shard the least are often the best engineers. Instagram ran on a handful of PostgreSQL servers serving 400 million users. Stack Overflow serves 1.3 billion pageviews/month on TWO SQL Server instances. Premature sharding is a massive source of accidental complexity that slows down entire engineering teams for years.",
    keyPoints: [
      "Shard key: the column used to determine which shard holds a record — the most critical decision",
      "Hash-based sharding: hash(user_id) % num_shards — even distribution but hard to range scan",
      "Range-based sharding: user_id 1-1M → shard 1, 1M-2M → shard 2 — supports range queries but can create hotspots",
      "Directory-based sharding: a lookup table maps each key to a shard — flexible but the directory is a bottleneck",
      "Cross-shard queries are expensive: a JOIN across shards requires scatter-gather",
      "Resharding (adding/removing shards) is extremely painful — plan for it from the start",
      "HIDDEN GOTCHA — Celebrity/hotspot problem: If you shard by user_id, and Kim Kardashian (500M followers) posts, the shard holding her data gets slammed while other shards are idle. Solutions: (1) add a random suffix to the shard key for hot users (user_id + random(0-9) spreads across 10 shards), (2) dedicated shards for celebrity accounts, (3) cache-first architecture where hot data never hits the shard directly",
      "MOST DEVS DON'T KNOW: Before you shard, try these in order — they solve 99% of scaling problems without shard complexity: (1) Add proper indexes (most 'slow' databases just have missing indexes), (2) Read replicas for read-heavy workloads, (3) Redis/Memcached caching layer, (4) Table partitioning (within one database), (5) Upgrade hardware (bigger CPU, more RAM, faster SSD — vertical scaling). Only if ALL five fail, consider sharding",
      "CRITICAL: Cross-shard transactions are basically impossible to do efficiently. If a single operation touches data on multiple shards, you need two-phase commit (slow, blocks on failures) or you must redesign to avoid cross-shard operations entirely. This is why shard key selection is THE most important decision — you want 95%+ of operations to be single-shard",
      "Application-level sharding vs middleware: Instagram does sharding in application code (compute shard from user_id). Vitess (YouTube/Slack) provides a middleware proxy that makes sharded MySQL look like a single database. ProxySQL and Citus (for PostgreSQL) do similar things. Middleware reduces application complexity but adds a network hop and operational complexity",
    ],
    deepDive: [
      {
        title: "Choosing a Shard Key",
        content:
          "The shard key determines everything. A good shard key: (1) distributes data evenly across shards, (2) is present in most queries (avoids scatter-gather), (3) doesn't create hotspots. For a social media app: user_id is usually the best shard key — all of a user's data lives on one shard (posts, comments, likes). team_id or org_id works for B2B apps. Avoid: created_at (time-based) because all recent writes go to one shard.",
        diagram: `Hash-Based Sharding:

  user_id = 12345
  hash(12345) % 4 = 1  →  Shard 1
  
  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
  │Shard 0 │  │Shard 1 │  │Shard 2 │  │Shard 3 │
  │Users:  │  │Users:  │  │Users:  │  │Users:  │
  │ 8,20,  │  │ 1,5,   │  │ 2,6,   │  │ 3,7,   │
  │ 24...  │  │ 9,12345│  │ 10,14  │  │ 11,15  │
  └────────┘  └────────┘  └────────┘  └────────┘`,
      },
      {
        title: "Consistent Hashing",
        content:
          "Regular hash-based sharding (hash % N) breaks when you add/remove shards — nearly all keys remap. Consistent hashing maps both keys and shards to a ring. When a shard is added, only ~1/N of keys need to move. This is how DynamoDB, Cassandra, and Redis Cluster work. Virtual nodes (vnodes) improve balance: each physical shard owns multiple points on the ring.",
      },
      {
        title: "Resharding — The Most Painful Operation in Databases",
        content:
          "You started with 4 shards. Now you need 8. What happens?\n\nWith naive hash sharding (hash % N): changing N from 4 to 8 remaps ~75% of all keys to different shards. This means moving 75% of your data WHILE the system is running. During migration, reads need to check BOTH old and new shard locations.\n\nThe migration process:\n1. Set up 4 new shard instances\n2. Start double-writing to both old and new shards\n3. Backfill: copy all existing data from old to new shard locations\n4. Verify data consistency between old and new\n5. Switch reads to new shard layout\n6. Stop writes to old shards\n7. Decommission old instances\n\nThis process takes WEEKS for large datasets and is extremely error-prone. One bug and you've lost data or have duplicates.\n\nHow to avoid resharding pain:\n▸ **Consistent hashing**: Only ~1/N of keys need to move when adding a shard\n▸ **Logical shards > physical servers**: Instagram uses 4,000 logical shards mapped to far fewer physical servers. Adding capacity = moving logical shards to new physical servers, no data restructuring\n▸ **Vitess/Citus**: Middleware that handles resharding automatically using vertical splits and horizontal moves\n▸ **Start with more shards than you need**: 64 logical shards on 4 physical servers. Scale to 16 servers by redistributing logical shards.\n\nThe interview insight: always mention logical vs physical shards. Starting with many logical shards on few physical servers is a well-known technique that makes resharding much easier.",
      },
      {
        title: "Multi-Tenant Sharding — The B2B Pattern",
        content:
          "For B2B SaaS products (Slack, Notion, Salesforce), the natural shard key is tenant_id (or org_id). Every query includes the tenant, so all operations are single-shard.\n\nBut the distribution is wildly uneven: Enterprise Customer X has 500,000 users and 10TB of data. Startup Customer Y has 5 users and 1MB of data. If you naively hash tenant_id, Customer X's shard is 10,000x more loaded than Customer Y's.\n\nThe solution — tiered sharding:\n▸ Small tenants: many tenants per shard (hundreds of startups share one database)\n▸ Medium tenants: own shard (a mid-size company gets its own database replica)\n▸ Large tenants: dedicated shard cluster (enterprise gets their own sharded database)\n\nThis is roughly what Salesforce, Slack, and Notion do. Salesforce calls it 'org-based sharding.' New tenants start on shared shards. When they grow, they get migrated to their own shard during maintenance windows.\n\nAnother benefit: data isolation for compliance. Enterprise customers often require that their data is on a separate physical server (for SOC2, HIPAA, GDPR). Dedicated shards make this possible without architectural changes.",
      },
    ],
    realWorldExamples: [
      { company: "Instagram", description: "Shards PostgreSQL by user_id. Each logical shard is a PostgreSQL schema on a physical server. They map user_id → shard using: shard_id = user_id % num_logical_shards. Started with ~4,000 logical shards." },
      { company: "Vitess (YouTube)", description: "Google built Vitess to shard MySQL for YouTube. It provides a middleware layer that handles routing, resharding, and schema changes on sharded MySQL clusters. Now open source and used by many companies." },
    ],
    tradeOffs: [
      { optionA: "Sharding", optionB: "Read replicas + Caching", comparison: "Sharding: scales writes, massive complexity, cross-shard joins are painful. Read replicas + caching: simpler, scales reads (80% of most apps' traffic), doesn't help with write bottlenecks." },
    ],
    interviewTips: [
      "Don't jump to sharding — explain you'd first try: vertical scaling → read replicas → caching → then sharding",
      "Always discuss shard key selection and why certain keys cause hotspots",
      "Mention consistent hashing for adding/removing shards",
      "Acknowledge the complexity: cross-shard queries, distributed transactions, resharding",
    ],
    practiceQuestions: [
      { question: "You need to shard a messaging app's database. What's your shard key?", answer: "Shard by conversation_id (or channel_id). All messages in a conversation live on the same shard, so fetching a conversation's message history is a single-shard query (fast). User lookups can use a separate user → shard mapping table. Avoid sharding by user_id because a single conversation would span multiple shards (every participant on a different shard = expensive scatter-gather for every message load). Avoid sharding by timestamp because it creates write hotspots on the latest shard." },
    ],
    tags: ["sharding", "partitioning", "consistent-hashing", "distributed-database", "shard-key"],
  },
  {
    id: "sd-db-replication",
    chapterId: 3,
    title: "Database Replication",
    order: 4,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "Replication copies data from one database server (primary/leader) to one or more replicas (followers). Primary handles writes; replicas handle reads. This provides: (1) read scalability (distribute read load across replicas), (2) fault tolerance (if primary dies, promote a replica), (3) geographic distribution (replica in each region for lower latency). The key trade-off is replication lag — the delay between a write on the primary and its appearance on replicas. Here's what nobody tells you in tutorials: replication is NOT fire-and-forget. It requires constant monitoring. Replication lag can spike to minutes under heavy write load, replicas can silently fall behind, and automatic failover can cause split-brain where TWO servers think they're the primary. Every major database outage story involves replication going wrong.",
    keyPoints: [
      "Leader-Follower (Primary-Replica): most common — one writer, multiple readers",
      "Synchronous replication: primary waits for replica ACK before confirming write (strong consistency, higher latency)",
      "Asynchronous replication: primary confirms immediately, replica catches up later (fast writes, eventual consistency)",
      "Semi-synchronous: one replica is sync (for durability), rest are async (balance)",
      "Replication lag: the delay between primary write and replica having the data — can be ms to seconds",
      "Read-after-write consistency: user writes to primary, reads from replica before replication → stale data. Solution: read from primary for own data, replica for others'",
      "HIDDEN GOTCHA — Split-brain: When a network partition separates the primary from replicas, the replicas may elect a NEW primary. Now you have TWO primaries accepting writes. When the partition heals, you have conflicting data and no way to automatically merge. Prevention: (1) Fencing tokens — only the primary with the latest token can write, (2) STONITH (Shoot The Other Node In The Head) — literally power off the old primary when a new one is elected, (3) Quorum-based systems where writes need majority acknowledgment",
      "MOST DEVS DON'T KNOW: PostgreSQL's replication lag is measured in WAL (Write-Ahead Log) bytes, not time. A replica can be '100MB behind' which could mean 1 second or 10 minutes depending on write rate. Monitor BOTH: pg_stat_replication shows bytes lag AND time lag. Set up alerts when lag exceeds your tolerance (typically 1-5 seconds for most applications)",
      "CRITICAL — Change Data Capture (CDC): Instead of querying replicas, you can stream every change from the database's WAL to downstream systems. Debezium captures PostgreSQL/MySQL changes and publishes to Kafka. This is how you keep Elasticsearch, Redis, and data warehouses in sync with your primary database WITHOUT polling. It's the foundation of event-driven architectures and is far more reliable than application-level dual writes",
      "Replication is NOT backup. If you run DELETE FROM users; on the primary, that DELETE replicates to ALL replicas instantly. For actual backup, you need point-in-time recovery (PITR) using WAL archiving, or periodic pg_dump snapshots. Many companies learned this the hard way",
    ],
    deepDive: [
      {
        title: "Replication Topologies",
        content:
          "Single-Leader: one primary, N replicas. Simple, but primary is a write bottleneck. Multi-Leader: multiple primaries in different regions. Both accept writes, sync to each other. Better write scalability but requires conflict resolution (last-write-wins, merge). Leaderless: all nodes accept reads and writes (Cassandra, DynamoDB). Uses quorum (W+R>N) for consistency. Most flexible, most complex.",
        diagram: `Single-Leader Replication:

  Writes ──► [Primary]
               │ replication
          ┌────┼────┐
          ▼    ▼    ▼
       [R1]  [R2]  [R3]  ◄── Reads distributed`,
      },
      {
        title: "Failover — The Most Dangerous 30 Seconds in Your Infrastructure",
        content:
          "When the primary database crashes, you need to promote a replica to primary. This sounds simple. In practice, it's one of the most error-prone operations in all of infrastructure.\n\nAutomatic failover process:\n1. **Detection**: Monitoring detects primary is unresponsive (typically 3 failed health checks, ~30 seconds)\n2. **Election**: Choose which replica becomes the new primary (the one with least replication lag)\n3. **Promotion**: Tell the chosen replica to accept writes\n4. **Reconfiguration**: Point all connections to the new primary. Update DNS, connection pools, or proxy configs\n5. **Old primary returns**: When the old primary comes back, it must become a replica (NEVER a second primary)\n\nWhat goes wrong in practice:\n\n▸ **Data loss**: If using async replication, the promoted replica may be missing the last few seconds of writes. Those transactions are GONE. This is why financial systems use synchronous replication (or semi-sync where at least one replica has all data).\n\n▸ **Stale reads during detection window**: For 30 seconds while detection runs, reads from replicas may serve stale data while the dead primary has the latest writes that never replicated.\n\n▸ **Connection storms**: When failover happens, every application server simultaneously tries to connect to the new primary. 500 servers × 20 connections each = 10,000 simultaneous connection attempts. The fresh primary may crash under this load. Solution: connection pooling with PgBouncer and randomized reconnection delays.\n\n▸ **Application-level split-brain**: During failover, some app servers detect the change faster than others. For a brief window, some servers write to the old primary and some to the new one. This creates divergent data.\n\nAutomated failover tools: Patroni (PostgreSQL), Orchestrator (MySQL), AWS RDS Multi-AZ (handles failover automatically). In production, NEVER attempt manual failover without a runbook that your team has rehearsed.",
      },
      {
        title: "Multi-Region Replication — Global Scale Architecture",
        content:
          "For global applications, you want replicas in every major region: US-East, US-West, Europe, Asia.\n\nThe physics problem: speed of light. US-East to US-West = ~70ms round trip. US to Europe = ~90ms. US to Asia = ~150ms. This means synchronous replication across regions adds 70-150ms to every write. That's unacceptable for most applications.\n\nThe standard architecture:\n▸ Primary in one region (say US-East)\n▸ Async replicas in other regions\n▸ Reads served from local replica (fast)\n▸ Writes always go to primary region (adds cross-region latency)\n\nFor write-heavy global apps, you need multi-leader or leaderless:\n▸ **Multi-leader**: Primary in each region, async replication between them. Conflicts resolved by last-write-wins or custom merge logic. Used by: Google Docs (operational transforms), Notion.\n▸ **Leaderless with quorum**: All nodes in all regions accept writes. Quorum of W (write) + R (read) > N (total nodes) ensures consistency. Used by: DynamoDB Global Tables, Cassandra.\n\nThe conflict resolution problem is the hardest part of multi-region writes. If User 1 in US and User 2 in Europe simultaneously edit the same document, which write wins? There's no perfect answer — it depends on your application:\n- Last-write-wins (LWW): Simple but can lose data\n- Custom merge: Application-specific logic (e.g., CRDTs for collaborative editing)\n- Region priority: Primary region always wins conflicts\n\nThis is why most applications route ALL writes to one primary region and use async replication for reads. It avoids the conflict problem entirely at the cost of write latency from non-primary regions.",
      },
    ],
    realWorldExamples: [
      { company: "GitHub", description: "Uses MySQL with leader-follower replication. Reads go to replicas. They built a proxy (ProxySQL) that handles read/write splitting automatically, and handle replication lag by reading from primary for recently-written data." },
      { company: "Amazon Aurora", description: "Decouples storage from compute. A single storage layer replicates data 6 ways across 3 AZs. Read replicas share the same storage, so replication lag is ~10ms. Writers and readers talk to the same underlying storage." },
    ],
    tradeOffs: [
      { optionA: "Synchronous Replication", optionB: "Asynchronous Replication", comparison: "Sync: no data loss on primary failure, higher write latency, slower throughput. Async: fast writes, potential data loss if primary crashes before replication, eventual consistency on reads." },
    ],
    interviewTips: [
      "Always mention read replicas as the FIRST scaling step for databases — before sharding",
      "Discuss replication lag and its impact on user experience",
      "Know the failover process: detect failure → elect new primary → redirect traffic",
    ],
    practiceQuestions: [
      { question: "A user updates their profile, then immediately views it and sees the old data. Why?", answer: "Classic read-after-write consistency problem. The write went to the primary, but the subsequent read went to a replica that hasn't received the update yet (replication lag). Solutions: (1) Read the user's own profile from primary, others' profiles from replica. (2) Track the user's last write timestamp, and if reading within N seconds of a write, read from primary. (3) Use synchronous replication for the first replica (semi-sync). (4) Return the write response directly to the client and use it to update the UI without re-reading." },
    ],
    tags: ["replication", "primary-replica", "read-replicas", "replication-lag", "failover"],
  },
  {
    id: "sd-db-partitioning",
    chapterId: 3,
    title: "Data Partitioning Strategies",
    order: 5,
    difficulty: "intermediate",
    estimatedMinutes: 10,
    overview:
      "Partitioning divides a table into smaller chunks for performance. Vertical partitioning splits columns (keep frequently accessed columns together). Horizontal partitioning splits rows (users 1-1M in partition 1, 1M-2M in partition 2). Unlike sharding (partitions across different servers), database partitioning usually stays on the same server with separate files/tablespaces. PostgreSQL and MySQL support native table partitioning. The misconception most developers have: partitioning and sharding are the same thing. They're NOT. Partitioning is a database-level optimization on a SINGLE server. Sharding distributes data across MULTIPLE servers. You should partition long before you even think about sharding. A partitioned table on one server can handle billions of rows efficiently.",
    keyPoints: [
      "Horizontal partitioning: split rows by a partition key (range, list, hash)",
      "Vertical partitioning: split columns — move large/rarely-accessed columns to separate table",
      "Range partitioning: by date ranges — great for time-series data (logs per month)",
      "List partitioning: by discrete values — orders by country/region",
      "Hash partitioning: by hash of key — even distribution when ranges don't make sense",
      "Partition pruning: query optimizer skips irrelevant partitions — huge performance boost",
      "HIDDEN GOTCHA: If your query doesn't include the partition key in the WHERE clause, PostgreSQL scans ALL partitions. This is WORSE than a single unpartitioned table because the overhead of touching each partition adds up. Always include the partition key in queries. If you partitioned by month but query by user_id without a date range, every partition is scanned. Design your partitions around your most common query patterns",
      "MOST DEVS DON'T KNOW: PostgreSQL's partition pruning happens at PLAN TIME (static) and EXECUTION TIME (dynamic). Static pruning works with constant values (WHERE date = '2024-01-15'). Dynamic pruning works with parameterized queries ($1). Before PostgreSQL 11, only static pruning existed — prepared statements and parameterized queries scanned all partitions. This was a major performance trap that caught many teams off-guard",
      "CRITICAL: Dropping a partition is an O(1) operation (it's just removing a file). DELETE FROM table WHERE date < '2023-01-01' on a 5-billion-row table could take HOURS, lock the table, and generate massive WAL. Detaching a partition takes milliseconds, zero locking. This is the #1 reason to partition: painless data retention",
      "Vertical partitioning is underused. If your users table has a 'bio' TEXT column (avg 5KB) that's only read on profile pages, but you query user_id, name, email constantly, move 'bio' to a separate table. Your main users table becomes 50x smaller, fits in memory, and queries are dramatically faster",
    ],
    deepDive: [
      {
        title: "Time-Based Partitioning",
        content:
          "The most common use case: partition analytics/log tables by month or week. Table: events_2024_01, events_2024_02, etc. Benefits: (1) queries on recent data scan only recent partitions, (2) old data can be archived by detaching old partitions (instant vs DELETE which locks the table), (3) each partition fits in cache better. A query for 'events in last 7 days' only touches 1-2 partitions instead of scanning the entire table.",
      },
      {
        title: "Partitioning in Practice — The Complete Setup",
        content:
          "Here's a real-world PostgreSQL setup that handles billions of rows:\n\nStep 1: Create the partitioned table:\nCREATE TABLE events (\n  id BIGINT GENERATED ALWAYS AS IDENTITY,\n  event_type TEXT NOT NULL,\n  user_id BIGINT NOT NULL,\n  payload JSONB,\n  created_at TIMESTAMPTZ NOT NULL\n) PARTITION BY RANGE (created_at);\n\nStep 2: Create monthly partitions:\nCREATE TABLE events_2024_01 PARTITION OF events\n  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');\nCREATE TABLE events_2024_02 PARTITION OF events\n  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');\n\nStep 3: Automate with pg_partman:\nSELECT partman.create_parent('public.events', 'created_at', 'native', 'monthly');\n-- pg_partman auto-creates future partitions and detaches old ones\n\nStep 4: Add indexes PER partition:\nCREATE INDEX ON events_2024_01 (user_id);\nCREATE INDEX ON events_2024_01 (event_type, created_at);\n-- Or use partition-wise indexing: CREATE INDEX ON events (user_id);\n\nRetention policy:\n-- Keep 12 months of data, archive older:\nALTER TABLE events DETACH PARTITION events_2023_01;\n-- Move to cold storage or drop\n\nThe key insight: pg_partman handles all the automation. Without it, you need cron jobs to create new partitions BEFORE the month starts (inserts to a missing partition fail!) and to detach old ones. In production, ALWAYS use pg_partman or equivalent automation.",
      },
      {
        title: "Hot Partition Problem and How to Solve It",
        content:
          "A hot partition is when one partition receives disproportionately more traffic than others. Examples:\n\n▸ **Time partition**: If you partition logs by day, today's partition gets ALL the writes (100x more than yesterday's). This is actually fine for time-series — today's partition handles writes, old partitions are read-only and can be compressed.\n\n▸ **Hash partition by user_id**: A viral user (10M followers) generates 10,000x more events than a normal user. If their user_id hash maps to one partition, that partition is hot.\n\n▸ **List partition by country**: If 60% of your users are in the US, the US partition is 10x larger than others.\n\nSolutions:\n1. **Sub-partitioning**: Partition by country, then sub-partition each country by hash(user_id). The US partition gets split into 16 sub-partitions.\n\n2. **Composite partition key**: Instead of partitioning by country, partition by hash(country || user_id). Even distribution regardless of country concentration.\n\n3. **Time-based with smaller intervals**: If daily partitions are too large, switch to hourly. If hourly is too granular, switch to weekly. Match the partition interval to your data volume.\n\n4. **Accept the asymmetry**: Sometimes hot partitions are fine. Today's partition is hot for writes but read queries mostly hit old (cold) partitions. The hot partition fits in memory and handles the write load. Engineer monitoring, not prevention.\n\nThe principle: not all partition imbalance is a problem. It's only a problem if the hot partition can't handle its load. Monitor partition sizes and query latency per partition to detect real issues vs theoretical concerns.",
      },
    ],
    realWorldExamples: [
      { company: "Timescale", description: "TimescaleDB (PostgreSQL extension) auto-partitions by time. IoT and analytics workloads with billions of time-series data points use time-based chunks for fast queries and automatic data retention." },
    ],
    tradeOffs: [
      { optionA: "Partitioned table", optionB: "Separate tables (application-level)", comparison: "Native partitioning: transparent to app, query optimizer handles pruning, constraints maintained. Separate tables: app manages routing, more flexible, no cross-partition queries without UNION ALL." },
    ],
    interviewTips: [
      "Mention partitioning for any table that will grow beyond 100M+ rows",
      "Time-series data = time-based partitioning — almost always the right answer",
      "Distinguish from sharding: partitioning is within one database, sharding is across servers",
    ],
    practiceQuestions: [
      { question: "You have an analytics events table with 5 billion rows growing 10M/day. Queries are slow. What do you do?", answer: "Partition by month using PostgreSQL native partitioning on the timestamp column. This gives: (1) partition pruning — queries for 'last 30 days' only scan 1-2 partitions instead of 5B rows, (2) fast data retention — DROP old partitions instead of DELETE (no table lock), (3) better cache efficiency. Also add appropriate indexes (event_type, user_id) on each partition. Consider pg_partman for automated partition management." },
    ],
    tags: ["partitioning", "horizontal-partitioning", "vertical-partitioning", "time-series", "query-optimization"],
  },
  {
    id: "sd-db-types",
    chapterId: 3,
    title: "Database Types & When to Use Them",
    order: 6,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "Beyond SQL vs NoSQL, understanding the right database type for each use case is critical. Key-value stores (Redis) for caching and sessions. Document stores (MongoDB) for content management. Wide-column stores (Cassandra) for time-series and IoT. Graph databases (Neo4j) for social networks and recommendations. Time-series databases (InfluxDB) for metrics and monitoring. Search engines (Elasticsearch) for full-text search. The thing most tutorials won't tell you: in the real world, 80% of companies use just PostgreSQL + Redis. The specialized databases matter at scale, but the most common architecture mistake is adding MORE databases before you've tried PostgreSQL's built-in capabilities (JSONB, full-text search, pg_trgm for fuzzy matching, PostGIS for geospatial, TimescaleDB for time-series). PostgreSQL is the Swiss Army Knife of databases.",
    keyPoints: [
      "Key-Value (Redis, DynamoDB): O(1) lookups, sessions, caching, counters, rate limiters",
      "Document (MongoDB, Firestore): nested JSON, flexible schema, content management, catalogs",
      "Wide-Column (Cassandra, HBase): massive write throughput, time-series, IoT sensor data",
      "Graph (Neo4j, Neptune): relationships are first-class, social networks, fraud detection",
      "Time-Series (InfluxDB, TimescaleDB): optimized for append-only timestamped data, monitoring",
      "Search (Elasticsearch, Solr): inverted index, full-text search, log analysis, autocomplete",
      "HIDDEN GOTCHA: Elasticsearch is NOT a database. It has no ACID transactions, can lose acknowledged writes during network partitions, and its eventual consistency means search results may be stale. Always use it as a secondary index backed by a real database. The pattern: write to PostgreSQL → CDC/event → update Elasticsearch. Never make Elasticsearch your source of truth",
      "MOST DEVS DON'T KNOW: Redis is single-threaded (until Redis 7.0 added multi-threaded I/O). It handles 100K+ ops/sec on ONE CPU core because all operations are in-memory and the event loop avoids context switching. If you need more throughput, shard horizontally rather than throwing more cores at one instance",
      "CRITICAL: Graph databases are overhyped for most use cases. If your 'graph problem' is just '3-4 level JOINs,' PostgreSQL with recursive CTEs handles it fine. Graph databases shine only when: (1) relationships are more important than entities, (2) you need variable-length path traversals, (3) relationship types change frequently",
      "The polyglot persistence trap: using 5 different databases adds 5x operational overhead. Each needs monitoring, backups, failover, security patching, and team expertise. Only add a specialized database when PostgreSQL genuinely can't handle the access pattern",
    ],
    deepDive: [
      {
        title: "Choosing the Right Database",
        content:
          "Decision framework: (1) Is it relational with transactions? → PostgreSQL. (2) Is it a cache or session store? → Redis. (3) Need full-text search? → Elasticsearch. (4) Time-series metrics? → TimescaleDB or InfluxDB. (5) High-volume writes with simple lookups? → Cassandra. (6) Graph traversals (friends-of-friends)? → Neo4j. (7) Flexible nested documents? → MongoDB. Most real systems use 2-4 databases, each for its strength.",
        diagram: `Database Selection Guide:

  Need transactions?
  ├── YES → PostgreSQL / MySQL
  └── NO
       ├── Need fast key lookups? → Redis / DynamoDB
       ├── Need text search? → Elasticsearch
       ├── Need graph queries? → Neo4j
       ├── Time-series data? → TimescaleDB
       ├── Heavy writes? → Cassandra
       └── Flexible schema? → MongoDB`,
      },
      {
        title: "Redis Deep Dive — Way More Than Just a Cache",
        content:
          "Redis is the most underestimated tool in system design. Most developers know it as 'a cache.' It's actually a full-featured data structure server. Here's what you can build with JUST Redis:\n\n▸ **Rate limiter**: INCR + EXPIRE. Atomic increment with TTL = sliding window counter.\n▸ **Session store**: SET session:abc {user data} EX 3600. Fast, shared across servers.\n▸ **Leaderboard**: ZADD leaderboard 1500 user:1. Sorted sets give O(log N) rank queries.\n▸ **Real-time analytics**: HyperLogLog (PFADD) counts unique visitors with 0.81% error using only 12KB memory per counter.\n▸ **Pub/Sub**: SUBSCRIBE channel; PUBLISH channel msg. Real-time messaging backbone.\n▸ **Distributed lock**: SET lock:resource NX EX 30. Prevents race conditions across servers.\n▸ **Queue**: LPUSH + BRPOP. Simple task queue with blocking pop.\n▸ **Geospatial index**: GEOADD locations 13.361 38.115 'Palermo'. GEORADIUS finds nearby points.\n▸ **Bloom filter**: Redis Bloom (BFADD, BFEXISTS). Probabilistic 'does this element exist?'\n\nPersistence gotchas:\n- RDB (snapshot): periodic full dumps. Data loss = everything since last snapshot.\n- AOF (append-only file): logs every write. More durable but larger files.\n- The trap: AOF with 'fsync always' is nearly as slow as a disk database. Most use fsync per second.\n\nWhen NOT to use Redis: dataset exceeds RAM, you need ACID transactions, or durability matters more than speed.",
      },
      {
        title: "The Data Synchronization Challenge — Keeping Multiple Databases in Sync",
        content:
          "When you use PostgreSQL + Redis + Elasticsearch, how do you keep them in sync?\n\nApproach 1 — Dual write (DON'T DO THIS):\nwrite to PostgreSQL → write to Redis → write to Elasticsearch. If Elasticsearch write fails after PostgreSQL succeeds, data is inconsistent. Fundamentally broken for reliable systems.\n\nApproach 2 — Change Data Capture (CDC) (RECOMMENDED):\nwrite to PostgreSQL → Debezium reads WAL → publishes to Kafka → consumers update Redis + Elasticsearch. Only one write needed. If a consumer is down, events queue in Kafka and replay when it recovers.\n\nApproach 3 — Outbox pattern:\nwrite to PostgreSQL (data + outbox entry in same transaction) → worker reads outbox → publishes events → consumers update downstream systems. Transactional guarantee without external dependencies.\n\nThe production standard: CDC for mature systems, outbox for simpler setups. NEVER dual write for anything important.",
        diagram: `Data Sync via CDC:

  App Server
      │
      ▼ (single write)
  [PostgreSQL]
      │ WAL stream
      ▼
  [Debezium CDC]
      │ Kafka events
      ├──────────────────────┐
      ▼                      ▼
  [Redis Consumer]     [ES Consumer]
  (update cache)       (update index)`,
      },
    ],
    realWorldExamples: [
      { company: "Airbnb", description: "PostgreSQL for bookings/payments, Redis for caching/sessions, Elasticsearch for property search (location, amenities, price range), and a custom ML-based service for recommendations." },
      { company: "LinkedIn", description: "Uses a graph database (custom-built) for the social graph, Kafka for event streaming, Elasticsearch for people search, and Espresso (custom NoSQL) for member profiles." },
    ],
    tradeOffs: [
      { optionA: "Polyglot persistence (multiple DBs)", optionB: "Single database", comparison: "Multiple DBs: each optimized for its workload, more operational complexity, data sync challenges. Single DB: simpler ops, may not perform well for all query patterns." },
    ],
    interviewTips: [
      "Name specific databases, not just categories — 'Redis for caching' not 'a key-value store'",
      "Explain WHY each database type fits its use case using data model and access patterns",
      "Most systems need 2-3 databases — mention the primary store and specialized stores",
    ],
    practiceQuestions: [
      { question: "You're building a food delivery app like Uber Eats. What databases would you use and why?", answer: "PostgreSQL: user accounts, restaurants, orders, payments — relational data with ACID transactions. Redis: session management, real-time driver locations (sorted set by geohash), menu caching, rate limiting. Elasticsearch: restaurant and dish search (full-text + geo-spatial filtering). Cassandra or TimescaleDB: order tracking events and delivery history (time-series, write-heavy, append-only). This gives you safety for transactions, speed for lookups, search for discovery, and scale for event data." },
    ],
    tags: ["database-selection", "polyglot-persistence", "key-value", "document", "graph", "time-series"],
  },
];
