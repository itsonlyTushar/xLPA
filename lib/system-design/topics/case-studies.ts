import { CaseStudy } from "../types";

export const caseStudies: CaseStudy[] = [
  {
    id: "sd-case-url-shortener",
    chapterId: 8,
    title: "Design a URL Shortener (Bit.ly)",
    order: 1,
    difficulty: "beginner",
    description:
      "Design a URL shortening service like Bit.ly that converts long URLs to short links, redirects users, and tracks analytics. A classic interview question that covers hashing, database design, caching, and scalability. This is THE most common system design interview question — it appears simple but has surprising depth. The key insight interviewers look for: this is a read-heavy system (100:1 read/write ratio), so your design should optimize for reads (caching, CDN) while handling writes efficiently (collision-free ID generation). Most candidates fumble on: collision handling strategy, 301 vs 302 redirect trade-off (301 is cached by browsers — you lose analytics!), and how to handle the same long URL submitted multiple times (deduplicate or create separate short URLs?).",
    requirements: {
      functional: [
        "Given a long URL, generate a unique short URL",
        "Given a short URL, redirect to the original long URL",
        "Users can set custom short aliases",
        "Short URLs expire after a configurable time (default: 5 years)",
        "Track click analytics (count, referrer, location)",
      ],
      nonFunctional: [
        "URL redirection must be < 50ms P99 latency",
        "The system should be highly available (99.99% uptime)",
        "Short URLs should not be predictable (security)",
        "Scale to 100M new URLs/day and 10B redirects/day",
      ],
    },
    estimations: [
      { metric: "New URLs/day", value: "100M", explanation: "Write QPS = 100M / 86,400 ≈ 1,160 QPS" },
      { metric: "Redirects/day", value: "10B", explanation: "Read QPS = 10B / 86,400 ≈ 115,740 QPS. Read-heavy system (100:1 read/write ratio)." },
      { metric: "Storage per URL", value: "~500 bytes", explanation: "Short URL (7 chars) + long URL (avg 200 chars) + metadata (created_at, expires_at, user_id) ≈ 500 bytes" },
      { metric: "Storage/year", value: "~18 TB", explanation: "100M URLs/day × 365 days × 500 bytes ≈ 18.25 TB/year. After 5 years: ~91 TB." },
      { metric: "Unique URLs needed", value: "365 billion (5 yr)", explanation: "Base62 with 7 characters: 62^7 = 3.5 trillion possible URLs — plenty of capacity." },
    ],
    architectureLayers: [
      { name: "Client Layer", components: ["Web browser", "Mobile app", "API client"], description: "Sends long URLs to create shorts, follows short URLs for redirect." },
      { name: "Application Layer", components: ["URL Shortening Service", "Redirect Service", "Analytics Service"], description: "Handles URL creation, redirects (HTTP 301/302), and click tracking." },
      { name: "Cache Layer", components: ["Redis / Memcached"], description: "Caches hot short→long URL mappings. 80/20 rule: 20% of URLs get 80% traffic." },
      { name: "Database Layer", components: ["Primary DB (PostgreSQL/DynamoDB)", "Analytics Store (Cassandra/ClickHouse)"], description: "URL mappings in relational DB; click events in high-write analytics store." },
    ],
    architectureDiagram: `┌────────────┐         ┌─────────────────┐
│   Client   │ ──────► │  Load Balancer   │
└────────────┘         └────────┬────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │ App     │ │ App     │ │ App     │
              │Server 1 │ │Server 2 │ │Server 3 │
              └────┬────┘ └────┬────┘ └────┬────┘
                   │           │           │
              ┌────▼───────────▼───────────▼────┐
              │         Redis Cache              │
              │  (short → long URL mapping)      │
              └────────────┬────────────────────┘
                           │
                    ┌──────┼──────┐
                    ▼             ▼
              ┌──────────┐  ┌──────────┐
              │PostgreSQL │  │Cassandra │
              │(URL maps) │  │(clicks)  │
              └──────────┘  └──────────┘`,
    dataFlow: `Create Short URL:
1. Client sends POST /api/shorten { long_url: "https://..." }
2. Generate short code: Base62(MD5(long_url + timestamp + salt))[0:7]
3. Check for collision in DB — if exists, regenerate with new salt
4. Store mapping in PostgreSQL: { short_code, long_url, created_at, expires_at }
5. Store in Redis cache
6. Return short URL to client

Redirect:
1. Client requests GET /abc1234
2. Check Redis cache for "abc1234" → long URL
3. Cache HIT: redirect (HTTP 302) to long URL
4. Cache MISS: query PostgreSQL → populate cache → redirect
5. Async: publish click event to Kafka → Analytics Service → Cassandra`,
    databaseSchema: `-- URL mappings
CREATE TABLE urls (
  short_code  VARCHAR(7) PRIMARY KEY,
  long_url    TEXT NOT NULL,
  user_id     UUID,
  created_at  TIMESTAMP DEFAULT NOW(),
  expires_at  TIMESTAMP,
  click_count BIGINT DEFAULT 0
);

CREATE INDEX idx_urls_long ON urls(long_url);
CREATE INDEX idx_urls_user ON urls(user_id);

-- Click analytics (Cassandra)
-- PRIMARY KEY ((short_code), clicked_at)
-- Partition by short_code, cluster by time`,
    apiDesign: `POST /api/v1/urls
  Body: { "long_url": "https://...", "custom_alias": "mylink", "expires_in": "30d" }
  Response: { "short_url": "https://short.ly/abc1234", "expires_at": "2025-04-19" }

GET /{short_code}
  Response: HTTP 302 Redirect to long URL
  Header: Location: https://original-long-url.com/...

GET /api/v1/urls/{short_code}/stats
  Response: { "clicks": 1542, "created_at": "...", "top_referrers": [...] }`,
    scalingConsiderations: [
      "Caching: cache the top 20% most-accessed URLs in Redis — covers 80% of reads",
      "Database: use read replicas for redirect lookups; primary for writes only",
      "URL Generation: pre-generate short codes in batches to avoid collision checks under load",
      "Rate limiting: prevent abuse — max 100 URLs/hour per IP for anonymous users",
      "Geographic: deploy in multiple regions with local Redis caches for low-latency redirects",
      "Cleanup: background job to delete expired URLs and free short codes for reuse",
      "HIDDEN GOTCHA — 301 vs 302 Redirect: HTTP 301 (Permanent Redirect) tells the browser to cache the redirect — next time, the browser goes DIRECTLY to the long URL without hitting your servers. You lose ALL analytics for that user forever. HTTP 302 (Temporary Redirect) forces the browser to hit your server every time, enabling click tracking. Bit.ly uses 302 for exactly this reason. If your system needs analytics, ALWAYS use 302. If you want maximum performance and don't need analytics, use 301",
      "MOST DEVS DON'T KNOW — Short Code Generation Strategies: (1) Hash + Truncate: MD5(long_url)[0:7] in Base62. Problem: collisions possible, must check DB. (2) Auto-increment Counter: Distributed counter (Snowflake ID) → Base62 encode. No collisions, but URLs are SEQUENTIAL (user can guess next URL). (3) Pre-generated Key Service: Background job generates random unique keys and stores in a pool table. On request, grab a key from the pool. No collisions, no sequentiality, best for production. This is how Bit.ly actually works",
      "CRITICAL — Malicious URL Detection: Without validation, your URL shortener becomes a malware distribution tool. Check submitted URLs against Google Safe Browsing API before creating short links. Run periodic scans on existing URLs. This is a legal AND ethical requirement — URL shorteners have been shut down for facilitating phishing",
    ],
    interviewScript: [
      { phase: "Requirements", duration: "3 min", content: "Clarify functional and non-functional requirements. Ask about scale, latency needs, and custom features.", tips: ["Ask: 'How many URLs per day?'", "Ask: 'Do we need analytics?'", "Ask: 'Should short URLs expire?'"] },
      { phase: "Estimation", duration: "3 min", content: "Calculate QPS, storage, and bandwidth. Derive read/write ratio.", tips: ["100M URLs/day = ~1.2K write QPS", "10B redirects/day = ~116K read QPS", "This is read-heavy → caching is critical"] },
      { phase: "High-Level Design", duration: "8 min", content: "Draw the architecture: clients → LB → app servers → cache → DB. Explain the URL generation algorithm (Base62 encoding).", tips: ["Mention 302 vs 301 redirect trade-off", "Explain Base62 (a-z, A-Z, 0-9) = 62^7 = 3.5T URLs", "Separate analytics into async pipeline"] },
      { phase: "Deep Dive", duration: "8 min", content: "Discuss collision handling, caching strategy, database choice. Address scalability and availability.", tips: ["Collision: check DB, retry with new salt", "Cache: LRU eviction, 20/80 rule", "DB: shard by short_code for horizontal scaling"] },
      { phase: "Wrap-up", duration: "3 min", content: "Discuss monitoring, security, and edge cases.", tips: ["Monitor: cache hit rate, redirect latency P99", "Security: rate limiting, malicious URL detection", "Edge: what if the same long URL is submitted twice?"] },
    ],
    tags: ["url-shortener", "hashing", "caching", "redirect", "beginner"],
  },
  {
    id: "sd-case-twitter-feed",
    chapterId: 8,
    title: "Design Twitter/X News Feed",
    order: 2,
    difficulty: "intermediate",
    description:
      "Design the news feed system for a Twitter/X-like social platform. The feed shows tweets from people you follow, ordered by relevance or time. This is a classic fan-out problem: when a user with 10M followers tweets, how do you deliver it to all followers' feeds efficiently? This question is secretly about ONE concept: fan-out. Fan-out on WRITE means: when User A tweets, immediately push the tweet to all followers' feed caches (e.g., 10K Redis writes). Fan-out on READ means: when User B opens their feed, pull latest tweets from all users they follow and merge in real-time. Neither approach works alone — Twitter uses a HYBRID: fan-out on write for normal users (< 10K followers) and fan-out on read for celebrities. The candidate who explains this hybrid approach and WHY it's necessary (the celebrity problem) gets full marks.",
    requirements: {
      functional: [
        "Users can post tweets (text, images, videos)",
        "Users can follow/unfollow other users",
        "Users see a feed of tweets from people they follow",
        "Feed can be chronological or algorithmic (ranked)",
        "Users can like, retweet, and reply to tweets",
      ],
      nonFunctional: [
        "Feed generation must be < 200ms P99",
        "Support 500M DAU",
        "New tweets appear in followers' feeds within 5 seconds",
        "System handles celebrity tweets (accounts with 50M+ followers) without degradation",
      ],
    },
    estimations: [
      { metric: "DAU", value: "500M", explanation: "Daily Active Users" },
      { metric: "Tweets/day", value: "500M", explanation: "~1 tweet per active user per day average" },
      { metric: "Feed reads/day", value: "25B", explanation: "500M users × 50 feed refreshes/day" },
      { metric: "Feed read QPS", value: "~290K", explanation: "25B / 86,400 ≈ 290K. Peak: ~870K QPS." },
      { metric: "Storage/tweet", value: "~1 KB", explanation: "280 chars + metadata. Media stored in object storage (S3)." },
    ],
    architectureLayers: [
      { name: "Client Layer", components: ["Web App", "Mobile App (iOS/Android)"], description: "Posts tweets, fetches personalized feed." },
      { name: "API Gateway", components: ["Gateway + Auth + Rate Limiting"], description: "Handles authentication, routing, and throttling." },
      { name: "Core Services", components: ["Tweet Service", "Feed Service", "User Service", "Social Graph Service", "Media Service"], description: "Microservices for tweet CRUD, feed generation, user management, follow/unfollow, and media upload." },
      { name: "Data Layer", components: ["PostgreSQL (users, tweets)", "Redis (feed cache, social graph)", "S3 (media)", "Kafka (event streaming)"], description: "Polyglot persistence: relational for entities, cache for feeds, object storage for media." },
    ],
    architectureDiagram: `┌──────────┐   ┌──────────────┐   ┌─────────────────┐
│  Client  ├──►│  API Gateway  ├──►│  Feed Service   │
└──────────┘   └──────┬───────┘   └───────┬─────────┘
                      │                    │
                      ▼                    ▼
                ┌───────────┐      ┌──────────────┐
                │Tweet Svc  │      │Redis Feed    │
                │(write)    │      │Cache         │
                └─────┬─────┘      └──────────────┘
                      │
                      ▼
                ┌───────────┐      ┌──────────────┐
                │  Kafka    │─────►│Fan-out Worker │
                │           │      │(async)       │
                └───────────┘      └──────┬───────┘
                                          │
                                   Write to each
                                   follower's feed
                                   cache in Redis`,
    dataFlow: `Post a Tweet:
1. Client → API Gateway → Tweet Service
2. Store tweet in PostgreSQL (tweets table)
3. Upload media to S3, store S3 URL in tweet metadata
4. Publish "TweetCreated" event to Kafka
5. Fan-out Worker consumes event:
   a. For users with < 10K followers: FAN-OUT ON WRITE
      → Push tweet ID to each follower's Redis feed list
   b. For celebrities (> 10K followers): FAN-OUT ON READ
      → Store in celebrity tweets cache; merge at read time

Read Feed:
1. Client → Feed Service
2. Fetch user's pre-computed feed from Redis (fan-out on write results)
3. Fetch celebrity tweets separately (fan-out on read)
4. Merge, rank by algorithm (time + engagement signals)
5. Hydrate tweet IDs → full tweet objects (batch DB/cache lookup)
6. Return ranked feed to client`,
    databaseSchema: `-- Users
CREATE TABLE users (id UUID PK, username, display_name, avatar_url, ...);

-- Tweets
CREATE TABLE tweets (id BIGINT PK, user_id UUID FK, content TEXT, media_urls JSONB, created_at TIMESTAMP, ...);
CREATE INDEX idx_tweets_user ON tweets(user_id, created_at DESC);

-- Follows (Social Graph)
CREATE TABLE follows (follower_id UUID, followee_id UUID, created_at TIMESTAMP);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_followee ON follows(followee_id);

-- Redis Feed Cache
-- Key: feed:{user_id}
-- Value: Sorted Set of tweet_ids scored by timestamp
-- Max 800 tweet IDs per user feed`,
    apiDesign: `POST /api/v1/tweets
  Body: { "content": "Hello world!", "media_ids": ["..."] }
  Response: { "id": "12345", "created_at": "..." }

GET /api/v1/feed?cursor=tweet_12345&limit=20
  Response: { "tweets": [...], "next_cursor": "tweet_12300" }

POST /api/v1/users/{id}/follow
DELETE /api/v1/users/{id}/follow`,
    scalingConsiderations: [
      "Hybrid fan-out: fan-out on write for normal users (< 10K followers), fan-out on read for celebrities",
      "Feed cache in Redis: each user's feed is a sorted set of tweet IDs (not full tweets — saves memory)",
      "Tweet hydration: batch-fetch tweet objects from cache/DB when assembling the feed response",
      "Social graph in Redis: follower lists cached for fast fan-out lookups",
      "Kafka partitioned by user_id for ordered tweet delivery within a user's timeline",
      "Object storage (S3 + CDN) for all images and videos — never serve media from your servers",
      "HIDDEN GOTCHA — The Celebrity Problem Math: When Elon Musk (150M followers) tweets, fan-out on write means: 150M Redis writes. At 1ms per write = 150,000 seconds = 41+ HOURS to propagate ONE tweet. By then, the tweet is old news. This is WHY hybrid fan-out is necessary. For celebrities, you DON'T pre-compute — you merge their tweets at feed read time. The cost: feed reads are slightly slower (must merge 5-10 celebrity feeds), but tweet propagation is instant. Twitter calls this the 'pull model' for heavy hitters",
      "MOST DEVS DON'T KNOW — Feed Ranking is Harder Than Feed Building: Chronological feed is 'easy' (sort by time). Algorithmic feed (what Twitter/Instagram actually use) requires: (1) Engagement prediction: ML model predicts P(user will like/retweet/reply) for each candidate tweet. (2) Feature extraction: author relationship strength, content type, recency, trending score, previous interactions. (3) Diversity: don't show 10 tweets from the same person — inject variety. (4) Real-time signals: a tweet getting viral RIGHT NOW should be boosted. This ML ranking pipeline runs on EVERY feed request and is the secret sauce behind engagement. It's also why 'the algorithm' feels manipulative — it optimizes for engagement, not information quality",
      "CRITICAL — Don't Store Full Tweets in Feed Cache: Store only tweet IDs in Redis (sorted set by timestamp). When serving the feed: (1) Fetch tweet IDs from Redis feed cache, (2) Batch-fetch full tweet objects from a separate tweet cache/DB, (3) Hydrate and return. Why? Because tweets are mutable (like count changes, edits, deletes). If you store full tweets in 500M user feed caches, updating a single liked tweet requires updating it in millions of caches. With ID-only approach, the tweet object is cached in ONE place and always up-to-date",
    ],
    interviewScript: [
      { phase: "Requirements", duration: "3 min", content: "Clarify: scale, feed type (chrono vs ranked), real-time requirements.", tips: ["Ask: 'How many users? How many tweets/day?'", "Ask: 'Chronological or algorithmic feed?'", "Ask: 'What latency for feed loading?'"] },
      { phase: "Estimation", duration: "3 min", content: "Calculate QPS for reads and writes. Identify it's massively read-heavy.", tips: ["Feed reads ~100x more than tweet writes", "Storage: tweets are small, media is large → separate storage"] },
      { phase: "High-Level Design", duration: "8 min", content: "Draw the architecture. Introduce the fan-out problem and hybrid solution.", tips: ["The fan-out problem IS the interview question", "Hybrid: write for normal, read for celebrities", "Mention Kafka for async fan-out"] },
      { phase: "Deep Dive", duration: "8 min", content: "Fan-out trade-offs, feed ranking, cache design.", tips: ["Fan-out on write: fast reads, slow & expensive writes for celebrities", "Fan-out on read: slow reads (merge at query time), no write amplification", "Hybrid approach is the best answer"] },
      { phase: "Wrap-up", duration: "3 min", content: "Discuss feed ranking, content moderation, trending topics.", tips: ["Ranking: time decay + engagement signals + ML model", "Moderation: real-time text/image scanning pipeline", "Trending: real-time aggregation with sliding window"] },
    ],
    tags: ["news-feed", "fan-out", "social-media", "caching", "intermediate"],
  },
  {
    id: "sd-case-chat-system",
    chapterId: 8,
    title: "Design a Chat System (WhatsApp/Slack)",
    order: 3,
    difficulty: "intermediate",
    description:
      "Design a real-time chat system supporting 1:1 messaging, group chats, read receipts, online status, and message history. Covers WebSockets, message delivery guarantees, and data storage for messaging at scale. The core challenge that makes this question interesting: message ORDERING and DELIVERY GUARANTEES across unreliable networks. When User A sends 'Hello' then 'How are you?', User B MUST see them in that order. When User B is offline, messages must be reliably queued and delivered when they come back online — nothing can be lost. This is fundamentally a distributed queue problem with ordering constraints. The second key insight: WebSocket connection management at scale. 100M concurrent WebSocket connections at ~10KB each = 1TB of memory just for connection state. You need ~1000 gateway servers, and when User A sends a message to User B, you need to find WHICH gateway server User B is connected to. This is the session routing problem.",
    requirements: {
      functional: [
        "One-on-one and group messaging (up to 500 members)",
        "Message delivery with read receipts (sent, delivered, read)",
        "Online/offline status indicators",
        "Message history with search",
        "Push notifications for offline users",
        "Media sharing (images, files)",
      ],
      nonFunctional: [
        "Message delivery latency < 100ms for online users",
        "Support 100M concurrent connections",
        "Messages must never be lost (at-least-once delivery)",
        "Messages must be delivered in order within a conversation",
        "99.99% availability",
      ],
    },
    estimations: [
      { metric: "Concurrent users", value: "100M", explanation: "Connected via WebSocket at any time" },
      { metric: "Messages/day", value: "50B", explanation: "~500 messages per active user per day" },
      { metric: "Message QPS", value: "~580K", explanation: "50B / 86,400. Peak: ~1.5M QPS." },
      { metric: "Storage/message", value: "~200 bytes", explanation: "Text content + metadata (sender, timestamp, status)" },
      { metric: "Storage/day", value: "~10 TB", explanation: "50B × 200 bytes. Media: separate, much larger." },
    ],
    architectureLayers: [
      { name: "Client Layer", components: ["Mobile App", "Web App", "Desktop App"], description: "Connects via WebSocket for real-time messaging." },
      { name: "Gateway Layer", components: ["WebSocket Gateway Servers (100K conn each)"], description: "Manages persistent WebSocket connections. 1000 gateway servers for 100M connections." },
      { name: "Service Layer", components: ["Message Service", "Presence Service", "Group Service", "Notification Service"], description: "Handles message routing, online status, group management, and push notifications." },
      { name: "Data Layer", components: ["Cassandra (messages)", "Redis (presence, sessions)", "S3 (media)", "Kafka (event bus)"], description: "Cassandra for write-heavy message storage, Redis for real-time state." },
    ],
    architectureDiagram: `┌──────────┐ WebSocket  ┌──────────────────────────┐
│  User A  ├───────────►│  Gateway Server 1        │
└──────────┘            └────────────┬─────────────┘
                                     │
                              ┌──────▼──────┐
                              │   Kafka     │
                              │ (msg topic) │
                              └──────┬──────┘
                                     │
                              ┌──────▼──────┐
                              │   Message   │
                              │   Service   │
                              └──┬──────┬───┘
                                 │      │
                    ┌────────────┘      └────────────┐
                    ▼                                ▼
              ┌──────────┐              ┌──────────────────┐
              │Cassandra │              │  Gateway Server 2 │
              │(persist) │              │ (User B connected) │
              └──────────┘              └────────┬─────────┘
                                                 │ WebSocket
                                          ┌──────▼──────┐
                                          │   User B    │
                                          └─────────────┘`,
    dataFlow: `Send Message (User A → User B):
1. User A sends message over WebSocket to Gateway Server 1
2. Gateway publishes message to Kafka (topic: messages, key: conversation_id)
3. Message Service consumes from Kafka:
   a. Persist message to Cassandra (conversation_id as partition key)
   b. Look up User B's connection: which gateway server? (Redis session store)
   c. If User B is online: route message to Gateway Server 2 → push via WebSocket
   d. If User B is offline: send push notification via Notification Service
4. User B receives message → client sends "delivered" ACK
5. User B opens chat → client sends "read" ACK
6. ACKs flow back to User A updating message status (✓ → ✓✓ → blue ✓✓)`,
    databaseSchema: `-- Cassandra: messages
-- Partition key: conversation_id (all messages in a chat on same node)
-- Clustering key: message_id (TimeUUID for ordering)
CREATE TABLE messages (
  conversation_id UUID,
  message_id TIMEUUID,
  sender_id UUID,
  content TEXT,
  media_url TEXT,
  status TEXT,  -- sent, delivered, read
  PRIMARY KEY (conversation_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);

-- Redis: user sessions
-- Key: session:{user_id}
-- Value: { gateway_server_id, connected_at, last_active }

-- Redis: presence
-- Key: presence:{user_id}
-- Value: "online" with TTL (expire = offline)`,
    apiDesign: `WebSocket Events:
  → send_message: { conversation_id, content, media_id? }
  ← new_message: { message_id, sender_id, content, timestamp }
  ← message_delivered: { message_id }
  ← message_read: { message_id }
  ← typing_indicator: { conversation_id, user_id, is_typing }
  ← presence_update: { user_id, status: "online"|"offline" }

REST APIs:
  GET /api/v1/conversations/{id}/messages?before=msg_id&limit=50
  POST /api/v1/conversations (create group chat)
  GET /api/v1/conversations (list user's chats)`,
    scalingConsiderations: [
      "WebSocket gateway servers: each handles ~100K connections. 1000 servers for 100M users.",
      "Message routing: Redis stores user → gateway_server mapping for direct delivery.",
      "Cassandra: partition by conversation_id — all messages in a chat are co-located for fast retrieval.",
      "Group messages: fan-out to all group members. For large groups, batch the delivery.",
      "Presence: use Redis with TTL. Heartbeat every 30 seconds. If no heartbeat → TTL expires → offline.",
      "End-to-end encryption: messages encrypted on client, server can't read content (Signal protocol).",
      "HIDDEN GOTCHA — The 'Message Delivered But User Didn't See It' Problem: A message is marked 'delivered' when the client ACKs receiving it. But what if the app received it, ACK'd, then crashed before showing it to the user? The message shows double-check (delivered) to the sender, but the recipient never saw it. WhatsApp's solution: 'delivered' = received by device. 'Read' = user actually opened the conversation. The two blue checks are semantically different, and your system must track BOTH states. Also: what if the user's phone receives the message push notification but the app wasn't opened? That's 'delivered to device' but not 'delivered to app' — another edge case",
      "MOST DEVS DON'T KNOW — Message ID Generation Must Be Globally Ordered: If User A sends two messages quickly, both might arrive at the server 'at the same time' (same millisecond). How do you preserve order? (1) Use a TIMEUUID (Cassandra) or Snowflake ID: combines timestamp + machine ID + sequence number. Globally unique AND ordered. (2) Client-side sequence numbers: each client increments a local counter per conversation. Server uses this to detect and reorder out-of-sequence messages. WhatsApp uses a combination — server-assigned IDs for ordering + client sequence numbers for deduplication",
      "CRITICAL — Offline Message Queue: When User B is offline, where do messages go? Option 1: Store in Cassandra with 'undelivered' status. When B comes online, query for undelivered messages. Problem: delivering 1000 queued messages at reconnection causes a thundering herd. Option 2: Write to a per-user Kafka topic. When B connects, consume from their topic. Better for ordering but more infrastructure. The practical approach: store undelivered messages in Cassandra. On reconnection, sync in batches (50 messages at a time, paginated). Send push notifications for each message while offline (but rate-limit to avoid notification spam — batch into '23 new messages from Alice')",
    ],
    interviewScript: [
      { phase: "Requirements", duration: "3 min", content: "Clarify: 1:1 and group chat, message guarantees, features like read receipts.", tips: ["Ask: '1:1 only or groups too? Max group size?'", "Ask: 'Do we need end-to-end encryption?'", "Ask: 'How many concurrent users?'"] },
      { phase: "Estimation", duration: "2 min", content: "Calculate concurrent connections, message QPS, storage needs.", tips: ["100M connections = ~1000 WebSocket servers", "50B messages/day → storage grows fast → Cassandra"] },
      { phase: "High-Level Design", duration: "8 min", content: "Draw: gateway servers (WebSocket) → Kafka → message service → storage + delivery.", tips: ["WebSocket for real-time bidirectional communication", "Kafka ensures message ordering per conversation", "Cassandra for write-heavy message storage"] },
      { phase: "Deep Dive", duration: "8 min", content: "Message delivery guarantees, presence system, group chat fan-out.", tips: ["At-least-once delivery: persist first, then deliver. Client deduplicates.", "Presence: Redis TTL + heartbeats — simple and effective", "Group fan-out: publish once, deliver to all online members"] },
      { phase: "Wrap-up", duration: "3 min", content: "End-to-end encryption, message search, media handling.", tips: ["E2E encryption: Signal protocol, server can't decrypt", "Search: separate search index (Elasticsearch) on message metadata", "Media: upload to S3, share pre-signed URL in message"] },
    ],
    tags: ["chat", "websocket", "real-time", "messaging", "intermediate"],
  },
  {
    id: "sd-case-notification",
    chapterId: 8,
    title: "Design a Notification System",
    order: 4,
    difficulty: "beginner",
    description:
      "Design a notification system that supports push notifications (mobile), email, SMS, and in-app notifications. Must handle millions of notifications per day with priority levels, user preferences, and rate limiting. This question tests your ability to design a reliable, multi-channel delivery system. The key insight: the notification system is NOT one service — it's a PIPELINE. Trigger → validate preferences → rate limit → prioritize → route to channel → deliver → track. Each stage can fail independently, and failures in one channel (email down) must NOT block other channels (push should still work). The second insight: notification fatigue is a real product problem. Sending too many notifications causes users to disable ALL notifications or uninstall the app. Your system needs rate limiting, intelligent batching, and priority levels — not just delivery mechanics.",
    requirements: {
      functional: [
        "Send notifications via: push (iOS/Android), email, SMS, in-app",
        "Users configure notification preferences (which channels, which events)",
        "Priority levels: critical (immediate), high (within 1 min), normal (batched)",
        "Notification history and read/unread status",
        "Rate limiting to prevent notification spam",
      ],
      nonFunctional: [
        "Critical notifications delivered within 1 second",
        "Handle 10M+ notifications per day",
        "No duplicate notifications to the same user for the same event",
        "Graceful degradation if a channel is down (email down → don't block push)",
      ],
    },
    estimations: [
      { metric: "Notifications/day", value: "10M", explanation: "Across all channels" },
      { metric: "Peak QPS", value: "~500", explanation: "Most notifications cluster around business hours (3x average)" },
      { metric: "Push notification latency", value: "< 1 sec for critical", explanation: "Third-party services (APNs, FCM) add ~100-500ms" },
    ],
    architectureLayers: [
      { name: "Trigger Sources", components: ["Application Services", "Scheduled Jobs", "External Webhooks"], description: "Any service can trigger a notification via the notification API." },
      { name: "Notification Service", components: ["API", "Priority Queue", "Preference Engine", "Rate Limiter"], description: "Receives requests, checks preferences, applies rate limits, routes to channel workers." },
      { name: "Channel Workers", components: ["Push Worker (APNs/FCM)", "Email Worker (SES/SendGrid)", "SMS Worker (Twilio)", "In-App Worker"], description: "Each channel has independent workers. If email is down, push still works." },
      { name: "Data Layer", components: ["PostgreSQL (preferences, history)", "Redis (rate limiting, dedup)", "Kafka (event bus)"], description: "Preferences in relational DB, rate limiting counters in Redis." },
    ],
    architectureDiagram: `Trigger Services ──► [Notification API]
                              │
                    ┌─────────▼──────────┐
                    │ Preference Check   │
                    │ Rate Limit Check   │
                    │ Deduplication      │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Priority Queue   │
                    │   (Kafka/SQS)      │
                    └──┬──┬──┬──┬────────┘
                       │  │  │  │
                  ┌────┘  │  │  └────┐
                  ▼       ▼  ▼       ▼
              [Push]  [Email][SMS] [In-App]
              Worker  Worker Worker Worker
                │       │     │       │
                ▼       ▼     ▼       ▼
              APNs    SES  Twilio  WebSocket
              FCM   SendGrid       /Redis`,
    dataFlow: `1. Order Service calls POST /api/notifications { user_id, event: "order_shipped", data: {...} }
2. Notification Service:
   a. Check user preferences: "order updates" → push + email (user opted out of SMS)
   b. Rate limit check: has this user received > 10 notifications in the last hour? If yes, batch normal-priority ones.
   c. Deduplication: has this exact notification been sent? (Redis SET with TTL)
   d. Create notification record in PostgreSQL (for history/in-app display)
   e. Publish to Kafka priority topics: critical, high, normal
3. Channel Workers consume from Kafka:
   a. Push Worker → sends to APNs (iOS) and FCM (Android)
   b. Email Worker → sends via SES/SendGrid
   c. Each worker handles retries independently (3 retries with exponential backoff)
4. User opens app → fetch unread notifications from PostgreSQL → mark as read`,
    databaseSchema: `CREATE TABLE notification_preferences (
  user_id UUID, channel TEXT, event_type TEXT, enabled BOOLEAN,
  PRIMARY KEY (user_id, channel, event_type)
);

CREATE TABLE notifications (
  id UUID PK, user_id UUID, event_type TEXT, title TEXT,
  body TEXT, channels TEXT[], status TEXT, read BOOLEAN DEFAULT false,
  created_at TIMESTAMP, read_at TIMESTAMP
);
CREATE INDEX idx_notif_user ON notifications(user_id, created_at DESC);`,
    apiDesign: `-- Internal API (service-to-service)
POST /api/v1/notifications
  Body: { "user_id": "...", "event": "order_shipped", "priority": "high",
          "data": { "order_id": "...", "tracking_url": "..." } }

-- User-facing API
GET /api/v1/notifications?unread=true&limit=20
PATCH /api/v1/notifications/{id}/read
PUT /api/v1/notification-preferences
  Body: { "order_updates": { "push": true, "email": true, "sms": false } }`,
    scalingConsiderations: [
      "Independent channel workers: email outage doesn't affect push delivery",
      "Priority queues: critical notifications skip the normal queue and go directly to workers",
      "Batch processing: aggregate normal-priority notifications into digests (every 15 min)",
      "Rate limiting per user: prevent notification fatigue with per-user, per-channel limits",
      "Template engine: notifications use templates with variables — not hardcoded strings",
      "Monitoring: track delivery rates, open rates, and failure rates per channel",
      "HIDDEN GOTCHA — Push Notification Delivery is NOT Guaranteed: APNs (Apple) and FCM (Google) are 'best effort.' They guarantee delivery to their servers, NOT to the device. If the device is off, in airplane mode, or has poor connectivity, the notification might be silently dropped or delivered hours later. APNs keeps only the LATEST notification per topic — if you send 5 notifications while the user is offline, they get only the last one. Your system must handle this: important actions should ALSO be stored as in-app notifications, not rely solely on push. Push is a hint to open the app; the app then syncs the real notification state from your server",
      "MOST DEVS DON'T KNOW — The Device Token Rotation Problem: Push notification tokens (FCM registration tokens, APNs device tokens) can change at any time — app reinstall, OS update, token refresh. If you send to an old token, the message is lost. FCM fires an 'onTokenRefresh' callback, but if the user doesn't open the app for months, you never get the new token. Solution: (1) Update tokens on every app open, (2) Track token age — tokens > 6 months are probably stale, (3) Handle 'InvalidRegistration' / 'NotRegistered' errors from FCM/APNs by removing the token from your DB. Companies lose 5-15% of their push notification audience to stale tokens",
      "CRITICAL — Email Deliverability is a Science: Sending email is easy. Getting it into the inbox instead of spam is HARD. Key factors: (1) SPF, DKIM, and DMARC DNS records must be configured correctly, (2) IP reputation — sending from a new IP? Start with low volume and 'warm up' the IP over 2-4 weeks, (3) Bounce handling — immediately remove hard-bounced addresses (invalid email), soft-bounce retry 3 times then remove, (4) Unsubscribe link required by law (CAN-SPAM, GDPR), (5) Send rate: major ESPs (Gmail, Outlook) throttle senders who send too fast. Use a dedicated email service (SES, SendGrid, Postmark) — they handle deliverability for you",
    ],
    interviewScript: [
      { phase: "Requirements", duration: "3 min", content: "Clarify channels, scale, priority levels, and user controls.", tips: ["Ask: 'Which channels? Push, email, SMS, in-app?'", "Ask: 'Do users control their notification preferences?'", "Ask: 'What's the expected volume?'"] },
      { phase: "High-Level Design", duration: "8 min", content: "Draw the pipeline: triggers → preference check → rate limit → priority queue → channel workers.", tips: ["Key insight: independent workers per channel for isolation", "Priority queue ensures critical notifications aren't delayed", "User preferences gate which channels fire"] },
      { phase: "Deep Dive", duration: "8 min", content: "Discuss idempotency, rate limiting, and failure handling.", tips: ["Deduplication: idempotency key in Redis", "Rate limiting: token bucket per user per channel", "Retries: exponential backoff with DLQ for persistent failures"] },
      { phase: "Wrap-up", duration: "3 min", content: "Analytics, A/B testing, internationalization.", tips: ["Track: send rate, delivery rate, open rate per channel", "A/B test notification copy and timing", "i18n: template per locale, user's preferred language"] },
    ],
    tags: ["notification", "push", "email", "sms", "event-driven", "beginner"],
  },
  {
    id: "sd-case-rate-limiter",
    chapterId: 8,
    title: "Design a Distributed Rate Limiter",
    order: 5,
    difficulty: "intermediate",
    description:
      "Design a rate limiting service that protects APIs from abuse across a distributed system. Must handle millions of requests per second with different rate limit rules per user, endpoint, and plan tier. This question is deceptively simple — the basic algorithm (token bucket) takes 5 minutes to explain, but the DISTRIBUTED aspect is where the real complexity lies. The key challenge: multiple API servers each checking rate limits against a centralized Redis. Race conditions occur when two requests from the same user arrive at different servers simultaneously — both read 'tokens = 1', both decrement, now the user has -1 tokens (over-limit). The solution: atomic Redis operations using Lua scripts (EVAL). The second insight: rate limiting must be < 1ms per check because it runs on EVERY API request. Any latency you add here multiplies across every single request in your system.",
    requirements: {
      functional: [
        "Configurable rate limits per user, per API endpoint, per plan (free: 100/hr, pro: 10,000/hr)",
        "Support multiple algorithms: token bucket, sliding window",
        "Return rate limit headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
        "Dashboard for monitoring rate limit hits and patterns",
      ],
      nonFunctional: [
        "Rate limit check must be < 1ms (cannot add significant latency to every API call)",
        "Must work across distributed API servers (centralized counting)",
        "Highly available — if rate limiter is down, fail open (allow requests)",
        "Accurate within 1% tolerance (small over-count is acceptable)",
      ],
    },
    estimations: [
      { metric: "API requests/sec", value: "1M+", explanation: "Every API request goes through the rate limiter" },
      { metric: "Unique rate limit keys", value: "~10M", explanation: "user_id × endpoint combinations" },
      { metric: "Memory per key", value: "~50 bytes", explanation: "Token count + last refill timestamp" },
      { metric: "Total memory", value: "~500 MB", explanation: "10M keys × 50 bytes. Fits in a single Redis node's memory." },
    ],
    architectureLayers: [
      { name: "API Gateway", components: ["Rate limit middleware"], description: "Every request passes through rate limit check before reaching the service." },
      { name: "Rate Limiter Service", components: ["Rate limit logic", "Rule engine"], description: "Implements token bucket/sliding window. Can be a library or standalone service." },
      { name: "Storage", components: ["Redis Cluster"], description: "Centralized counter storage. Lua scripts for atomic check-and-decrement." },
      { name: "Configuration", components: ["Rules database", "Admin dashboard"], description: "Rate limit rules per endpoint and plan tier. Hot-reloadable without restart." },
    ],
    architectureDiagram: `┌─────────┐    ┌─────────────────────────────┐
│ Client  ├───►│  API Gateway / Middleware     │
└─────────┘    │  ┌───────────────────────┐    │
               │  │  Rate Limit Check     │    │
               │  │  Key: user:123:/api   │    │
               │  └───────────┬───────────┘    │
               └──────────────┼────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Redis Cluster    │
                    │                    │
                    │  Lua Script:       │
                    │  1. Check tokens   │
                    │  2. Decrement      │
                    │  3. Return result  │
                    │  (atomic)          │
                    └────────────────────┘`,
    dataFlow: `Rate Limit Check (per request):
1. Build rate limit key: "{user_id}:{endpoint}:{window}"
   Example: "user:123:/api/v1/search:2024-03-20T14:00"
2. Execute Redis Lua script (atomic):
   a. GET token count for key
   b. If tokens > 0: DECR tokens, return ALLOWED
   c. If tokens = 0: return REJECTED
   d. If key doesn't exist: SET key = max_tokens, EXPIRE = window, return ALLOWED
3. If ALLOWED: forward to API service
4. If REJECTED: return HTTP 429 with headers:
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 0
   X-RateLimit-Reset: 1710936000 (Unix timestamp)`,
    databaseSchema: `-- Redis: rate limit state (per key)
-- Key: ratelimit:{user_id}:{endpoint}:{window}
-- Value: remaining token count
-- TTL: window duration

-- PostgreSQL: rate limit rules
CREATE TABLE rate_limit_rules (
  id SERIAL PK,
  plan_tier TEXT,        -- free, pro, enterprise
  endpoint_pattern TEXT, -- /api/v1/search, /api/v1/*
  max_requests INT,      -- 100
  window_seconds INT,    -- 3600 (1 hour)
  algorithm TEXT          -- token_bucket, sliding_window
);`,
    apiDesign: `-- Admin API
GET /admin/rate-limits/rules
POST /admin/rate-limits/rules
  Body: { "plan": "free", "endpoint": "/api/v1/*", "max": 100, "window": 3600 }

-- Monitoring
GET /admin/rate-limits/stats?user_id=123
  Response: { "current_usage": 87, "limit": 100, "reset_at": "..." }

-- Response headers on every API call:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 13
X-RateLimit-Reset: 1710936000`,
    scalingConsiderations: [
      "Redis Lua scripts ensure atomicity without distributed locks (EVAL is atomic in Redis)",
      "Local cache: cache rate limit rules locally with 1-min TTL to avoid DB lookups per request",
      "Fail open: if Redis is unreachable, allow the request (availability > precision)",
      "Sliding window log for precise counting; fixed window for simplicity (accept boundary burst)",
      "Multi-region: each region has its own Redis. Accept slight over-counting across regions.",
      "Monitoring: alert when a user consistently hits rate limits (potential abuse or upgrade opportunity)",
      "HIDDEN GOTCHA — The Fixed Window Boundary Burst: A fixed window of 100 requests/hour uses windows like [1:00-2:00], [2:00-3:00]. User sends 100 requests at 1:59 (within the 1:00 window) and 100 requests at 2:01 (within the 2:00 window). Result: 200 requests in 2 minutes, but the rate limiter sees both as valid. This is the 'boundary burst' problem. Fix: use a SLIDING WINDOW. Implementation: sliding window LOG (store each request timestamp, count requests in the last hour — accurate but memory-heavy) or sliding window COUNTER (weight the previous window's count by overlap percentage — approximate but memory-efficient). The sliding window counter formula: count = prev_window_count × (overlap_%) + current_window_count",
      "MOST DEVS DON'T KNOW — Token Bucket vs Leaky Bucket vs Sliding Window: (1) Token Bucket: bucket fills at constant rate, each request takes a token. Allows BURSTS up to bucket size. Best for: APIs that allow short bursts (normal web apps). (2) Leaky Bucket (queue-based): requests enter a queue, processed at constant rate. SMOOTHS traffic. Best for: systems that need constant throughput (payment processing). (3) Sliding Window Counter: counts requests in a sliding time window. Most intuitive for 'X requests per Y time.' Best for: API rate limiting with clear quotas. Most tutorials teach token bucket, but sliding window counter is what most production systems actually use because it maps naturally to '100 requests per hour'",
      "CRITICAL — Rate Limiting vs DDoS Protection: Rate limiting protects your API from individual abusers (one user sending too many requests). DDoS protection protects your INFRASTRUCTURE from distributed attacks (millions of different IPs). Rate limiting happens at your application layer (after the request reaches your server). DDoS protection must happen at the NETWORK layer BEFORE requests reach your servers (Cloudflare, AWS Shield). A rate limiter cannot protect you from a volumetric DDoS attack — your servers are already overwhelmed before the rate limiter code runs. Always pair rate limiting with infrastructure-level DDoS protection",
    ],
    interviewScript: [
      { phase: "Requirements", duration: "2 min", content: "Clarify: single vs multi-server, accuracy needs, algorithms.", tips: ["Ask: 'Centralized or distributed rate limiting?'", "Ask: 'What happens when the rate limiter is down?'"] },
      { phase: "High-Level Design", duration: "5 min", content: "Draw: API gateway → rate limit middleware → Redis. Explain token bucket.", tips: ["Redis Lua script is the key insight — atomic check-and-decrement", "Token bucket: explain bucket size and refill rate"] },
      { phase: "Deep Dive", duration: "10 min", content: "Algorithm details, race conditions, distributed challenges.", tips: ["Race condition: without Lua scripts, two requests could both read tokens=1 and both pass", "Sliding window vs fixed window trade-offs", "Multi-region: local Redis per region, accept ~2x over-counting"] },
      { phase: "Wrap-up", duration: "3 min", content: "Monitoring, alerting, graceful degradation.", tips: ["Monitor: rate limit hit rate per user, per endpoint", "High hit rates → either abuse or need to upgrade plan", "Fail open is safer than fail closed for most applications"] },
    ],
    tags: ["rate-limiter", "token-bucket", "redis", "api-protection", "intermediate"],
  },
  {
    id: "sd-case-search-autocomplete",
    chapterId: 8,
    title: "Design Search Autocomplete",
    order: 6,
    difficulty: "intermediate",
    description:
      "Design a search autocomplete system (like Google's search suggestions) that returns relevant suggestions as users type. Must be extremely fast (< 50ms), handle billions of queries, and adapt to trending topics in real-time. This question is secretly about TWO different systems: (1) a SERVING system — in-memory Trie data structure for ultra-fast prefix lookups (< 50ms), and (2) an OFFLINE PIPELINE — batch/stream processing to aggregate query frequencies and rebuild the Trie. Most candidates nail the Trie part but forget the data pipeline. The key insight: the autocomplete suggestions are PRE-COMPUTED. You don't search through billions of queries at request time. Instead, every 15 minutes, a pipeline computes the top 10 suggestions for every prefix and bakes them into the Trie. At request time, it's just a prefix lookup into a pre-built map — that's why it's so fast.",
    requirements: {
      functional: [
        "Return top 5-10 autocomplete suggestions as the user types",
        "Suggestions ranked by: popularity (search frequency), recency, and personalization",
        "Support trending / real-time suggestions (breaking news topics appear quickly)",
        "Filter offensive or inappropriate suggestions",
        "Multi-language support",
      ],
      nonFunctional: [
        "Suggestion latency < 50ms P99 (must feel instant while typing)",
        "Handle 100K+ queries per second",
        "New trending topics appear in suggestions within 15 minutes",
        "Stale/outdated suggestions are acceptable for a short period (eventual consistency)",
      ],
    },
    estimations: [
      { metric: "Queries/day", value: "5 billion", explanation: "Each keystroke can trigger a suggestion request (with debouncing)" },
      { metric: "Unique prefixes", value: "~100M", explanation: "All unique query prefixes that have > threshold frequency" },
      { metric: "QPS", value: "~58K avg, ~175K peak", explanation: "5B / 86,400 ≈ 58K. Peak 3x." },
      { metric: "Storage", value: "~5 GB", explanation: "100M prefixes × ~50 bytes (prefix + top suggestions) = ~5 GB. Fits in memory." },
    ],
    architectureLayers: [
      { name: "Client", components: ["Browser / Mobile App"], description: "Sends keystrokes (debounced at ~100ms) to autocomplete API." },
      { name: "Autocomplete Service", components: ["Trie-based lookup servers"], description: "In-memory trie (prefix tree) for O(prefix length) lookups. Horizontally scaled." },
      { name: "Data Pipeline", components: ["Query aggregator", "Trie builder (offline)"], description: "Aggregates search queries, computes top suggestions per prefix, rebuilds trie periodically." },
      { name: "Storage", components: ["Redis / ZooKeeper (trie distribution)", "Kafka (query stream)", "HDFS/S3 (query logs)"], description: "Trie snapshots stored in Redis or distributed in-memory. Raw queries in object storage." },
    ],
    architectureDiagram: `┌──────────┐  debounced   ┌─────────────────────┐
│  Client  ├────────────►│ Autocomplete Service │
└──────────┘  keystrokes │ (in-memory Trie)     │
                         └──────────┬────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │        Trie Lookup           │
                     │   "hel" → [hello, help,     │
                     │            helmet, hero]     │
                     └──────────────────────────────┘
                     
Offline Pipeline (every 15 min):
  
  Search Queries ──► Kafka ──► Aggregator ──► Trie Builder
                                   │              │
                              Count queries   Build new trie
                              per prefix      with top-K per
                                              prefix
                                                   │
                                              Deploy to
                                              autocomplete
                                              servers`,
    dataFlow: `Real-time Suggestion:
1. User types "hel" → client sends GET /api/autocomplete?q=hel (debounced 100ms)
2. Autocomplete Service looks up "hel" in in-memory Trie
3. Returns pre-computed top 5 suggestions: ["hello world", "help center", "helmet laws", ...]
4. Client renders dropdown instantly (< 50ms total)

Trie Update Pipeline (every 15 min):
1. Every search query is logged to Kafka
2. Aggregator service counts query frequency per prefix in 15-min windows
3. Merges with historical frequency data (exponential decay for recency)
4. Trie Builder creates a new in-memory trie with top-10 suggestions per prefix
5. New trie is distributed to all autocomplete servers (blue-green deployment)
6. Trending topics: if a query's frequency spikes 10x in 15 min, boost its rank`,
    databaseSchema: `-- Trie is in-memory, not in a database
-- Backing storage for trie building:

-- Kafka: raw search queries (real-time stream)
-- Topic: search_queries, key: query text, value: { user_id, timestamp, location }

-- S3/HDFS: aggregated query counts (batch processing)
-- Format: { prefix: "hel", suggestions: [
--   { query: "hello world", count: 50000, trend_score: 1.2 },
--   { query: "help center", count: 30000, trend_score: 1.0 },
-- ]}

-- PostgreSQL: blocked/filtered suggestions
CREATE TABLE blocked_suggestions (
  pattern TEXT PRIMARY KEY,  -- regex or exact match
  reason TEXT,
  blocked_at TIMESTAMP
);`,
    apiDesign: `GET /api/v1/autocomplete?q=hel&limit=5&lang=en
  Response: {
    "suggestions": [
      { "text": "hello world", "score": 0.95 },
      { "text": "help center", "score": 0.87 },
      { "text": "helmet laws by state", "score": 0.72 }
    ]
  }
  
  Headers:
    Cache-Control: public, max-age=300
    (autocomplete results can be CDN-cached by prefix)`,
    scalingConsiderations: [
      "In-memory Trie: entire dataset (~5 GB) fits in RAM. Each server holds a complete trie copy.",
      "CDN caching: cache autocomplete results by prefix at the edge. 'hel' has the same suggestions for everyone.",
      "Client-side debouncing: don't send a request on every keystroke. Wait 100-200ms after last keypress.",
      "Sharding by prefix: if the trie is too large, shard by first 2 characters (aa-zz → 676 shards).",
      "Personalization: combine global suggestions with user's search history (client-side merge).",
      "Content filtering: block offensive suggestions using a blocklist + ML classifier.",
      "HIDDEN GOTCHA — Trie Updates Without Downtime: You can't modify the in-memory Trie while serving requests (concurrent read/write = corrupted data). Solution: blue-green deployment of Tries. Build a NEW Trie from the latest data pipeline output. Load it into memory ALONGSIDE the old Trie. Atomically swap the pointer (old Trie → new Trie). The old Trie is garbage-collected after in-flight requests complete. This gives you zero-downtime updates every 15 minutes. Alternative: use a concurrent-safe data structure like a concurrent HashMap with prefix→suggestions mappings instead of a traditional Trie (simpler, slightly more memory, equally fast)",
      "MOST DEVS DON'T KNOW — Autocomplete is NOT Full-Text Search: Autocomplete matches PREFIXES ('hel' → 'hello'). Full-text search matches TOKENS ('world' → 'hello world'). They use completely different data structures (Trie vs inverted index). Don't use Elasticsearch for autocomplete — it's optimized for full-text search. For autocomplete, a Trie or prefix-based Redis sorted set (ZRANGEBYLEX) is 10-100x faster. Google's autocomplete and Elasticsearch's search suggestion API are different systems internally. The exception: 'search as you type' queries in e-commerce (matching product names mid-word) use Elasticsearch's edge_ngram tokenizer — a hybrid approach",
      "CRITICAL — Trending Detection That Actually Works: 'A query's count increased' is not enough for trending. A query going from 100→200 searches is a 100% increase but might not be trending. A query going from 0→50 in 5 minutes IS trending. The formula: trending_score = (current_rate - expected_rate) / standard_deviation. High trending score = unusual spike. This is the Z-score approach. Twitter uses a similar method for trending topics. Combine with time decay: trending suggestions have a high initial score that decays exponentially over hours, so they naturally fall off the suggestions if the spike doesn't sustain",
    ],
    interviewScript: [
      { phase: "Requirements", duration: "2 min", content: "Clarify latency, scale, and ranking criteria.", tips: ["Key constraint: < 50ms — drives the solution (must be in-memory)", "Ask: 'Should suggestions be personalized?'", "Ask: 'How fast should trending topics appear?'"] },
      { phase: "High-Level Design", duration: "8 min", content: "Draw: client → autocomplete service (Trie) ← offline pipeline. Explain the Trie data structure.", tips: ["Trie gives O(prefix length) lookup — perfect for this", "Pre-compute top-K suggestions per prefix node", "Separate real-time serving from offline trie building"] },
      { phase: "Deep Dive", duration: "8 min", content: "Trie update pipeline, ranking algorithm, caching strategy.", tips: ["Trie rebuild every 15 min — balance freshness vs compute cost", "Ranking: frequency × recency_weight. Trending = frequency spike detection.", "CDN cache autocomplete results by prefix — huge win"] },
      { phase: "Wrap-up", duration: "3 min", content: "Personalization, filtering, multi-language.", tips: ["Personalization: append user's recent searches client-side", "Filtering: blocklist + ML classifier for offensive content", "Multi-language: separate tries per language"] },
    ],
    tags: ["autocomplete", "trie", "search", "real-time", "in-memory", "intermediate"],
  },
];
