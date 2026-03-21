import { SDTopic } from "../types";

export const cachingTopics: SDTopic[] = [
  {
    id: "sd-cache-strategies",
    chapterId: 4,
    title: "Caching Strategies",
    order: 1,
    difficulty: "beginner",
    estimatedMinutes: 15,
    overview:
      "Caching stores frequently accessed data in a faster storage layer (memory) to reduce latency and database load. The four main strategies are: Cache-Aside (lazy loading — app manages cache), Read-Through (cache manages reads from DB), Write-Through (writes go to cache AND DB simultaneously), and Write-Behind (writes go to cache first, async flush to DB). Each has different consistency and performance trade-offs. Here's what years of production experience teaches you: caching isn't about speed — it's about PROTECTING YOUR DATABASE. Without caching, a traffic spike could send 50,000 QPS directly to your database and crash it in seconds. The cache is a shield. Think of it as 'database load shedding' rather than just 'making things faster.'",
    keyPoints: [
      "Cache-Aside: app checks cache → miss → fetch from DB → populate cache. Most common pattern.",
      "Read-Through: cache itself fetches from DB on miss. App only talks to cache.",
      "Write-Through: every write goes to cache AND DB synchronously. Consistent but slower writes.",
      "Write-Behind (Write-Back): write to cache, async batch write to DB. Fast writes, risk of data loss.",
      "TTL (Time to Live): how long cached data is valid. Too short = frequent misses. Too long = stale data.",
      "Cache-aside + TTL is the most common combination in practice.",
      "HIDDEN GOTCHA — Cache warming: When you deploy new servers or restart Redis, the cache is EMPTY (cold cache). Every request is a cache miss, all hitting the database simultaneously. This alone can crash your DB. Solution: pre-warm the cache on startup by loading the top 1,000-10,000 most accessed items. Also consider using Redis persistence (RDB/AOF) so cache survives restarts",
      "MOST DEVS DON'T KNOW: The 'look-aside cache' pattern (cache-aside) has a subtle race condition. Thread A reads DB (price=$10), Thread B writes DB (price=$15) and deletes cache, Thread A writes its stale $10 to cache. Now cache has $10 but DB has $15. This is rare because reads are usually faster than writes, but it DOES happen. Facebook's lease token mechanism prevents this — the cache invalidation marks the key so stale writes are rejected",
      "CRITICAL: Caching should be transparent to your application logic. If removing the cache causes incorrect behavior (not just slower behavior), your caching layer is doing too much. Cache should be a performance optimization, not a correctness requirement. The database should always be the source of truth",
      "The cache hit rate sweet spot: below 80% hit rate, the cache is adding complexity without much benefit. Above 95%, you might have TTLs that are too long (serving stale data). Monitor hit rate, miss rate, and eviction rate continuously",
    ],
    deepDive: [
      {
        title: "Cache-Aside Pattern",
        content:
          "The most widely used pattern. Application flow: (1) Check cache for key. (2) If hit, return cached value. (3) If miss, query database. (4) Store result in cache with TTL. (5) Return to client. The application explicitly manages both cache and DB. Advantage: only requested data is cached (efficient). Disadvantage: first request always hits DB (cold start). Solution: cache warming on startup.",
        diagram: `Cache-Aside Pattern:

  Client ──► App Server
                │
           ┌────┴────┐
           ▼         ▼
        [Cache]   [Database]
        
  1. Check cache  ──► HIT? Return
  2. Cache MISS   ──► Query DB
  3. Store in cache    
  4. Return to client`,
      },
      {
        title: "Write-Behind Pattern",
        content:
          "Writes go to cache immediately and return to the client. A background process asynchronously flushes cache changes to the database in batches. This provides extremely fast write latency (cache write ≈ 1ms vs DB write ≈ 5-20ms). The risk: if the cache node crashes before flushing, you lose the uncommitted writes. Mitigated with: WAL (write-ahead log), replication, or accepting potential data loss for certain use cases.",
      },
      {
        title: "Cache-Aside vs Read-Through vs Write-Through — The Real-World Decision",
        content:
          "Most tutorials present these as equal choices. In practice, here's what actually gets used and why:\n\n**Cache-Aside (90% of real systems)**: You control the logic. Works with ANY cache (Redis, Memcached, local memory). Easy to reason about. Easy to debug. This is what Facebook, Twitter, Instagram, and most companies use.\n\nWhy Read-Through and Write-Through are rare:\n▸ They require the cache to 'know' about your database (connection details, query logic). This couples your cache infrastructure to your data layer.\n▸ Redis doesn't natively support read-through or write-through. You'd need a framework or custom wrapper.\n▸ If the cache fails, your application can still fall back to the database with cache-aside. With read-through, a cache failure means NO reads work at all.\n\n**When Read-Through actually works**: DynamoDB DAX (purpose-built read-through), Hibernate's L2 cache (framework-managed), and custom cache layers in large organizations where the cache team provides a library.\n\n**When Write-Behind actually works**: Counting systems (view counters, analytics events) where losing a few seconds of writes on crash is acceptable. Social media 'like' counts: write to Redis immediately (fast UX), batch flush to DB every 10 seconds. If Redis crashes, you lose at most 10 seconds of like counts — annoying but not catastrophic.\n\nThe pragmatic rule: use cache-aside unless you have a specific framework that handles read/write-through for you. Don't build custom read-through or write-through infrastructure — the complexity rarely pays off.",
      },
    ],
    realWorldExamples: [
      { company: "Facebook (Memcached)", description: "Uses cache-aside with Memcached for user profiles, friend lists, and posts. Their TAO cache handles billions of lookups/second with a graph-aware caching layer. On miss, fetch from MySQL and populate cache." },
      { company: "Amazon DynamoDB DAX", description: "DAX is a read-through/write-through cache for DynamoDB. It sits between your app and DynamoDB, automatically caching reads and keeping writes consistent. Reduces response times from milliseconds to microseconds." },
    ],
    tradeOffs: [
      { optionA: "Cache-Aside", optionB: "Read/Write-Through", comparison: "Cache-Aside: flexible, app controls logic, possible inconsistency window. Read/Write-Through: simpler app logic (just talk to cache), cache must support DB connectors, consistent but coupled." },
    ],
    interviewTips: [
      "Default to cache-aside + TTL — it's the most practical and interviewers expect it",
      "Always mention cache invalidation as the hard part",
      "Discuss TTL trade-offs: too short (frequent misses, DB load), too long (stale data)",
    ],
    practiceQuestions: [
      { question: "When would you use write-behind instead of write-through caching?", answer: "Write-behind when: (1) write volume is very high and you need to batch DB writes (e.g., analytics events, view counts), (2) write latency is critical (real-time bidding, gaming scores), (3) you can tolerate potential data loss in a crash. Write-through when: (1) data consistency is critical (e-commerce inventory), (2) write volume is moderate, (3) you need the guarantee that DB always has the latest data. In practice, most apps use cache-aside for reads and write-through for critical writes." },
    ],
    tags: ["caching", "cache-aside", "write-through", "write-behind", "ttl"],
  },
  {
    id: "sd-cache-eviction",
    chapterId: 4,
    title: "Cache Eviction Policies",
    order: 2,
    difficulty: "beginner",
    estimatedMinutes: 8,
    overview:
      "When a cache is full and a new entry needs to be added, an eviction policy decides which existing entry to remove. The most common policies are: LRU (Least Recently Used — evict the item accessed longest ago), LFU (Least Frequently Used — evict the item accessed fewest times), FIFO (First In First Out), and Random. LRU is the default choice in most systems because it's simple, effective, and has good cache hit rates for most workloads. The nuance nobody discusses: eviction policy matters far less than cache SIZE. If your cache is large enough to hold the entire working set, eviction policy is irrelevant. Focus on sizing your cache correctly first (monitor eviction rate — if it's zero, your cache is big enough), then optimize the eviction policy.",
    keyPoints: [
      "LRU (Least Recently Used): evicts items not accessed recently. Good general-purpose choice.",
      "LFU (Least Frequently Used): evicts items with lowest access count. Good for skewed access patterns.",
      "FIFO (First In First Out): evicts oldest items regardless of access. Simplest, worst hit rate.",
      "TTL-based eviction: items expire after a fixed time regardless of access pattern.",
      "Redis supports: noeviction, allkeys-lru, volatile-lru, allkeys-lfu, allkeys-random",
      "Cache hit rate is the key metric — aim for > 90% to justify the cache",
      "HIDDEN GOTCHA: Redis doesn't implement true LRU (too expensive at millions of keys). It uses APPROXIMATE LRU — it samples 5 random keys and evicts the least recently used among those 5. Increase the sample size (maxmemory-samples 10) for better accuracy at a slight CPU cost. In practice, the approximation is accurate enough that you'd never notice the difference",
      "MOST DEVS DON'T KNOW: The choice between 'allkeys-lru' and 'volatile-lru' in Redis is critical and often misconfigured. 'volatile-lru' only evicts keys that HAVE a TTL set. If some keys don't have TTL, they'll NEVER be evicted, even if the cache is full — Redis will return OOM errors. 'allkeys-lru' evicts ANY key when memory is full. Use 'allkeys-lru' if all keys are equally evictable. Use 'volatile-lru' if some keys are 'permanent' (like configuration) while others are evictable caches",
      "CRITICAL: The 'scan resistance' problem with LRU. If a batch operation scans through a large dataset (e.g., a nightly report reads all users), it pollutes the LRU cache by pushing out all the genuinely hot data. After the scan, your cache is full of cold data. Solution: use LFU (frequent items survive scans) or segmented LRU like memcached's slab allocator (hot and cold segments)",
    ],
    deepDive: [
      {
        title: "LRU vs LFU",
        content:
          "LRU works great when recent access predicts future access (temporal locality). A popular product viewed 5 minutes ago will likely be viewed again soon. LFU is better when some items are consistently popular (e.g., homepage content, trending topics). The downside of LFU: a once-popular item that's no longer relevant stays in cache because it has high historical frequency. Solution: LFU with time decay (Redis's LFU implementation decays counters over time).",
      },
      {
        title: "Implementing LRU — The Interview Classic",
        content:
          "LRU cache is one of the most common system design AND coding interview questions. Here's the complete mental model:\n\nData structure: HashMap + Doubly Linked List\n- HashMap: O(1) lookup by key → points to a node in the linked list\n- Doubly Linked List: ordered by access time. Most recently used at head, least recently used at tail.\n\nOperations:\n▸ GET(key): Look up in HashMap → O(1). Move node to head of list → O(1). Return value.\n▸ PUT(key, value): If key exists, update value + move to head. If key doesn't exist, add to head. If cache is full, evict tail node and remove its HashMap entry. All O(1).\n\nWhy doubly linked list? Because you need to remove a node from the MIDDLE of the list (on access) in O(1). A singly linked list would need to find the previous node first (O(n)). With doubly linked list, you have the previous pointer already.\n\nIn production, you'd never implement this yourself — you'd use Redis or a library. But understanding the data structure shows deep knowledge in interviews.\n\nAdvanced variants:\n▸ LRU-K: Track the last K accesses (not just the last one). Requires K accesses before an item is considered 'hot.' Resistant to scan pollution.\n▸ 2Q: Two queues — new items go to a probation queue. If accessed again, promoted to the main LRU. Prevents one-time accesses from polluting the cache.\n▸ ARC (Adaptive Replacement Cache): Automatically balances between LRU and LFU based on workload. Used by IBM and ZFS. Patented.",
      },
    ],
    realWorldExamples: [
      { company: "Redis", description: "Defaults to noeviction (returns error when full). Most production configs use allkeys-lru. Redis 4.0+ added LFU support with probabilistic frequency counters and time-based decay." },
    ],
    tradeOffs: [
      { optionA: "LRU", optionB: "LFU", comparison: "LRU: good general case, simple, may evict popular items during burst traffic. LFU: great for skewed workloads, keeps truly popular data, slow to adapt to changing popularity." },
    ],
    interviewTips: [
      "Default to LRU — explain it's the industry standard for most workloads",
      "Mention cache hit rate as the key metric for evaluating cache effectiveness",
      "Redis allkeys-lru is the most common production configuration",
    ],
    practiceQuestions: [
      { question: "Your cache hit rate is only 60%. What could be wrong?", answer: "Possible issues: (1) Cache is too small — increase memory so fewer evictions occur. (2) TTL is too short — data expires before it's re-requested. (3) Bad cache key design — too granular (each user gets unique key) or wrong granularity. (4) Wrong eviction policy — try LFU if access pattern is skewed. (5) Working set is larger than cache — the data you're caching doesn't have good locality. (6) Cache warming — on startup, pre-populate with known hot data. Analyze access patterns to determine the root cause." },
    ],
    tags: ["eviction", "lru", "lfu", "cache-hit-rate", "redis"],
  },
  {
    id: "sd-cache-redis",
    chapterId: 4,
    title: "Redis Architecture & Use Cases",
    order: 3,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "Redis is an in-memory data structure store used as cache, database, message broker, and queue. It supports strings, hashes, lists, sets, sorted sets, streams, and HyperLogLog. Redis is single-threaded (for commands), gives sub-millisecond latency, and supports persistence (RDB snapshots, AOF log), replication, and clustering. It's used by virtually every large-scale system — from session storage to rate limiting to leaderboards. Here's the elephant in the room: Redis is often used as a database, but it's NOT a database. It's an in-memory store. If your Redis data exceeds your RAM budget, you're in trouble. At $7-15 per GB of RAM per month in the cloud, caching 1TB in Redis costs $7,000-15,000/month. Always calculate your expected data size BEFORE choosing Redis, and have a clear eviction/archival strategy.",
    keyPoints: [
      "In-memory: all data lives in RAM — sub-millisecond read/write latency",
      "Data structures: strings, hashes, lists, sets, sorted sets, streams, bitmaps",
      "Single-threaded commands: no locks needed, operations are atomic",
      "Persistence: RDB (point-in-time snapshots) and AOF (append-only log of every write)",
      "Redis Cluster: horizontal sharding across multiple nodes (16384 hash slots)",
      "Common use cases: caching, sessions, rate limiting, leaderboards, pub/sub, job queues",
      "HIDDEN GOTCHA: Redis KEYS command is O(N) and scans ALL keys. Running KEYS * on a production Redis with 10M keys will block ALL other operations for seconds (remember: single-threaded). This has caused real production outages. Use SCAN instead — it iterates incrementally without blocking. Configure 'rename-command KEYS \"\"' in production to prevent accidental use",
      "MOST DEVS DON'T KNOW: Redis memory usage is NOT just the data size. A small string key 'user:1' with value 'hello' uses ~90 bytes of overhead (pointers, metadata, SDS header, dict entry). For millions of small keys, overhead can be 5-10x the actual data. For small objects, use Redis hashes — HSET user:bucket:1 user:1 'hello' — hash encoding is much more memory-efficient (ziplist encoding under 128 entries)",
      "CRITICAL: Redis Pub/Sub is fire-and-forget. If a subscriber is disconnected when a message is published, that message is LOST. There are no queues, no persistence, no replay. For reliable messaging, use Redis Streams (XADD/XREAD with consumer groups) which provides persistence, acknowledgment, and replay from any point in time",
      "The Redlock controversy: Martin Kleppmann (Designing Data-Intensive Applications author) published a famous critique showing that Redis-based distributed locks can fail under clock skew, GC pauses, and network delays. Antirez (Redis creator) disagreed. The safe answer: Redis-based locks work for 'best-effort' mutual exclusion (preventing duplicate work). For truly safety-critical locking (financial operations), use a consensus-based system (ZooKeeper, etcd)",
    ],
    deepDive: [
      {
        title: "Redis Data Structures for System Design",
        content:
          "Sorted Sets for leaderboards: ZADD leaderboard 1500 'player1'. ZRANGEBYSCORE for top N. O(log N) insert and query. Streams for event sourcing: XADD stream * key value. Consumer groups for distributed processing. HyperLogLog for counting unique visitors: PFADD visitors 'user123'. Uses 12KB to count billions of unique items with < 1% error. Bitmaps for feature flags: SETBIT feature:darkmode user_id 1. Track feature rollout across millions of users using bits.",
      },
      {
        title: "Redis Cluster Architecture",
        content:
          "Redis Cluster divides the keyspace into 16,384 hash slots. Each node owns a subset of slots. CRC16(key) % 16384 determines which node holds a key. Supports automatic failover: each primary has 1+ replicas. If a primary fails, its replica is promoted. Minimum 6 nodes for a production cluster (3 primaries + 3 replicas).",
        diagram: `Redis Cluster:

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  Primary A   │  │  Primary B   │  │  Primary C   │
  │ slots 0-5460 │  │slots 5461-   │  │slots 10923-  │
  │              │  │     10922    │  │     16383    │
  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
         │                 │                 │
  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐
  │  Replica A'  │  │  Replica B'  │  │  Replica C'  │
  └──────────────┘  └──────────────┘  └──────────────┘`,
      },
      {
        title: "Redis vs Memcached — The Debate That's Already Over",
        content:
          "Memcached was the king of caching in the 2000s (Facebook's cache layer is built on it). Redis won the next decade. Here's why:\n\nMemcached advantages:\n▸ Multi-threaded: better at utilizing multi-core CPUs for simple GET/SET workloads\n▸ Simpler: less surface area = fewer bugs\n▸ Slab allocator: predictable memory allocation, less fragmentation\n\nRedis advantages (why it won):\n▸ Rich data structures: sorted sets, lists, hashes, streams — not just key-value\n▸ Persistence: RDB + AOF means data survives restarts\n▸ Replication: built-in primary-replica for HA\n▸ Clustering: built-in horizontal scaling\n▸ Lua scripting: atomic multi-step operations\n▸ Pub/Sub + Streams: messaging capabilities\n▸ Modules: RediSearch, RedisJSON, RedisTimeSeries extend functionality\n\nWhen to STILL use Memcached: If your workload is purely simple key-value GET/SET with very high concurrency (millions of QPS) and you don't need any of Redis's extra features. Facebook still uses Memcached because at their scale, the multi-threaded performance matters. They've heavily customized it (mcrouter for routing, TAO for graph caching).\n\nFor everyone else (99.9% of companies): use Redis. The ecosystem, tooling, and feature set make it the overwhelming default. The performance difference in simple caching scenarios is negligible for most workloads.",
      },
      {
        title: "Redis Persistence — The Choices That Keep You Up at Night",
        content:
          "RDB (Snapshotting):\n- Creates a point-in-time dump every N seconds or N writes\n- Fork + copy-on-write: Redis forks a child process, child writes dump to disk\n- Fast restart (just load the RDB file)\n- Data loss: everything since last snapshot (default: up to 60 seconds)\n- The gotcha: FORK on a 32GB Redis instance allocates 32GB of virtual memory. If your system has 32GB total RAM and no overcommit, the fork FAILS and you lose persistence. Set vm.overcommit_memory=1 in production.\n\nAOF (Append-Only File):\n- Logs every write operation: SET key value\n- Three fsync modes: always (every write), everysec (once per second), no (OS decides)\n- 'everysec' is the sane default — at most 1 second of data loss\n- AOF files are larger than RDB (they're a log of all operations)\n- AOF rewrite: periodically compacts the log (removes redundant operations)\n- The gotcha: AOF rewrite also forks. Same memory concern as RDB.\n\nThe production recommendation:\n▸ Use BOTH RDB + AOF. RDB for fast restarts + disaster recovery. AOF for minimal data loss.\n▸ Set appendonly yes + appendfsync everysec\n▸ Schedule RDB snapshots during off-peak hours\n▸ Back up RDB files to S3/GCS for disaster recovery\n▸ Monitor: INFO persistence shows last_bgsave_status and aof_last_write_status\n\nImportant: even with AOF, Redis is NOT a database replacement. Persistence is 'best effort' durability. For data that absolutely cannot be lost, the database is the source of truth; Redis is the cache.",
      },
    ],
    realWorldExamples: [
      { company: "Twitter", description: "Uses Redis to cache timelines. When you open Twitter, your home timeline is pre-computed and stored in a Redis sorted set, ordered by tweet timestamp. Avoids expensive DB queries on every page load." },
      { company: "GitHub", description: "Uses Redis for background job queues (Resque/Sidekiq), rate limiting, caching, and real-time features. Their Redis cluster handles millions of operations per second." },
    ],
    tradeOffs: [
      { optionA: "Redis (in-memory)", optionB: "Memcached", comparison: "Redis: rich data structures, persistence, replication, pub/sub. Memcached: simpler, multi-threaded (better for simple key-value at high concurrency), no persistence. Redis is the overwhelming default choice today." },
    ],
    interviewTips: [
      "Redis is the answer for almost any caching need — know its data structures",
      "Mention specific use cases with specific data structures: sorted sets for leaderboards, sets for unique counting",
      "Discuss Redis Cluster for horizontal scaling and Sentinel for HA",
    ],
    practiceQuestions: [
      { question: "How would you implement a real-time leaderboard for a game with 10 million players?", answer: "Redis Sorted Set. ZADD leaderboard score player_id on score update. ZREVRANGE leaderboard 0 99 WITHSCORES for top 100. ZREVRANK leaderboard player_id for a player's rank. All operations are O(log N) — fast even at 10M members. The entire leaderboard fits in ~200MB of RAM. Use Redis Cluster if you need multiple leaderboards or the single node capacity isn't enough. Persist with AOF for crash recovery." },
    ],
    tags: ["redis", "in-memory", "data-structures", "sorted-set", "caching"],
  },
  {
    id: "sd-cache-invalidation",
    chapterId: 4,
    title: "Cache Invalidation",
    order: 4,
    difficulty: "advanced",
    estimatedMinutes: 12,
    overview:
      "\"There are only two hard things in Computer Science: cache invalidation and naming things.\" — Phil Karlton. Cache invalidation is the process of removing or updating stale cached data when the source of truth (database) changes. Get it wrong and users see outdated data; be too aggressive and you lose the performance benefits of caching. The three main approaches are: TTL-based (time expiry), event-driven (invalidate on write), and versioned keys. The dirty secret of cache invalidation: perfect consistency between cache and database is IMPOSSIBLE without transactions spanning both (which defeats the purpose). Every caching system has a window of inconsistency. The real question is: how small can you make that window, and can your users tolerate it?",
    keyPoints: [
      "TTL-based: simplest — set an expiry time, accept staleness for that duration",
      "Event-driven: on DB write, delete/update the cache key explicitly — strong consistency",
      "Versioned keys: cache key includes a version (user:123:v5) — change version = instant invalidation",
      "Cache stampede: when a popular key expires, all requests hit DB simultaneously. Solution: lock or stale-while-revalidate.",
      "Write-through invalidation: write to DB + delete cache key (not update) — avoids race conditions",
      "CDC (Change Data Capture): database changes trigger cache invalidation events automatically",
      "HIDDEN GOTCHA — The 'delete then write' vs 'write then delete' ordering: If you delete cache then write DB, a concurrent read can repopulate cache with OLD data before the DB write completes. If you write DB then delete cache, concurrent readers might briefly read stale cache between DB write and cache delete. Solution: write DB → delete cache (this is safer because the stale window is tiny — just the time between DB commit and cache delete). Facebook does 'write DB then delete cache' for this reason",
      "MOST DEVS DON'T KNOW: Facebook's Memcached invalidation system processes 10+ BILLION cache invalidations per day across data centers. They use 'mcsqueal' — a daemon that tails MySQL's binlog (transaction log) and converts database changes to cache invalidation commands. This is CDC for cache invalidation at massive scale, and it's more reliable than application-level invalidation because it catches ALL writes, including direct SQL queries and batch jobs",
      "CRITICAL: Cache stampede has a cousin called 'cache avalanche' — when MANY keys expire at the same time (e.g., you set TTL=3600 for all keys during peak hour, and they all expire together). Solution: add random jitter to TTLs. Instead of TTL=3600, use TTL=3600+random(0,300). This spreads expirations over 5 minutes, preventing simultaneous DB hits",
      "Early expiration trick: calculate if the key is 'about to expire' (e.g., TTL remaining < 10% of original TTL), and probabilistically trigger a background refresh. This is called 'probabilistic early expiration' and it's used by systems like XFetch to prevent stampedes without explicit locks",
    ],
    deepDive: [
      {
        title: "The Cache Stampede Problem",
        content:
          "A product page is cached with TTL=60s. It gets 10,000 requests/sec. When the cache expires, all 10,000 requests simultaneously query the database for the same data — this can crash the DB. Solutions: (1) Mutex lock: first request acquires a lock, fetches from DB, updates cache. Others wait or get stale data. (2) Stale-while-revalidate: serve the expired cached data while one background request refreshes the cache. (3) Preemptive refresh: refresh the cache before TTL expires using a background job.",
      },
      {
        title: "Delete vs Update on Write",
        content:
          "When data changes, should you delete the cache key or update it? Always DELETE. Why? Imagine two concurrent writes: Write A (price=$10) and Write B (price=$15). If both try to UPDATE the cache, you might end up with Write A's value in cache ($10) even though Write B was the last DB write ($15) — a race condition. By DELETING, the next read will fetch the correct value from DB and repopulate the cache. Delete is always safe; update can corrupt.",
      },
      {
        title: "Cache Invalidation at Scale — The Facebook Approach",
        content:
          "Facebook's cache invalidation is the best-documented real-world system. Here's how they handle it at billions of operations per day:\n\n**Problem**: Facebook has Memcached clusters in multiple data centers (US-East, US-West, Europe). A user in US-East updates their profile photo. All cache clusters worldwide must invalidate the old photo URL.\n\n**Architecture**:\n1. Write goes to primary MySQL in US-East (leader)\n2. Within US-East: application deletes the cache key from local Memcached cluster\n3. Cross-region: mcsqueal daemon tails MySQL binlog in US-East, extracts the modified keys, publishes invalidation events to mcrouter in other regions\n4. US-West and Europe data centers receive invalidation events and delete from their local Memcached clusters\n\n**The 'remote marker' trick**: To handle the window between a write to US-East's DB and time it takes for the invalidation to reach US-West:\n- When US-East writes, it sets a 'remote marker' (a temporary key) in the remote region's Memcached\n- When a US-West user reads the data, if the remote marker exists, the read is routed to the US-East primary DB (not the local replica)\n- This ensures US-West users see fresh data even before replication catches up\n- The remote marker has a short TTL (20 seconds) and auto-expires\n\nThis system handles the inherent tension between: global cache consistency, cross-region latency, and the impossibility of distributed transactions across cache + DB + multiple regions.\n\nThe takeaway for interviews: mention that cache invalidation across multiple regions requires a cross-region invalidation bus (Kafka, custom daemon like mcsqueal), not point-to-point application logic.",
      },
      {
        title: "Versioned Cache Keys — The Simplest Invalidation Strategy",
        content:
          "Instead of invalidating cache keys, change the key itself.\n\nTraditional approach:\n- Cache key: product:123\n- On update: DELETE product:123 (invalidation)\n- Problem: cache stampede, race conditions, cross-service coordination\n\nVersioned approach:\n- Store current version in a fast lookup: version:product:123 → 7\n- Cache key: product:123:v7\n- On update: increment version to 8\n- New reads use key product:123:v8 (cache miss → fetch from DB → cache)\n- Old key product:123:v7 naturally expires via TTL\n- No explicit invalidation needed!\n\nWhy this works:\n▸ No race conditions: old and new versions coexist\n▸ No stampede: the old key still serves until it expires\n▸ No cross-service coordination: each service just reads the current version number\n▸ Rollback: if the update was bad, decrement the version to serve the old cached data\n\nThe cost: an extra Redis lookup for the version number (but version numbers can themselves be cached in local memory with a short TTL).\n\nThis pattern is used by: WordPress (cache busting via version numbers in URLs), CDN cache busting (style.css?v=abc123), and many microservice architectures where explicit invalidation is too complex.\n\nIn interviews, this is a strong alternative to mention when the discussion gets stuck on 'how to invalidate efficiently.' It sidesteps the invalidation problem entirely.",
      },
    ],
    realWorldExamples: [
      { company: "Facebook", description: "Uses a delete-on-write strategy with Memcached. When data changes, the cache key is deleted across all regional cache clusters. The next read fills the cache from the database. They also use lease tokens to prevent thundering herds." },
    ],
    tradeOffs: [
      { optionA: "TTL-based invalidation", optionB: "Event-driven invalidation", comparison: "TTL: simple, no coupling between write and cache, eventual consistency bounded by TTL. Event-driven: immediate consistency, more complex (must ensure every write path invalidates cache), risk of missed events." },
    ],
    interviewTips: [
      "Always mention cache invalidation as a challenge when you propose caching",
      "The 'delete-on-write, not update' principle is a strong talking point",
      "Discuss the cache stampede problem and solutions (mutex, stale-while-revalidate)",
    ],
    practiceQuestions: [
      { question: "Your cached product prices are showing stale data after a price update. How do you fix it?", answer: "Event-driven invalidation: on price update, DELETE the cache key (don't update). Next read fetches fresh data from DB and populates cache. Also set a reasonable TTL as a safety net (e.g., 5 minutes) so even if the event is missed, the cache eventually refreshes. For critical data like prices, add a version in the cache key (product:123:v7) and increment the version on update. To prevent cache stampede on popular products, use a mutex or stale-while-revalidate pattern." },
    ],
    tags: ["cache-invalidation", "ttl", "stampede", "consistency", "delete-on-write"],
  },
  {
    id: "sd-cache-cdn-caching",
    chapterId: 4,
    title: "CDN & Multi-Layer Caching",
    order: 5,
    difficulty: "intermediate",
    estimatedMinutes: 10,
    overview:
      "Production systems use multiple caching layers: browser cache, CDN edge cache, API gateway cache, application-level cache (Redis), and database query cache. Each layer reduces load on the layers below it. Understanding Cache-Control headers (max-age, s-maxage, no-cache, private, public, stale-while-revalidate) is essential for controlling caching behavior across these layers. The insight that transforms how you think about caching: each layer should be designed to absorb 80-95% of the traffic that reaches it. If browser cache handles 80% of requests, CDN handles 90% of what's left, and Redis handles 95% of what reaches the server — then only 0.1% of original traffic hits your database. This multiplicative effect is why multi-layer caching is so powerful.",
    keyPoints: [
      "Browser cache: Cache-Control: max-age=3600 — browser serves locally for 1 hour",
      "CDN cache: Cache-Control: s-maxage=86400 — CDN caches for 24 hours even if browser TTL differs",
      "Application cache: Redis/Memcached — for dynamic data that's expensive to compute",
      "Database cache: query cache / buffer pool — automatic, managed by DB engine",
      "private vs public: private (for one user, not CDN-cacheable) vs public (CDN-cacheable)",
      "stale-while-revalidate: serve stale while fetching fresh in background — best UX",
      "HIDDEN GOTCHA: 'no-cache' does NOT mean 'don't cache.' It means 'cache it, but revalidate with the origin before serving.' 'no-store' means don't cache at all. This naming confusion has caused countless bugs where developers set 'no-cache' thinking they're preventing caching, but browsers and CDNs still store and serve the content (with revalidation). For truly never-cache content: Cache-Control: no-store, no-cache, must-revalidate, max-age=0",
      "MOST DEVS DON'T KNOW: The ETag/If-None-Match flow saves bandwidth without sacrificing freshness. Server sends ETag: 'abc123' with the response. Browser caches the response. On next request, browser sends If-None-Match: 'abc123'. If content hasn't changed, server returns 304 Not Modified (no body, just headers). This means the browser ALWAYS checks with the server, but only downloads the full response when content actually changed. Perfect for API responses that change infrequently",
      "CRITICAL: Cache-Control: immutable tells browsers the content will NEVER change at this URL. Use it for fingerprinted assets (main.abc123.js). Without 'immutable', browsers still revalidate on page reload even with long max-age. With 'immutable', the browser trusts the cache completely — zero network requests for that asset. This is a significant UX improvement on slow connections",
      "The Vary header trap: Vary: Accept-Encoding tells CDNs to cache separate versions for different encodings (gzip, brotli). But Vary: Cookie tells CDNs to cache a separate version for EACH unique cookie value — effectively making the CDN cache useless (every user has different cookies). Never set Vary: Cookie on CDN-cached content",
    ],
    deepDive: [
      {
        title: "Multi-Layer Cache Architecture",
        content:
          "A request travels through: Browser → CDN → Load Balancer → API Gateway → App Server → Redis → Database. Each layer checks its cache before passing the request down. 80% of requests might be served from browser cache. Of the remaining 20%, 90% might hit CDN. Of those that reach your servers, 95% might hit Redis. Only a tiny fraction actually touches the database. This is how companies serve millions of QPS with modest database infrastructure.",
        diagram: `Multi-Layer Cache:

  Browser Cache (max-age)
       │ MISS
       ▼
  CDN Edge Cache (s-maxage)
       │ MISS
       ▼
  API Gateway Cache
       │ MISS
       ▼
  Application Cache (Redis)
       │ MISS
       ▼
  Database (query cache + buffer pool)

  Each layer absorbs 80-95% of requests`,
      },
      {
        title: "Cache-Control Headers — The Complete Guide",
        content:
          "These headers control caching behavior across ALL layers. Getting them wrong causes stale data bugs that are incredibly hard to debug.\n\n**For static assets** (JS, CSS, images with content hashes in filename):\nCache-Control: public, max-age=31536000, immutable\n- Cache for 1 year. 'immutable' means browser won't revalidate. Deploy new files with new hashes.\n\n**For HTML pages** (must always be fresh):\nCache-Control: no-cache\n- Browser and CDN cache it, but ALWAYS revalidate with server before serving. Server can return 304 if unchanged.\n\n**For authenticated API responses** (user-specific data):\nCache-Control: private, max-age=60, stale-while-revalidate=300\n- 'private' = CDN must NOT cache. Browser caches for 60s. After 60s, serve stale while revalidating for up to 300s.\n\n**For public API responses** (shared data like product listings):\nCache-Control: public, s-maxage=300, stale-while-revalidate=60\n- CDN caches for 5 minutes ('s-maxage' overrides 'max-age' for shared caches). Serve stale for 60s after expiry while refreshing.\n\n**For sensitive data** (banking, medical):\nCache-Control: no-store, no-cache, must-revalidate, max-age=0\nPragma: no-cache\n- Never cache anywhere. Period. Include Pragma for HTTP/1.0 compatibility.\n\nThe debugging trick: use curl -I (headers only) to check what Cache-Control your server actually sends. Then check your CDN's cache status header (e.g., CF-Cache-Status for Cloudflare: HIT, MISS, EXPIRED, DYNAMIC). Many caching bugs are caused by a mismatch between what you THINK you're sending and what you ACTUALLY send.",
      },
      {
        title: "Local (In-Process) Cache — The Forgotten Layer",
        content:
          "Everyone talks about Redis caching. Almost nobody talks about local in-process caching, which can be 100x faster.\n\nRedis round-trip: ~1-5ms (network + serialization)\nLocal HashMap lookup: ~0.001ms (no network, no serialization)\n\nFor data that's read millions of times and changes rarely (feature flags, configuration, translation strings, rate limit rules), a local in-memory cache with a 30-60 second TTL is dramatically faster than Redis.\n\nThe pattern:\n1. On startup: load data into a local HashMap/Map from DB or Redis\n2. On read: check local cache first → Redis → DB\n3. Refresh: a background timer refreshes local cache every 30 seconds from Redis/DB\n4. Invalidation: on write, update DB + Redis + publish event. Each server's background listener refreshes local cache on event.\n\nLibraries: Caffeine (Java — used by LinkedIn), node-cache (Node.js), @github/mini_cache (Ruby).\n\nThe gotcha: local cache is PER SERVER. If you have 20 servers, each has its own cache. They can be out of sync for up to the refresh interval. This is fine for configuration data but NOT fine for frequently-changing user data.\n\nThe advanced pattern: two-tier caching. Local cache (L1, 30s TTL) → Redis (L2, 5min TTL) → Database. L1 cache handles 99% of reads with zero network overhead. L2 handles L1 misses. DB is the last resort. This is how high-throughput systems like LinkedIn serve millions of QPS without proportionally scaling Redis.",
      },
    ],
    realWorldExamples: [
      { company: "Vercel/Next.js", description: "Uses stale-while-revalidate (ISR — Incremental Static Regeneration). Pages are served from CDN edge cache instantly. When the cache is stale, the next request triggers a background regeneration. Users always get a fast response." },
    ],
    tradeOffs: [
      { optionA: "Aggressive caching (long TTLs)", optionB: "Conservative caching (short TTLs)", comparison: "Aggressive: highest performance, users may see stale data longer, harder to push urgent updates. Conservative: more origin hits, data is fresher, higher infrastructure cost, better for dynamic content." },
    ],
    interviewTips: [
      "Draw the multi-layer cache architecture when discussing any read-heavy system",
      "Know Cache-Control headers — they're the interface between your app and the caching layers",
      "Mention stale-while-revalidate as a modern best practice for UX",
    ],
    practiceQuestions: [
      { question: "How do you cache an API response that is different per user?", answer: "Use Cache-Control: private, max-age=300. The 'private' directive tells CDNs NOT to cache it (it's user-specific), but the browser can cache it for 5 minutes. For the application layer, use Redis with cache keys that include the user_id: cache:user:123:dashboard. CDN caching works for shared content but NOT for personalized data — a common mistake is caching user-specific responses in a public CDN and leaking one user's data to another." },
    ],
    tags: ["cdn-caching", "cache-control", "multi-layer", "stale-while-revalidate", "browser-cache"],
  },
];
