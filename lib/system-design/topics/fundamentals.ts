import { SDTopic } from "../types";

export const fundamentalsTopics: SDTopic[] = [
  {
    id: "sd-fund-scalability",
    chapterId: 1,
    title: "Scalability: Vertical vs Horizontal",
    order: 1,
    difficulty: "beginner",
    estimatedMinutes: 12,
    overview:
      "Scalability is a system's ability to handle growing amounts of work. Vertical scaling (scale up) means adding more power to an existing machine — more CPU, RAM, or storage. Horizontal scaling (scale out) means adding more machines to distribute the load. Most real-world systems use horizontal scaling because it has no ceiling and provides fault tolerance. The key challenge is making your application stateless so any machine can handle any request. But here's what most engineers miss: scaling isn't just about 'adding servers.' The real bottleneck is almost always the database, not the application tier. You can spin up 100 app servers in minutes, but if they all hammer one PostgreSQL instance, you've just created a 100-headed DDoS attack against your own database.",
    keyPoints: [
      "Vertical scaling has a hardware ceiling — there's a limit to how much RAM/CPU one machine can have",
      "Horizontal scaling is theoretically unlimited but requires distributed system design",
      "Stateless services are easier to scale horizontally — no server affinity needed",
      "Session data should be externalized (Redis, DB) to enable horizontal scaling",
      "Databases are hardest to scale — start with read replicas, then consider sharding",
      "Auto-scaling groups can add/remove instances based on metrics (CPU, request count)",
      "HIDDEN GOTCHA: Connection pooling is the silent killer — 100 app servers × 20 connections each = 2,000 DB connections. PostgreSQL starts choking at ~500 connections. You NEED a connection pooler like PgBouncer between your app and DB",
      "Amdahl's Law means if 5% of your code is serial (not parallelizable), you can NEVER get more than 20x speedup no matter how many servers you add",
      "The thundering herd problem: when a cache key expires and 10,000 servers simultaneously hit the DB for the same data. Use request coalescing (singleflight pattern) or cache stampede protection",
      "Scaling is NOT linear — at 10x traffic you don't just need 10x servers. You need to think about shared resources: DB connections, lock contention, DNS resolution, TLS handshake overhead",
    ],
    deepDive: [
      {
        title: "Vertical Scaling (Scale Up)",
        content:
          "Vertical scaling is the simplest approach: upgrade the server. Move from 4GB RAM to 64GB, from 2 cores to 32 cores. It's the right choice initially because it requires zero code changes. Most startups should scale vertically until they can't. AWS instances go up to 24TB RAM (u-24tb1.metal). The problem is that it creates a single point of failure and has diminishing returns — doubling hardware rarely doubles performance due to Amdahl's Law.\n\nWhat most devs don't know: vertical scaling goes WAY further than people think. Stack Overflow serves 1.3 BILLION page views/month on just 9 web servers. Wikipedia serves all of English Wikipedia from servers with 512GB RAM where the entire database fits in memory. Before you jump to horizontal scaling, ask: 'Have I actually maxed out what one really good server can do?' Usually the answer is no — you just have unoptimized queries, missing indexes, or no caching layer.",
      },
      {
        title: "Horizontal Scaling (Scale Out)",
        content:
          "Horizontal scaling adds more identical servers behind a load balancer. Each server handles a fraction of the traffic. This approach is what companies like Google, Netflix, and Amazon use. The prerequisites are: (1) stateless application servers, (2) centralized session/state storage, (3) a load balancer to distribute requests, (4) shared-nothing architecture where each node operates independently.\n\nThe trap nobody warns you about: 'stateless' is harder than it sounds. Here are things that secretly make your server stateful: in-memory caches (each server has a different cache), file system writes (uploaded files land on one server), WebSocket connections (client is bound to one server), cron jobs (if every server runs the cron, you get duplicates), and rate limiting counters (per-server counts mean a user gets N × servers limit). Every one of these needs to be externalized: cache → Redis, files → S3, WebSockets → sticky sessions or Redis Pub/Sub, cron → distributed lock, rate limiting → Redis counter.",
        diagram: `┌──────────────────────────────────────────┐
│              Load Balancer               │
└──────┬──────────┬──────────┬─────────────┘
       │          │          │
   ┌───▼───┐  ┌──▼────┐  ┌─▼─────┐
   │Server1│  │Server2│  │Server3│
   └───┬───┘  └──┬────┘  └─┬─────┘
       │         │          │
       └─────────┼──────────┘
                 │
          ┌──────▼──────┐
          │  Shared DB   │
          │  + Cache     │
          └─────────────┘`,
      },
      {
        title: "When to Use Which",
        content:
          "Start vertical. It's simple, cheap, and fast. Scale vertically until: (1) you need fault tolerance (single server = single point of failure), (2) you hit hardware limits, (3) you need geographic distribution, or (4) your response times degrade under load. Then introduce horizontal scaling at the web tier first (stateless API servers are easiest), then the cache tier, and finally the database tier (hardest).",
      },
      {
        title: "The Database Connection Crisis Nobody Talks About",
        content:
          "Here's what kills most systems when they first scale horizontally: database connections. Each app server opens a connection pool to the database — typically 10-20 connections. With 5 servers, that's 100 connections. Fine. But auto-scaling kicks in and now you have 50 servers → 1,000 connections. PostgreSQL performance DEGRADES after ~300-500 connections because each connection is a separate OS process consuming ~10MB RAM.\n\nThe solution: PgBouncer or RDS Proxy. These connection poolers sit between your app and database. 50 app servers with 20 connections each → PgBouncer → 50 actual DB connections. PgBouncer multiplexes requests using transaction-level pooling. This is not optional at scale — it's mandatory. If you're using AWS RDS, RDS Proxy does this automatically but adds ~1ms latency.\n\nAnother gotcha: ORMs love to hold connections open during HTTP requests. A slow API endpoint that takes 2 seconds holds a DB connection for 2 seconds. Under load, you run out of connections. Solution: use connection timeouts (statement_timeout) and set pool checkout timeouts aggressively.",
        diagram: `Without PgBouncer:
  Server 1 (20 conn) ─┐
  Server 2 (20 conn) ─┤
  Server 3 (20 conn) ─┼──► PostgreSQL (60 connections)
  ...                  │    (starts dying at ~500)
  Server 50 (20 conn)─┘    = 1,000 connections 💀

With PgBouncer:
  Server 1 (20 conn) ─┐
  Server 2 (20 conn) ─┤
  Server 3 (20 conn) ─┼──► PgBouncer ──► PostgreSQL
  ...                  │    (multiplexes    (50 real
  Server 50 (20 conn)─┘     to 50 conn)    connections) ✓`,
      },
      {
        title: "The Thundering Herd Problem",
        content:
          "Picture this: you have a cache key 'top_products' with a 60-second TTL. At 10:01:00, the TTL expires. You have 200 app servers. ALL 200 servers simultaneously discover the cache miss and ALL 200 hit the database with the exact same query. Your DB just got 200 identical queries in the same millisecond. That's a thundering herd.\n\nSolutions that pro engineers use:\n\n1. Request coalescing (singleflight): The first server to see the cache miss fetches from DB. All other servers wait for that one result. Go has sync/singleflight. In Node.js, you implement this with a shared Promise.\n\n2. Stale-while-revalidate: Serve the stale cached value while ONE background process refreshes it. Users never see a cache miss.\n\n3. Cache stampede protection with locking: On miss, try to acquire a Redis lock. Only the lock holder fetches from DB. Others wait or serve stale data.\n\n4. Jittered TTL: Instead of all keys expiring at the same time, add random jitter: TTL = 60 + random(0, 10) seconds. Spreads expirations over time.\n\nThis is one of those things that works fine in dev (1 server) and explodes in production (hundreds of servers).",
      },
      {
        title: "Scaling Is Not Linear — The Hidden Costs",
        content:
          "Most engineers think: '10x traffic = 10x servers = 10x cost.' Wrong. Here's why scaling has superlinear costs:\n\n1. Coordination overhead: More servers = more connections to shared resources (DB, cache, queues). At some point, the shared resource becomes the bottleneck.\n\n2. Tail latency amplification: If your app calls 10 backend services, your overall P99 latency is roughly the WORST P99 across all services. More services = worse tail latency.\n\n3. Data duplication: Horizontal scaling often requires denormalization and data replication (read replicas, cache, search index). You're paying for multiple copies.\n\n4. Observability cost: 10x servers = 10x logs, 10x metrics, 10x traces. Your monitoring bill scales with your infrastructure.\n\n5. The 'works on my machine' problem: With 100 servers, race conditions that were invisible at 1 server become daily occurrences. Distributed debugging is 100x harder than single-server debugging.\n\nRule of thumb: 10x traffic costs 15-30x in total infrastructure when you account for supporting systems, not just compute.",
      },
    ],
    realWorldExamples: [
      {
        company: "Stack Overflow",
        description:
          "Handles 1.3 billion page views/month with just 9 web servers. They scale vertically with powerful hardware (512GB RAM servers) and optimize aggressively. Proof that vertical scaling works far longer than most engineers assume.",
      },
      {
        company: "Netflix",
        description:
          "Runs thousands of horizontally scaled microservices on AWS. Each service auto-scales independently based on traffic patterns. Their architecture handles 250+ million subscribers streaming simultaneously.",
      },
    ],
    tradeOffs: [
      {
        optionA: "Vertical Scaling",
        optionB: "Horizontal Scaling",
        comparison:
          "Vertical: simple, no code changes, single point of failure, hardware ceiling. Horizontal: complex, requires distributed design, fault tolerant, unlimited growth.",
      },
    ],
    interviewTips: [
      "Always mention BOTH approaches and explain why horizontal is preferred for scale",
      "Point out that stateless services are a prerequisite for horizontal scaling",
      "Mention that databases are the hardest tier to scale horizontally",
      "Use real numbers: 'a single beefy server can handle X, but for Y we need to scale out'",
    ],
    practiceQuestions: [
      {
        question: "Your single-server app is getting 10x more traffic next month. What's your scaling plan?",
        answer:
          "First, check if vertical scaling works: upgrade CPU/RAM and optimize code (indexing, caching). If the server is already maxed out or you need fault tolerance, introduce horizontal scaling: put 3+ stateless API servers behind a load balancer, externalize sessions to Redis, and add read replicas for the database. Use auto-scaling to handle traffic spikes.",
      },
      {
        question: "Why can't you just horizontally scale a database like you scale web servers?",
        answer:
          "Web servers are stateless — any server can handle any request. Databases hold state (data) that must be consistent across nodes. Horizontal database scaling requires solving: data partitioning (sharding), cross-shard queries, distributed transactions, rebalancing when nodes are added, and consistency vs availability trade-offs (CAP theorem). This is fundamentally harder than routing HTTP requests.",
      },
    ],
    tags: ["scalability", "horizontal", "vertical", "auto-scaling", "stateless"],
  },
  {
    id: "sd-fund-latency-throughput",
    chapterId: 1,
    title: "Latency vs Throughput",
    order: 2,
    difficulty: "beginner",
    estimatedMinutes: 10,
    overview:
      "Latency is the time it takes for a single operation to complete (measured in ms). Throughput is the number of operations a system handles per unit of time (measured in requests/sec or queries/sec). They're related but not the same — you can have low latency with low throughput (a single fast worker) or high throughput with high latency (batch processing). In system design, you typically optimize for one while keeping the other within acceptable bounds. Here's the secret most engineers miss: you can often improve BOTH by eliminating waste (unnecessary network hops, serial processing, blocking I/O), but at some point optimizing one degrades the other. The real skill is knowing WHERE that crossover point is for your specific system.",
    keyPoints: [
      "Latency = time per single operation (lower is better)",
      "Throughput = operations per second (higher is better)",
      "Network latency: same datacenter ~0.5ms, cross-continent ~150ms",
      "Disk latency: SSD read ~100μs, HDD seek ~10ms, memory ~100ns",
      "Adding more servers increases throughput but doesn't reduce latency",
      "Caching reduces latency; queuing increases throughput",
      "P99 latency matters more than average — tail latencies affect real users",
      "CRITICAL: Tail latency AMPLIFICATION — if your service calls 10 backends, the overall P99 ≈ worst P99 across all 10. With 5 services at 99th %ile = 50ms, you've got a 1-(0.99^5) = 5% chance at least ONE is slow = your P95 is 50ms, not your P99",
      "Coordinated omission: most latency benchmarks are WRONG because they don't account for queuing. If you send one request per second and one takes 3 seconds, the NEXT 2 requests are also delayed — but most benchmarks don't count that waiting time",
      "Bandwidth ≠ throughput. A 10Gbps pipe (bandwidth) can have 50ms latency. Bandwidth determines MAX throughput; latency determines MIN response time. You can be bandwidth-limited OR latency-limited",
      "Nagle's algorithm: TCP batches small packets into one larger packet for efficiency. Great for throughput, terrible for latency. Redis, databases, and game servers disable it (TCP_NODELAY) because every millisecond counts",
    ],
    deepDive: [
      {
        title: "Latency Numbers Every Engineer Should Know",
        content:
          "L1 cache reference: 0.5ns. Main memory reference: 100ns. SSD random read: 150μs. HDD seek: 10ms. Same-datacenter round trip: 500μs. California → Netherlands: 150ms. These numbers shape every design decision. If your service makes 5 sequential database calls at 5ms each, that's 25ms of latency just from DB — before any computation.\n\nThe insight most people miss: these numbers haven't changed much in 20 years for network latency (speed of light is the limit), but have improved dramatically for storage (NVMe SSDs are 100x faster than HDDs). This means NETWORK is now the dominant latency factor, not disk. Design your system to minimize network round trips, not disk reads. This is why colocation matters — keeping services in the same datacenter (or even the same rack) is more impactful than upgrading to faster storage.",
        diagram: `Latency at a Human Scale (1ns = 1 second):

  L1 cache ............. 0.5 sec
  L2 cache ............. 7 sec
  Main memory .......... 1.7 min
  SSD read ............. 1.7 days
  HDD seek ............. 116 days
  CA → NL round trip ... 4.8 years
  
  Key insight: the jump from memory to SSD 
  is 1,500x. The jump from SSD to network 
  (cross-continent) is another 1,000x.`,
      },
      {
        title: "P50, P95, P99 — Tail Latencies",
        content:
          "Average latency is misleading. If 99 requests take 10ms but 1 request takes 5,000ms, the average is 59ms — but that 1% of users has a terrible experience. Amazon found that every 100ms of latency costs 1% in sales. Report P50 (median), P95 (95th percentile), and P99 (99th percentile). The gap between P50 and P99 reveals system bottlenecks: garbage collection pauses, lock contention, slow downstream services.\n\nWhat most engineers get wrong: they measure latency at the SERVER but users experience latency at the CLIENT. Client-side latency includes: DNS resolution (20-120ms on miss), TCP handshake (1 RTT), TLS handshake (1-2 RTTs), time-to-first-byte (server processing), content transfer, and client-side rendering. A server that responds in 5ms can appear to take 200ms to the user due to network overhead. This is why CDNs and edge computing exist — to reduce the number of round trips between client and server.",
      },
      {
        title: "Tail Latency Amplification — The Hidden Killer",
        content:
          "This is THE most important latency concept that junior engineers miss. Imagine your service calls 5 backend services in parallel to assemble a response (common in microservices). Each backend has P99 = 50ms. What's YOUR service's P99?\n\nNaively: also 50ms. WRONG.\n\nYour request is only as fast as the SLOWEST backend. The probability that ALL 5 finish under 50ms = 0.99^5 = 95%. So your P95 is 50ms, and your P99 is much higher. With 50 parallel calls: 0.99^50 = 60.5%. Your P99 is now dominated by tail latencies of backends.\n\nThis is why Google obsesses over P999 (99.9th percentile) for their internal services. If you call 1,000 services per user request (Google scale), even P999 = 50ms means 63% of requests hit at least one slow backend.\n\nSolutions: (1) Hedged requests — send the same request to 2 backends, take the first response. Burns 2x resources but dramatically cuts tail latency. (2) Tiered timeouts — set aggressive timeouts per backend and return partial results. (3) Request coalescing — batch multiple requests to the same backend. Google Cloud Spanner and Amazon's Dynamo both use hedged requests internally.",
        diagram: `Tail Latency Amplification:

  Your Service calls 5 backends in parallel:
  
  Backend A: P99 = 50ms
  Backend B: P99 = 50ms  
  Backend C: P99 = 50ms
  Backend D: P99 = 50ms
  Backend E: P99 = 50ms
  
  P(ALL 5 under P99) = 0.99^5 = 95%
  → Your P95 ≈ 50ms (not your P99!)
  → Your P99 is MUCH worse
  
  With 50 backends: 0.99^50 = 60.5%
  → 40% of requests hit at least one tail!`,
      },
      {
        title: "Bandwidth vs Latency — Why Your Downloads Are Slow",
        content:
          "Most people confuse bandwidth and latency. Bandwidth is how MUCH data you can transfer per second (like the width of a pipe). Latency is how LONG one piece of data takes to travel (like the length of the pipe).\n\nA satellite internet link has 100Mbps bandwidth but 600ms latency. A local ethernet has 1Gbps bandwidth and 0.1ms latency. For transferring a 1GB file, the satellite is fine (10 seconds transfer). For a database query, the satellite is unusable (600ms round trip PER query).\n\nThe bandwidth-delay product tells you how much data is 'in flight': bandwidth × latency. A 1Gbps link with 100ms RTT has 12.5MB in flight. TCP's congestion window must be at least this large to fully utilize the link. This is why TCP slow start hurts short connections — by the time the window ramps up, the transfer is done.\n\nPractical implication: for chatty protocols (HTTP/1.1 with many small requests), latency dominates. For bulk transfers (file uploads, database dumps), bandwidth dominates. HTTP/2 multiplexing and pipelining exist specifically to convert chatty patterns into bulk patterns.",
      },
      {
        title: "Coordinated Omission — Why Your Benchmarks Lie",
        content:
          "Gil Tene (Azul Systems) identified a fundamental flaw in how most tools measure latency, called 'coordinated omission.' Here's the problem:\n\nImagine you send one request per second and measure response times. Request 1: 1ms. Request 2: 3,000ms (a GC pause). Request 3: 1ms. Your benchmark reports: avg = 1,001ms, P99 = 3,000ms.\n\nBut that's WRONG. During the 3-second pause, requests 3 and 4 were WAITING to be sent but couldn't (because the benchmark waits for each response before sending the next). Those requests experienced 2,000ms and 1,000ms of waiting time that never got measured.\n\nMost load testing tools (wrk, ab, JMeter in default mode) make this mistake. They coordinate with the system under test — slowing down when the system slows down. HdrHistogram (by Tene) and tools like vegeta, k6, and Locust in constant-rate mode avoid this.\n\nSticky takeway: if your P99 looks 'too good,' your benchmark might have coordinated omission. Always use constant-rate load generators for accurate latency measurement.",
      },
    ],
    realWorldExamples: [
      {
        company: "Amazon",
        description:
          "Every 100ms increase in page load time costs them ~1% in revenue. They obsess over P99 latency and use pre-computed responses, edge caching, and predictive prefetching.",
      },
      {
        company: "Google",
        description:
          "Search results load in ~200ms. They shard queries across thousands of machines and merge results — optimizing for BOTH latency (fast response) and throughput (billions of queries/day).",
      },
    ],
    tradeOffs: [
      {
        optionA: "Optimize for Latency",
        optionB: "Optimize for Throughput",
        comparison:
          "Latency optimization: caching, CDNs, fewer network hops, pre-computation, keep data close to compute. Throughput optimization: batching, async processing, message queues, horizontal scaling. Real systems need both — define SLOs for each.",
      },
    ],
    interviewTips: [
      "Always define latency SLOs: 'reads should be < 200ms P99'",
      "Mention tail latencies (P99) — shows you understand production systems",
      "Use back-of-envelope math: 'if we read from DB at 5ms per query and make 3 calls, that's 15ms minimum'",
      "Know the approximate latency of common operations (memory, SSD, network)",
    ],
    practiceQuestions: [
      {
        question: "You need to serve user profile data with < 50ms latency. The database query takes 20ms. How?",
        answer:
          "Use a cache (Redis/Memcached) in front of the database. Cache reads are ~1ms vs 20ms for DB. Set a TTL for freshness. Use cache-aside pattern: check cache first, on miss hit DB and populate cache. For even lower latency, use a local in-memory cache (< 0.1ms) with a shorter TTL. This brings P99 down to ~2-5ms for cache hits.",
      },
    ],
    tags: ["latency", "throughput", "p99", "performance", "slo"],
  },
  {
    id: "sd-fund-cap-theorem",
    chapterId: 1,
    title: "CAP Theorem",
    order: 3,
    difficulty: "intermediate",
    estimatedMinutes: 15,
    overview:
      "The CAP theorem states that a distributed system can only guarantee two out of three properties: Consistency (every read gets the most recent write), Availability (every request gets a response), and Partition tolerance (the system works despite network failures between nodes). Since network partitions are inevitable in distributed systems, the real choice is between Consistency and Availability during a partition. CP systems (like HBase, MongoDB with strong reads) reject requests during partitions to stay consistent. AP systems (like Cassandra, DynamoDB) serve potentially stale data to stay available. But here's the thing most people get wrong about CAP: it ONLY applies during a network partition. During normal operation, you CAN have both consistency and availability. That's why PACELC is a better framework — it asks: what do you trade-off when there IS a partition, AND what do you trade-off when there ISN'T?",
    keyPoints: [
      "C = Consistency: every read receives the most recent write or an error",
      "A = Availability: every request receives a non-error response (may be stale)",
      "P = Partition tolerance: system continues operating despite network splits",
      "Network partitions are INEVITABLE — so the real trade-off is C vs A",
      "CP systems: prioritize consistency, may reject requests during partitions (banking, inventory)",
      "AP systems: prioritize availability, may serve stale data (social media feeds, DNS)",
      "PACELC extends CAP: when no Partition, choose between Latency and Consistency",
      "MOST MISUNDERSTOOD: CAP doesn't mean you have to choose GLOBALLY. Different parts of your system can make different choices. User auth → CP. Like counts → AP. This is called 'fine-grained consistency'",
      "The word 'consistency' means DIFFERENT things in CAP vs ACID. CAP consistency = linearizability (every read sees the latest write across all replicas). ACID consistency = data satisfies all constraints/rules. Don't confuse them in interviews",
      "CA systems (without partition tolerance) exist only in single-node databases. The moment you add a second node, you MUST handle partitions. This is why 'pick 2 of 3' is misleading — P is not optional",
      "MongoDB is often called CP, but by default it uses eventual consistency for reads. You have to explicitly request readConcern: 'majority' and writeConcern: 'majority' for CP behavior. Default MongoDB is actually closer to AP!",
    ],
    deepDive: [
      {
        title: "Understanding the Trade-off",
        content:
          "Imagine two database nodes: Node A in US, Node B in Europe. A user writes data to Node A. Before it replicates to Node B, the network link breaks (partition). Now a user reads from Node B. Two choices: (1) CP: Node B refuses the read, returns an error → consistent but unavailable. (2) AP: Node B returns the last known value → available but potentially stale. There is NO option where both always work during a partition.",
        diagram: `Network Partition Scenario:

  ┌────────┐    ✕ broken ✕    ┌────────┐
  │ Node A │ ───────────────── │ Node B │
  │ (US)   │                   │ (EU)   │
  └───┬────┘                   └────┬───┘
      │                              │
  Write: x=5                    Read: x=?
                                
  CP: Node B → ERROR (won't serve stale data)
  AP: Node B → x=3   (serves last known value)`,
      },
      {
        title: "Beyond CAP: PACELC",
        content:
          "CAP only talks about behavior during partitions. PACELC adds: even when there's no partition (normal operation), there's a trade-off between Latency and Consistency. Synchronous replication = consistent but slower. Asynchronous replication = faster but may be inconsistent. Example: DynamoDB is PA/EL — during partition it's Available; when everything's fine it favors Latency over strict Consistency.\n\nSpanner (Google) is the weird one: PC/EC — it's consistent even during partitions, AND consistent during normal operation. How? Custom hardware. Google installs atomic clocks and GPS receivers in every datacenter to get globally synchronized time (TrueTime), which lets them order transactions globally without the latency of consensus protocols. Nobody else can do this — it requires Google-level infrastructure.",
      },
      {
        title: "Linearizability vs Serializability — The Confusion That Trips Everyone Up",
        content:
          "These sound similar but are completely different concepts:\n\nLinearizability (CAP's 'C'): A single-object guarantee. If I write x=5 at time T1, any read after T1 from ANY node returns 5. It's about recency — getting the latest value. Think 'real-time mirror.' Every replica looks identical to a single global copy.\n\nSerializability (ACID's 'I'): A multi-object guarantee. Transactions execute as if they ran one at a time (serial order). Two bank transfers don't corrupt each other. It's about isolation — transactions don't interfere.\n\nYou can have one without the other:\n- Linearizable but not serializable: single key-value reads/writes are always fresh, but no multi-key transactions.\n- Serializable but not linearizable: transactions are isolated, but you might read slightly stale data.\n- Both (strict serializability): the gold standard. Google Spanner, CockroachDB.\n\nIn interviews, when you say 'consistency,' specify WHICH one. The interviewer will be impressed.",
      },
      {
        title: "Real-World CAP Classifications — The Nuances",
        content:
          "Everyone says 'Cassandra is AP, MongoDB is CP.' The truth is messier:\n\n- PostgreSQL (single node): CA — fully consistent and available, but a single-node DB isn't distributed, so partition tolerance doesn't apply. Add streaming replication → becomes CP if synchronous, AP if asynchronous.\n\n- MongoDB: Configurable. Default (w:1, readConcern: local) behaves like AP. With (w:majority, readConcern: majority) it's CP. Most tutorials use the default, so most MongoDB deployments are actually AP without realizing it.\n\n- Cassandra: Also configurable. With quorum reads/writes (CL=QUORUM), it's CP. With CL=ONE, it's AP. The TUNABLE consistency is the key selling point.\n\n- DynamoDB: AP by default (eventually consistent reads). Supports strongly consistent reads per-query (costs 2x). Global Tables are always eventually consistent across regions.\n\n- Redis Cluster: AP for data operations (async replication means writes can be lost during failover). Redis Sentinel provides CP-like behavior for the failover process itself.\n\nLesson: don't label entire databases as CP or AP. The behavior depends on configuration and even per-query settings. This nuance shows deep understanding in interviews.",
      },
      {
        title: "Network Partitions in the Real World",
        content:
          "Partitions sound theoretical but happen regularly:\n\n- 2017: Amazon S3 had a 4-hour outage because a misconfigured network switch created a partition within S3's subsystem. Half the internet went down because everything depends on S3.\n\n- GitHub experiences partial network partitions between datacenters that cause Raft leader elections in MySQL clusters, leading to brief write unavailability.\n\n- Google published that they see 12 network partition events per year across their fleet — and these are WITHIN a single datacenter, not even cross-datacenter.\n\n- Azure had a 2023 outage where a DNS partition caused services in South Brazil to lose connectivity to the global control plane.\n\nThe myth: 'Our cloud provider handles this.' Reality: cloud providers experience partitions too. Your application needs to handle them gracefully — either by degrading functionality (AP) or by explicitly failing (CP), but never by silently corrupting data.\n\nJepsen (jepsen.io) tests databases under partition conditions. Kyle Kingsbury has found data loss bugs in MongoDB, Elasticsearch, Redis, RabbitMQ, and many others. If you design systems, read Jepsen reports — they reveal what vendors won't tell you.",
      },
    ],
    realWorldExamples: [
      {
        company: "Banking Systems",
        description:
          "Choose CP — your bank balance must be correct even if the ATM is temporarily unavailable. Showing a wrong balance could allow double-spending.",
      },
      {
        company: "Social Media (Twitter/Instagram)",
        description:
          "Choose AP — it's fine if your like count is slightly stale for a few seconds. Showing a temporarily outdated count is far better than the app being down.",
      },
    ],
    tradeOffs: [
      {
        optionA: "CP (Consistency + Partition Tolerance)",
        optionB: "AP (Availability + Partition Tolerance)",
        comparison:
          "CP: accurate data, may have downtime during partitions, good for financial/inventory systems. AP: always responsive, may show stale data, good for social media/analytics/DNS.",
      },
    ],
    interviewTips: [
      "Always say 'P is not optional — partitions will happen' when discussing CAP",
      "Frame the choice as 'CP vs AP' rather than 'pick 2 of 3'",
      "Give concrete examples: 'for a banking app I'd choose CP because...'",
      "Mention PACELC to show deeper understanding",
      "Know which databases fall into which category (MongoDB=CP, Cassandra=AP, PostgreSQL=CA within single node)",
    ],
    practiceQuestions: [
      {
        question: "You're designing an e-commerce inventory system. Would you choose CP or AP? Why?",
        answer:
          "CP — because showing incorrect inventory (AP) could lead to overselling. If a partition occurs, it's better to show an error or degrade gracefully (e.g., 'temporarily unable to check stock') than to let users buy an item that doesn't exist. Use strong consistency for inventory counts, but you might use AP for less critical data like product reviews or recommendations.",
      },
    ],
    tags: ["cap-theorem", "consistency", "availability", "partition-tolerance", "distributed-systems"],
  },
  {
    id: "sd-fund-consistency",
    chapterId: 1,
    title: "Consistency Patterns",
    order: 4,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "Consistency isn't binary — there's a spectrum from strong consistency (every read sees the latest write) to eventual consistency (reads may temporarily be stale, but converge over time). Understanding the options lets you choose the right trade-off for each part of your system. Strong consistency uses synchronous replication (slower but safe for financial data). Eventual consistency uses async replication (fast but stale for social feeds). Causal consistency sits in between — it guarantees you see your own writes and events in causal order.",
    keyPoints: [
      "Strong consistency: all nodes see the same data at the same time (slow, safe)",
      "Eventual consistency: nodes will converge given enough time (fast, may serve stale data)",
      "Causal consistency: preserves cause-and-effect ordering of operations",
      "Read-your-writes: you always see your own updates immediately",
      "Monotonic reads: you never see older data after seeing newer data",
      "Quorum reads/writes: require majority agreement (W + R > N for consistency)",
      "The BIGGEST practical issue: user writes data, then immediately reads and doesn't see their own write. They refresh the page thinking it's broken. Read-your-writes consistency prevents this — route the user's reads to the same replica they wrote to, or use synchronous replication for the user's own data",
      "Conflict resolution is where the rubber meets the road: with eventual consistency, two users can write different values simultaneously. Who wins? Last-Write-Wins (LWW) is simple but loses data. Vector clocks detect conflicts but require app-level resolution. CRDTs (Conflict-free Replicated Data Types) auto-merge without conflicts — used by Figma, Apple Notes, and Redis for counters and sets",
      "The consistency model you configure is the WORST case, not the average case. An eventually consistent system may serve fresh data 99.9% of the time — it just can't GUARANTEE it. That 0.1% matters for financial data but not for like counts",
    ],
    deepDive: [
      {
        title: "The Consistency Spectrum",
        content:
          "Think of it as a dial, not a switch. Linearizability (strongest): operations appear instantaneous and ordered. Sequential consistency: operations are in order per client. Causal consistency: cause-and-effect is preserved. Eventual consistency: no ordering guarantee, but data converges. The weaker the consistency, the better the performance and availability.\n\nHere's the thing nobody tells you: in practice, most developers use the WEAKEST consistency they can get away with for each operation. The same app might use:\n- Strong consistency for: balance checks, inventory reservations, auth token validation\n- Causal consistency for: comment threads (replies should appear after the parent)\n- Eventual consistency for: like counts, view counts, recommendation feeds, analytics\n\nThis per-operation approach is what Amazon calls 'fine-grained consistency.' DynamoDB lets you choose consistent vs eventual ON EVERY SINGLE READ CALL. An eventually consistent read costs half as much. At Amazon scale, that's millions of dollars saved by using eventual consistency where it doesn't matter.",
        diagram: `Consistency Spectrum:

  Strong ◄──────────────────────────► Weak
  
  Linearizable → Sequential → Causal → Eventual
  
  ▲ Slower          ▲ Faster
  ▲ More correct    ▲ More available
  ▲ Simpler code    ▲ Complex conflict resolution`,
      },
      {
        title: "Quorum Consensus",
        content:
          "In a system with N replicas, require W nodes to acknowledge writes and R nodes to agree on reads. If W + R > N, at least one node in the read set has the latest write. Common configs: N=3, W=2, R=2 (strong consistency). N=3, W=1, R=1 (eventual consistency, fast). N=3, W=3, R=1 (write-heavy, strong writes, fast reads).\n\nThe gotcha: quorum consistency is NOT linearizability! Even with W + R > N, there's a brief window during a write where some read quorums may return the old value. For true linearizability, you need additional mechanisms like read-repair or consensus protocols.\n\nAnother thing: sloppy quorums. In normal quorums, W and R include only the designated replicas. In a sloppy quorum (used by Dynamo/Cassandra), if a designated replica is down, a write can go to ANY available node. This improves availability but breaks the W + R > N guarantee until the data is 'hinted handoff' back to the correct node. This is why Cassandra can lose writes during node failures despite using quorum.",
      },
      {
        title: "CRDTs — The Future of Conflict Resolution",
        content:
          "CRDTs (Conflict-free Replicated Data Types) are data structures that can be independently updated on different nodes and mathematically guaranteed to converge to the same value when merged — WITHOUT coordination.\n\nExamples:\n- G-Counter (grow-only counter): Each node keeps its own count. Total = sum of all node counts. Two nodes increment independently → merge by taking max of each node's count → always converges. Used by Redis CRDT for distributed counters.\n\n- LWW-Register (Last-Writer-Wins): Each value has a timestamp. Merge: keep the value with the highest timestamp. Simple but can lose data if two writes happen simultaneously.\n\n- OR-Set (Observed-Remove Set): Supports add and remove operations. Each element is tagged with a unique ID. Remove only removes specific IDs, not all instances. Converges correctly even with concurrent add/remove.\n\nReal-world usage:\n- Figma uses CRDTs for real-time collaborative design editing\n- Apple Notes uses CRDTs for sync across devices\n- Redis Enterprise uses CRDTs for active-active geo-replication\n- Riak uses CRDTs for conflict-free counters, sets, and maps\n\nWhen to use CRDTs: when you need conflict-free eventual consistency for specific data structures (counters, flags, sets). When NOT to use: when you need arbitrary business logic for conflicts (e.g., only one person can book a seat — that requires strong consistency, not CRDTs).",
        diagram: `G-Counter CRDT (Grow-only Counter):

  Node A: {A:3, B:0}     Node B: {A:0, B:2}
  
  Both increment independently:
  Node A: {A:5, B:0}     Node B: {A:0, B:4}
  
  Merge (take max per node):
  Result: {A:5, B:4} → Total = 9
  
  No conflicts! Always converges correctly.`,
      },
      {
        title: "The Read-Your-Writes Problem in Practice",
        content:
          "This is the #1 consistency bug in web applications, and most developers don't even realize it exists:\n\nUser clicks 'Update Profile' → write goes to primary database → response says 'Success!' → page reloads → GET /profile request hits a read replica that hasn't received the replication yet → user sees their OLD profile → thinks the app is broken → clicks 'Update' again.\n\nSolutions (from simplest to most robust):\n\n1. Pin reads to primary after write: After a write, route that user's reads to the primary for 5 seconds (covers replication lag). Use a cookie or session flag.\n\n2. Read from primary for the writing user, replicas for everyone else: The user who wrote always reads from primary. Other users read from replicas (they don't care about 1-second staleness of someone ELSE's data).\n\n3. Client-side optimistic update: Don't wait for the server at all. Immediately update the UI client-side when the user clicks 'Save.' If the server write fails, roll back the UI. Most modern SPAs do this.\n\n4. Lamport timestamp or logical clock: Include a 'last-write-timestamp' in the response. On subsequent reads, pass this timestamp. The read replica waits until it has replicated up to that timestamp before responding. CockroachDB does this with its 'AS OF SYSTEM TIME' clause.\n\nThe one that DOESN'T work: refreshing the page. If the page reload also hits a replica, you see stale data again. Users will refresh 5 times, see stale data, and file a bug report.",
      },
    ],
    realWorldExamples: [
      {
        company: "Amazon DynamoDB",
        description:
          "Offers both: eventually consistent reads (default, 50% cheaper) and strongly consistent reads (always returns latest, costs more). Lets developers choose per-query based on business needs.",
      },
      {
        company: "Google Spanner",
        description:
          "Globally distributed database with strong consistency using TrueTime (atomic clocks + GPS). Proves you can have global distribution AND strong consistency — if you can afford Google's infrastructure.",
      },
    ],
    tradeOffs: [
      {
        optionA: "Strong Consistency",
        optionB: "Eventual Consistency",
        comparison:
          "Strong: higher latency (sync replication), lower throughput, simpler application logic. Eventual: lower latency (async replication), higher throughput, requires conflict resolution logic.",
      },
    ],
    interviewTips: [
      "Use different consistency levels for different parts of the system — order total needs strong, product views can be eventual",
      "Mention quorum-based approaches (W + R > N) for tunable consistency",
      "Talk about conflict resolution strategies: last-write-wins, vector clocks, CRDTs",
    ],
    practiceQuestions: [
      {
        question: "When would you choose eventual consistency over strong consistency?",
        answer:
          "When: (1) stale reads are acceptable (social media like counts, product view counts), (2) high availability is more important than perfect accuracy, (3) you need low latency reads across geographic regions, (4) the data naturally converges (DNS records, CDN content). Avoid eventual consistency for: financial transactions, inventory counts, or anything where stale data causes real harm.",
      },
    ],
    tags: ["consistency", "eventual-consistency", "strong-consistency", "quorum", "replication"],
  },
  {
    id: "sd-fund-acid-base",
    chapterId: 1,
    title: "ACID vs BASE",
    order: 5,
    difficulty: "beginner",
    estimatedMinutes: 10,
    overview:
      "ACID and BASE are two database philosophies. ACID (Atomicity, Consistency, Isolation, Durability) guarantees reliable transactions — used by relational databases like PostgreSQL and MySQL. BASE (Basically Available, Soft state, Eventually consistent) trades strict guarantees for scalability and performance — embraced by NoSQL databases like Cassandra and DynamoDB. Most real systems use ACID for critical paths (payments, inventory) and BASE for read-heavy, scale-heavy paths (feeds, analytics).",
    keyPoints: [
      "Atomicity: transactions are all-or-nothing",
      "Consistency: transactions move the database from one valid state to another",
      "Isolation: concurrent transactions don't interfere with each other",
      "Durability: committed transactions survive crashes",
      "BASE sacrifices immediate consistency for availability and partition tolerance",
      "Use ACID for financial transactions, user auth, inventory",
      "Use BASE for analytics, social feeds, logging, search indices",
      "MOST DEVS DON'T KNOW: Isolation has LEVELS, and the default is NOT the strongest. PostgreSQL defaults to Read Committed (NOT Serializable). This means two concurrent transactions CAN see inconsistent data. Non-repeatable reads and phantom reads are possible by default. Only Serializable isolation prevents ALL anomalies — and it's significantly slower",
      "The 'D' in ACID (Durability) has a dark secret: even with fsync, data can be lost if the disk lies about flushing. Some SSDs have buggy firmware that reports writes as flushed when they're still in volatile cache. PostgreSQL has had data corruption issues on specific SSD models for this reason",
      "Write-ahead logging (WAL) is HOW databases implement atomicity and durability. Every change is first written to a sequential log, then to the actual data pages. If the server crashes mid-write, the WAL allows replay. This is why sequential writes (WAL) are so much faster than random writes (data pages)",
    ],
    deepDive: [
      {
        title: "ACID in Practice",
        content:
          "A bank transfer: debit Account A $100, credit Account B $100. With ACID: Atomicity ensures both operations succeed or both fail (no money disappears). Consistency ensures accounts always balance. Isolation ensures two simultaneous transfers don't corrupt the balance. Durability ensures the transfer survives a server crash. Without ACID, any failure mid-transaction could lose money.",
      },
      {
        title: "Isolation Levels — The Deep Dive Most Developers Skip",
        content:
          "This is where the money is. Most devs think transactions are transactions. They're not. There are 4 isolation levels, each with different guarantees and performance:\n\n1. Read Uncommitted: You can see other transactions' uncommitted changes ('dirty reads'). Almost never used. It's chaos.\n\n2. Read Committed (PostgreSQL default, Oracle default): You only see committed data. BUT if another transaction commits while you're in a transaction, you'll see the new data on your next read. Your same SELECT can return different results within one transaction ('non-repeatable read').\n\n3. Repeatable Read (MySQL InnoDB default): Within your transaction, you always see the same snapshot. No non-repeatable reads. BUT: phantom reads are still possible (new rows appearing that match your WHERE clause). InnoDB actually prevents phantoms too via gap locks, making it stronger than spec.\n\n4. Serializable: Transactions behave as if they executed one at a time. No anomalies possible. Heavy locking or optimistic concurrency control (OCC). 30-50% slower than Read Committed.\n\nThe critical gotcha: most ORMs and application code assume Serializable behavior but run on Read Committed. This is a class of bugs that only manifests under concurrent load and is nearly impossible to catch in testing. Example: checking if a username is available (SELECT) then creating it (INSERT) — two users can check simultaneously, both see 'available,' and both insert → duplicate username.\n\nSolution: Use SELECT FOR UPDATE (pessimistic locking) or UNIQUE constraints (let the DB enforce it).",
        diagram: `Isolation Levels and Anomalies:

                    Dirty   Non-Repeatable  Phantom
                    Read    Read            Read
  ──────────────────────────────────────────────────
  Read Uncommitted   YES     YES             YES
  Read Committed     NO      YES             YES
  Repeatable Read    NO      NO              YES*
  Serializable       NO      NO              NO
  
  * MySQL InnoDB prevents phantoms at Repeatable Read
    via gap locking (stronger than SQL standard)
  
  Performance: Read Uncommitted ──── fast
               Serializable ──────── slow (30-50% hit)`,
      },
      {
        title: "BASE in Practice",
        content:
          "A social media 'like'. When you like a post, the count might show 42 to you and 41 to another user for a brief moment. BASE says: the system is Basically Available (the page loads), the like count is in Soft state (temporarily inconsistent), and Eventually consistent (within seconds, everyone sees 42). This is perfectly acceptable — and allows the system to handle millions of likes per second without locking.\n\nThe deeper insight: BASE isn't actually an alternative to ACID — it's what you get when you GIVE UP ACID guarantees for specific operations. You don't 'choose BASE' — you choose to relax specific ACID properties for specific operations where the cost of full ACID isn't worth the business benefit.\n\nExample architecture: Stripe uses PostgreSQL (full ACID) for payment ledger operations. But the dashboard that shows 'total revenue this month' reads from a materialized view that's eventually consistent (BASE). They don't lock the entire ledger to calculate a real-time total. Same company, same data, different consistency levels for different use cases.",
      },
      {
        title: "Distributed Transactions — Why 2PC is a Trap",
        content:
          "When you split data across services, how do you maintain ACID? The textbook answer is Two-Phase Commit (2PC): a coordinator asks all participants 'can you commit?', if all say yes, coordinator says 'commit'. If any says no, coordinator says 'abort.'\n\nWhy 2PC is terrible in practice:\n\n1. Blocking: If the coordinator crashes after sending 'prepare' but before sending 'commit/abort', ALL participants are stuck holding locks, unable to proceed. This can last for hours.\n\n2. Performance: 2PC requires 2 round trips across the network (prepare + commit). In a cross-datacenter scenario, that's 4 × 150ms = 600ms of JUST coordination overhead.\n\n3. Availability: If ANY participant is unavailable, the entire transaction blocks.\n\nWhat to use instead:\n\n- Saga pattern: Break the distributed transaction into a sequence of local transactions with compensating actions. Service A commits locally, then Service B commits locally. If B fails, Service A executes a compensating action (undo).\n\n- Outbox pattern: Write the event and the data change to the SAME local database (in a transaction). A separate process reads the outbox table and publishes events. This gives you exactly-once semantics without distributed transactions.\n\n- Reservation pattern: 'Reserve' resources temporarily (hold inventory, pre-auth credit card). Confirm or cancel later. Used by airlines, hotels, and payment processors.\n\nRule: NEVER use distributed transactions across microservices. Use sagas with compensating actions. This is a hill worth dying on in interviews.",
        diagram: `2PC (Two-Phase Commit) — The Blocking Problem:

  Coordinator ──prepare──► Service A (locks row)
  Coordinator ──prepare──► Service B (locks row)
  
  Coordinator CRASHES 💀
  
  Service A: holding lock, waiting for commit/abort
  Service B: holding lock, waiting for commit/abort
  
  Both services BLOCKED until coordinator recovers.
  Minutes? Hours? Nobody knows. Other transactions
  that need those rows? Also blocked. Cascade failure.
  
vs. Saga Pattern:

  Service A: commit locally ──event──► Service B  
  Service B: commit locally ──event──► Done!
  
  If B fails: compensating event ──► Service A undoes
  No locks held across services. No blocking.`,
      },
    ],
    realWorldExamples: [
      {
        company: "Stripe",
        description:
          "Uses ACID (PostgreSQL) for all payment processing. Every charge, refund, and transfer is wrapped in a database transaction. Data integrity is non-negotiable for financial operations.",
      },
      {
        company: "Instagram",
        description:
          "Uses BASE for feed generation and like counts. Cassandra handles millions of writes/second with eventual consistency. Users don't notice if a like count is  stale by 1-2 seconds.",
      },
    ],
    tradeOffs: [
      {
        optionA: "ACID",
        optionB: "BASE",
        comparison:
          "ACID: strict guarantees, harder to scale horizontally, higher latency for writes. BASE: relaxed guarantees, scales massively, lower latency, requires application-level conflict handling.",
      },
    ],
    interviewTips: [
      "Don't present ACID and BASE as mutually exclusive — most systems use both for different subsystems",
      "Mention specific isolation levels (Read Committed, Repeatable Read, Serializable) to show depth",
      "Connect to CAP: ACID aligns with CP, BASE aligns with AP",
    ],
    practiceQuestions: [
      {
        question: "You're building an e-commerce platform. Which parts use ACID and which use BASE?",
        answer:
          "ACID: order processing, payment transactions, inventory updates, user authentication — anywhere data corruption has financial or security consequences. BASE: product search results, recommendation engine, user activity feeds, analytics dashboards, product review counts — where slight staleness is invisible to users. This hybrid approach gives you safety for critical paths and speed for everything else.",
      },
    ],
    tags: ["acid", "base", "transactions", "consistency", "databases"],
  },
  {
    id: "sd-fund-back-of-envelope",
    chapterId: 1,
    title: "Back-of-Envelope Estimation",
    order: 6,
    difficulty: "beginner",
    estimatedMinutes: 15,
    overview:
      "Back-of-envelope estimation is a critical system design skill. Interviewers expect you to estimate traffic, storage, bandwidth, and compute requirements before diving into architecture. The goal isn't precision — it's getting within the right order of magnitude. Know your powers of 2 (1KB, 1MB, 1GB, 1TB), standard traffic patterns (DAU to QPS conversion), and storage math (bytes per record × total records). The secret: estimations aren't just a warm-up exercise. They DRIVE your architecture decisions. If your math says 500 QPS, a single PostgreSQL instance works. If it says 500,000 QPS, you need sharding + caching + CDN. If it says 10TB of new data per day, you need object storage, not a relational database. Let the numbers tell you what to build.",
    keyPoints: [
      "1 day ≈ 100,000 seconds (86,400 — round to 10^5 for estimation)",
      "DAU to QPS: (DAU × actions/day) / 86,400 seconds = avg QPS; peak = 2-5x average",
      "Storage: bytes per object × number of objects × retention period",
      "Bandwidth: QPS × average response size",
      "Powers of 2: 1KB = 10^3, 1MB = 10^6, 1GB = 10^9, 1TB = 10^12",
      "A single server can handle ~10K-50K concurrent connections, ~1K-10K QPS depending on work",
      "WHAT MOST PEOPLE MISS: A single PostgreSQL instance can handle 5,000-10,000 simple QPS and store hundreds of millions of rows. Most apps will NEVER need sharding. Don't over-engineer the data tier based on inflated traffic estimates",
      "80/20 rule for traffic: 80% of traffic happens in 20% of the day. So peak QPS is roughly 4-5x the average QPS. For viral spikes (Hacker News front page, celebrity tweet), peak can be 50-100x average",
      "The numbers that matter for server capacity: one app server (4-core, 8GB RAM) handles ~1,000 complex QPS or ~10,000 simple QPS. One Redis instance handles ~100,000 GET/SET per second. One PostgreSQL instance handles ~5,000-10,000 simple read QPS",
      "Memory math: 1 million user objects at 1KB each = 1GB RAM. A $50/month server with 8GB RAM can cache 8 million user records in memory. That's enough for most startups",
    ],
    deepDive: [
      {
        title: "Traffic Estimation Framework",
        content:
          "Example: Twitter-like service with 300M monthly active users. Step 1: DAU = ~50% of MAU = 150M. Step 2: Average user reads 50 tweets/day and writes 2 tweets/day. Step 3: Read QPS = (150M × 50) / 86,400 ≈ 87,000 QPS. Write QPS = (150M × 2) / 86,400 ≈ 3,500 QPS. Step 4: Peak = 3x average. Peak read QPS ≈ 260K. Peak write QPS ≈ 10.5K. This tells you: heavy read system, need caching, can batch writes.\n\nThe insider trick: always derive CONCLUSIONS from your numbers. Don't just calculate — interpret. '260K read QPS means a single DB won't cut it. We need a caching layer that handles 90%+ of reads. If cache hit rate is 95%, actual DB load = 13K QPS, which is feasible for a replicated PostgreSQL cluster.' This kind of reasoning is what gets you hired.",
      },
      {
        title: "Storage Estimation Framework",
        content:
          "Each tweet: 280 chars = 280 bytes text + 100 bytes metadata = ~400 bytes. With media: average 20% have images (~200KB each). Daily tweets: 150M × 2 = 300M tweets/day. Daily storage: 300M × 400B = 120GB text + 60M × 200KB = 12TB media = ~12.1TB/day. Yearly: ~4.4PB. This tells you: you need distributed object storage for media, not a relational database.\n\nThe nuance interviewers love: separate TEXT data from MEDIA data in your estimation. Text goes in a database (small, searchable). Media goes in object storage (large, blob). This distinction drives architecture: PostgreSQL for tweet metadata, S3 for images/videos, CDN for serving media. Never store images in a relational database — it's one of the most common beginner mistakes.",
        diagram: `Storage Estimation:

  Tweets per day ...... 300M
  Text per tweet ...... 400 bytes
  Text storage/day .... 120 GB
  
  Tweets with media ... 60M  (20%)
  Media per tweet ..... 200 KB
  Media storage/day ... 12 TB
  
  Total/day ........... ~12.1 TB
  Total/year .......... ~4.4 PB
  
  Architecture insight:
  Text (120 GB/day) → PostgreSQL (feasible)
  Media (12 TB/day) → S3 + CDN (only option)`,
      },
      {
        title: "The Cheat Sheet of System Capacity Numbers",
        content:
          "Memorize these — they let you instantly know if a design is feasible:\n\n▸ Web server (Nginx): ~50,000 concurrent connections, ~100K requests/sec for static content\n▸ Application server (Node.js): ~1,000-5,000 requests/sec (depends on CPU work)\n▸ Application server (Go/Java): ~5,000-20,000 requests/sec\n▸ PostgreSQL: ~5,000-10,000 simple queries/sec, ~500-2,000 complex queries/sec per instance\n▸ MySQL: similar to PostgreSQL (slightly faster simple reads, slightly slower complex writes)\n▸ Redis: ~100,000 GET/SET operations/sec (single instance)\n▸ Kafka: ~1,000,000 messages/sec per cluster (varies by message size)\n▸ S3: no practical throughput limit (pay per request), ~3,500 PUT/sec per prefix\n▸ CDN: no practical throughput limit (pay per request + bandwidth)\n\nNetwork throughput:\n▸ Same datacenter: 1-10 Gbps between instances\n▸ Cross-region: 50-200 Mbps (varies by provider)\n▸ Client bandwidth: ~10 Mbps average (mobile/wifi varies wildly)\n\nWith these numbers, you can instantly evaluate: 'We need 50,000 QPS. One PostgreSQL can handle 10,000. So we need 5 read replicas + caching.' Or: 'We need 500 QPS. One PostgreSQL handles that easily — no need for caching yet.'",
      },
      {
        title: "Common Estimation Mistakes That Kill Interviews",
        content:
          "1. Over-estimating traffic: 'Let's assume 1 billion users.' Unless you're designing for Facebook/Google, be realistic. Most systems serve thousands to low millions of users.\n\n2. Forgetting read vs write ratio: Most systems are 90-99% reads. This ratio determines whether you need read replicas, caching, or write sharding.\n\n3. Not accounting for data growth: 'We need 1TB today' is different from 'we need 1TB today and 10TB in a year.' Storage costs grow; plan for retention policies and archiving.\n\n4. Ignoring burst/peak traffic: Average QPS is useless for capacity planning. Size for peak. If average is 1,000 QPS and peak is 5,000 QPS, you need capacity for 5,000 (or auto-scaling that reacts fast enough).\n\n5. Mixing up storage vs bandwidth: '12TB/day of new data' is a STORAGE problem. But serving that data to users is a BANDWIDTH problem. If each of those 12TB is read 10 times, you need 120TB/day of outbound bandwidth = 11 Gbps sustained.\n\n6. Forgetting replication and backup overhead: If you replicate data 3x for durability, your 10TB becomes 30TB. If you keep 30-day backups, add another 300TB.\n\nThe golden rule: state your assumptions first, do the math second, draw conclusions third. The math itself is never wrong — wrong assumptions are what kill designs.",
      },
    ],
    realWorldExamples: [
      {
        company: "Google",
        description:
          "Jeff Dean's famous 'Numbers Everyone Should Know' is the gold standard for estimation. Google engineers use napkin math before any design work to rule out infeasible approaches early.",
      },
    ],
    tradeOffs: [
      {
        optionA: "Over-estimate resources",
        optionB: "Under-estimate resources",
        comparison:
          "Over-estimating costs money (provisioning unused servers) but is safe. Under-estimating causes outages under load. In interviews, slightly over-estimating shows you think about headroom. Always compute for peak traffic, not average.",
      },
    ],
    interviewTips: [
      "Start EVERY system design answer with estimation — it shows structured thinking",
      "State your assumptions explicitly: 'let's assume 100M DAU with 10 actions per user per day'",
      "Round aggressively — 86,400 seconds ≈ 10^5. Precision doesn't matter, order of magnitude does",
      "Derive conclusions from numbers: 'at 100K QPS, we need at least 10 servers at 10K QPS each'",
    ],
    practiceQuestions: [
      {
        question: "Estimate the storage needed for a YouTube-like service for 1 year.",
        answer:
          "Assumptions: 500 hours of video uploaded per minute, average video quality ~3 Mbps bitrate, stored in 3 qualities (360p, 720p, 1080p ≈ 1+2.5+5 = 8.5 Mbps total). Storage per minute of video: 8.5 Mbps × 60 sec / 8 = ~64 MB/min. Daily uploads: 500 hours/min × 60 min × 24 hours = 720,000 hours = 43.2M minutes. Daily storage: 43.2M × 64 MB = ~2.76 PB/day. Yearly: ~1 EB (exabyte). Plus redundancy (3x replication) = ~3 EB. This is why YouTube uses custom storage infrastructure.",
      },
    ],
    tags: ["estimation", "capacity-planning", "traffic", "storage", "bandwidth"],
  },
];
