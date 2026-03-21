import { SDTopic } from "../types";

export const networkingTopics: SDTopic[] = [
  {
    id: "sd-net-dns",
    chapterId: 2,
    title: "DNS & Domain Resolution",
    order: 1,
    difficulty: "beginner",
    estimatedMinutes: 10,
    overview:
      "DNS (Domain Name System) translates domain names (google.com) to IP addresses (142.250.80.46). It's a hierarchical, distributed directory that every internet request depends on. Understanding DNS is essential because it affects latency, availability, and is a common lever for load balancing (geo-DNS routes users to the nearest datacenter) and failover (health-check-aware DNS records). Here's what most developers miss: DNS is the most silently dangerous part of your infrastructure. A misconfigured TTL during a migration can leave 30% of your users pointing at dead servers for hours. A forgotten CNAME chain can add 200ms of latency. And very few teams have a DNS migration runbook — until their first DNS outage at 3 AM.",
    keyPoints: [
      "DNS resolution: Browser cache → OS cache → Resolver → Root → TLD → Authoritative",
      "Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver), TXT (metadata)",
      "TTL (Time to Live) controls how long DNS results are cached — lower TTL = faster failover but more load",
      "GeoDNS routes users to the nearest datacenter based on their IP location",
      "DNS can be a single point of failure — use multiple providers (Route53 + Cloudflare)",
      "DNS-based load balancing: return different IPs for the same domain (round-robin or weighted)",
      "HIDDEN GOTCHA: 'I changed the DNS record, why isn't it updating?' — Because TTL applies to the OLD record. If the old TTL was 24h, clients who cached it won't re-query for up to 24 hours. The fix: lower TTL to 60s DAYS before the actual migration, wait for old caches to expire, THEN make the change",
      "MOST DEVS DON'T KNOW: CNAME chains (A → CNAME → CNAME → A record) add a DNS lookup at each hop. Three CNAME hops = 3x resolution time. Some CDN setups accidentally create CNAME chains. Use 'dig +trace' to audit your DNS chain",
      "CRITICAL: Negative caching is real. If a DNS query returns NXDOMAIN (not found), resolvers cache that 'does not exist' response too. So if you create a new subdomain and it returns NXDOMAIN before propagation, some resolvers will cache the negative result for the SOA's minimum TTL (often 1 hour). Users get 'domain not found' even after the record exists",
      "DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt DNS queries, preventing ISPs from seeing which domains you visit. Chrome and Firefox use DoH by default. This breaks corporate DNS filtering and has caused massive debates in the networking community",
    ],
    deepDive: [
      {
        title: "DNS Resolution Flow",
        content:
          "When you type 'api.example.com': (1) Browser checks its cache. (2) OS checks /etc/hosts and its cache. (3) Query goes to recursive resolver (typically ISP or 8.8.8.8). (4) Resolver asks root nameserver 'who handles .com?'. (5) Root says 'ask .com TLD server at X'. (6) TLD server says 'example.com is handled by ns1.example.com at Y'. (7) Authoritative nameserver returns the actual IP. This whole chain typically takes 20-120ms on a cache miss.",
        diagram: `DNS Resolution:

  Browser ──► OS Cache ──► Recursive Resolver
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
               Root Server  TLD Server  Authoritative
               (.)          (.com)      (example.com)
                    │           │           │
                    └───────────┼───────────┘
                                │
                           IP: 93.184.216.34`,
      },
      {
        title: "The DNS Migration Playbook Nobody Teaches You",
        content:
          "Scenario: You're moving from AWS to GCP, or changing CDN providers, or migrating your primary domain.\n\nHere's the procedure that prevents 3 AM pages:\n\n1. **Two weeks before**: Lower TTL on ALL affected records from 3600 (1h) to 60s. This ensures by migration day, no resolver has a cache older than 60s.\n\n2. **Day of migration**: Make the DNS change. Within 60 seconds, all resolvers re-query and get the new IP.\n\n3. **Keep old servers running for 48 hours** — some resolvers ignore TTL or have bugs. Java's default DNS caching is INFINITE (yes, the JVM by default never refreshes DNS). Set `networkaddress.cache.ttl=60` in your Java security properties.\n\n4. **Verify with multiple tools**: dig @8.8.8.8, dig @1.1.1.1, whatsmydns.net, and test from different geographic regions.\n\n5. **After 48h**: Raise TTL back to 3600 or higher. Shut down old servers.\n\nThe trap: if you skip step 1 and change DNS with a 24h TTL, some users will be stuck on the old IP for a FULL DAY. If you've already shut down the old servers... those users get errors for 24 hours. This has caused real production incidents at major companies.",
      },
      {
        title: "Anycast Routing — How CDNs Get <10ms DNS",
        content:
          "Anycast is a routing technique where the SAME IP address is announced from multiple locations worldwide. When you query 1.1.1.1 (Cloudflare DNS), the network routes you to the NEAREST server announcing that IP. This is why Cloudflare DNS resolves in <11ms globally — there's a server within a few network hops of almost every user.\n\nThe magic: all the servers have the same IP address. BGP routing naturally selects the shortest path. If a server goes down, BGP reroutes to the next-nearest server automatically.\n\nThis is different from GeoDNS: GeoDNS returns different IPs based on the client's location (requires DNS-level logic). Anycast uses the same IP everywhere but the NETWORK routes to the nearest physical server. Anycast is used for DNS, CDN, and DDoS protection. GeoDNS is used for directing users to specific regional backend servers.\n\nWhy you care: in system design, when you say 'we'll use a CDN', the CDN itself uses anycast to route users. And when you say 'we'll use Route53 or Cloudflare DNS', those DNS services use anycast. It's anycast all the way down.",
      },
      {
        title: "DNS Attacks and Security You Should Know",
        content:
          "1. **DNS Spoofing/Cache Poisoning**: Attacker injects fake DNS records into a resolver's cache. Users query 'bank.com' and get the attacker's IP. Defense: DNSSEC (digital signatures on DNS records), but adoption is still <30% of domains.\n\n2. **DNS Amplification DDoS**: DNS responses are much larger than queries (50B query → 3000B response with DNSSEC). Attacker spoofs the victim's IP and sends millions of DNS queries. Resolvers blast 60x amplified responses at the victim. This is one of the most common DDoS attack vectors.\n\n3. **DNS Rebinding**: Attacker serves DNS with very short TTL, first resolving to their server, then to an internal IP (e.g., 192.168.1.1). Browser allows the request because 'same domain'. This bypasses CORS and firewalls. It's how attackers can access your local network services through a browser.\n\n4. **Subdomain Takeover**: You point subdomain.example.com CNAME to yourapp.herokuapp.com. You delete the Heroku app but leave the CNAME record. Attacker claims 'yourapp' on Heroku and now controls subdomain.example.com. This happens constantly — scan your DNS for dangling CNAMEs.\n\nThis matters in interviews when discussing security layers of your system design. DNS is often the first attack surface.",
      },
    ],
    realWorldExamples: [
      { company: "Cloudflare", description: "Operates one of the largest DNS networks (1.1.1.1) with < 11ms average resolution worldwide. Their anycast network routes DNS queries to the nearest POP (point of presence)." },
      { company: "Netflix", description: "Uses AWS Route53 with health checks. If a datacenter goes down, DNS automatically routes traffic to healthy regions within the TTL window." },
    ],
    tradeOffs: [
      { optionA: "Low TTL (30s)", optionB: "High TTL (24h)", comparison: "Low TTL: fast DNS-based failover, more DNS queries (cost/load). High TTL: fewer queries, cached longer, but slow to propagate changes." },
    ],
    interviewTips: [
      "Mention DNS as the first step in any web request — shows end-to-end thinking",
      "GeoDNS is a simple way to reduce latency for global users",
      "DNS can be used for basic load balancing and failover",
    ],
    practiceQuestions: [
      { question: "How would you handle DNS failover for a multi-region deployment?", answer: "Use health-check-aware DNS (like Route53). Configure DNS records with health checks that ping your servers every 10-30 seconds. If a region's health check fails, DNS automatically removes that region's IP from responses and routes traffic to healthy regions. Set TTL to 60s for faster failover. Use multiple DNS providers for resilience." },
    ],
    tags: ["dns", "networking", "geo-dns", "ttl", "failover"],
  },
  {
    id: "sd-net-cdn",
    chapterId: 2,
    title: "CDN (Content Delivery Network)",
    order: 2,
    difficulty: "beginner",
    estimatedMinutes: 12,
    overview:
      "A CDN is a globally distributed network of edge servers that cache and serve content closer to users. Instead of every request traveling to your origin server in Virginia, a user in Tokyo gets the response from a CDN edge node in Tokyo (~20ms vs ~200ms). CDNs handle static assets (images, CSS, JS), video streaming, and increasingly dynamic content through edge computing. Companies like Cloudflare, Akamai, and AWS CloudFront operate CDN networks with hundreds of POPs worldwide. The thing most developers don't grasp: CDNs aren't just about caching static files anymore. Modern CDNs run code at the edge (Cloudflare Workers, Lambda@Edge), make authorization decisions, personalize content, and even run entire applications. The CDN IS the server for an increasing number of architectures.",
    keyPoints: [
      "Push CDN: you upload content to the CDN proactively (good for content you know in advance)",
      "Pull CDN: CDN fetches from origin on first request, then caches (good for dynamic sites)",
      "Edge locations (POPs) are distributed globally — 200+ locations for major CDNs",
      "Cache invalidation is the hardest problem: TTL-based, versioned URLs, or explicit purge",
      "CDNs also provide DDoS protection, TLS termination, and request coalescing",
      "Cost model: pay per GB transferred + requests — can be significant at scale",
      "HIDDEN GOTCHA — Cache key design: By default, CDN caches by full URL including query params. 'api.com/users?v=1' and 'api.com/users?v=2' are different cache entries. But if your API adds tracking params (utm_source, fbclid), each unique URL becomes a cache miss. Configure cache key rules to ignore irrelevant query params",
      "MOST DEVS DON'T KNOW: Origin Shield is a pattern where you place one CDN POP between all edge POPs and your origin. Without it: 200 edge POPs all miss cache → 200 simultaneous requests hit your origin. With origin shield: 200 edge POPs miss → 1 shield POP fetches from origin → distributes to all edges. Reduces origin load by 100x during cache population",
      "CRITICAL: Request coalescing (also called 'request collapsing') means when the CDN gets 1000 simultaneous cache misses for the same URL, it sends only ONE request to origin and serves the response to all 1000 clients. This single feature can save your origin during traffic spikes — make sure your CDN supports it",
      "CDNs operate at Layer 7 (HTTP), which means they can make routing decisions based on headers, cookies, URL path. This enables A/B testing at the edge, canary deployments, and geographic content restrictions without changing your application code",
    ],
    deepDive: [
      {
        title: "How CDN Caching Works",
        content:
          "User requests example.com/image.png. CDN edge checks its cache. Cache HIT: serve directly (~5ms). Cache MISS: edge fetches from origin, caches the response, serves to user. Subsequent requests to the same POP get the cached version. Cache-Control headers (max-age, s-maxage, stale-while-revalidate) dictate how long content stays cached.",
        diagram: `CDN Request Flow:

  User (Tokyo)
      │
      ▼
  CDN Edge (Tokyo)  ──  Cache HIT? ── YES ──► Serve (5ms)
      │                                 
      NO (Cache MISS)
      │
      ▼
  Origin Server (Virginia) ── Response ──► CDN caches + serves`,
      },
      {
        title: "Cache Invalidation Strategies",
        content:
          "The 'two hard problems in CS' joke is real. Options: (1) TTL-based: set max-age=3600 (1 hour), content auto-expires. Simple but stale for up to TTL. (2) Versioned URLs: style.v2.css or style.css?v=abc123. Instant invalidation by changing URL. Best for assets. (3) Purge API: explicitly tell CDN to drop cached content. Used for urgent updates. (4) stale-while-revalidate: serve stale content while fetching fresh in background.",
      },
      {
        title: "Edge Computing — The CDN Becomes Your Server",
        content:
          "Cloudflare Workers, AWS Lambda@Edge, Vercel Edge Functions, and Deno Deploy run your code on CDN edge nodes worldwide. This isn't just caching — it's computation at the edge.\n\nReal use cases that blow people's minds:\n▸ **A/B testing**: Edge decides which variant to serve before the request reaches your origin. Zero latency cost for the experiment.\n▸ **Authentication**: Validate JWTs at the edge. If the token is invalid, reject immediately without ever hitting your servers. Saves compute AND reduces attack surface.\n▸ **Personalization**: Geo-locate the user at the edge, inject their country/language into the request headers, serve pre-rendered localized content from cache.\n▸ **Bot detection**: Analyze request patterns at the edge, block scrapers and bots before they consume origin resources.\n▸ **API gateway**: Route requests, transform headers, rate limit — all at the edge, all before your actual servers see traffic.\n\nThe limitation: edge functions typically have <128MB memory, 10-50ms CPU time limits, and limited access to databases (though this is changing with edge databases like Turso, Neon, PlanetScale). They're not for heavy computation, but they're perfect for request routing, auth, and content assembly.\n\nThe trend: full-stack frameworks (Next.js, Remix, Nuxt) are moving rendering to the edge. Your 'server' isn't in Virginia anymore — it's 200 locations worldwide.",
      },
      {
        title: "The Stale Content Disaster — A Real War Story",
        content:
          "Here's a scenario that has brought down companies:\n\n1. You deploy a new API version that changes the response format from {data: [...]} to {items: [...]}\n2. Your frontend JavaScript is cached by the CDN with max-age=86400 (24 hours)\n3. The OLD frontend (cached) tries to read response.data from the NEW API — gets undefined\n4. Your entire site is broken for up to 24 hours for users hitting CDN cache\n\nThe fix — the 'immutable assets' pattern:\n▸ Asset files get content hashes: main.a1b2c3.js (never changes, cache forever)\n▸ HTML files are NEVER cached (or max-age=0, stale-while-revalidate=60)\n▸ When you deploy, new HTML references new hashed assets\n▸ Users always get fresh HTML that points to correct assets\n▸ Old assets stay cached (they still work for users mid-session)\n\nThis is why every modern bundler (Webpack, Vite, esbuild) includes content hashes in filenames. It's not a nice-to-have — it prevents production outages.\n\nAnother gotcha: CDN purge is NOT instant. CloudFront takes 5-15 minutes. Cloudflare is faster (~30 seconds) but not immediate. During that window, some users see old content, some see new. If your old and new versions are incompatible, that window is painful. Versioned URLs avoid this entirely.",
      },
    ],
    realWorldExamples: [
      { company: "Netflix", description: "Open Connect is Netflix's own CDN. They install edge servers inside ISP networks to serve 15% of global internet bandwidth. Content is pre-pushed to edges during off-peak hours." },
      { company: "Shopify", description: "Uses Cloudflare's CDN for all storefronts. Static pages are edge-cached, reducing origin load by 80%+. Dynamic cart/checkout still hits origin but benefits from optimized network routes." },
    ],
    tradeOffs: [
      { optionA: "Push CDN", optionB: "Pull CDN", comparison: "Push: you control what's cached, predictable, costs more storage. Pull: automatic, only caches what's requested, first request per POP is slow (origin fetch)." },
    ],
    interviewTips: [
      "Always mention CDN for any system serving global users — it's the easiest latency win",
      "Distinguish between caching static assets (easy) and dynamic content (harder, requires cache keys)",
      "Mention cache invalidation as a key challenge and how you'd solve it",
    ],
    practiceQuestions: [
      { question: "When would you NOT use a CDN?", answer: "When content is: (1) highly personalized per-user (e.g., a dashboard with private data — low cache hit rate), (2) real-time and changes every second (e.g., live stock prices), (3) internal/private network only (no public users), or (4) very low traffic (CDN cost doesn't justify the latency savings). Even in some of these cases, you can use edge computing to personalize at the CDN level." },
    ],
    tags: ["cdn", "caching", "edge", "latency", "static-assets"],
  },
  {
    id: "sd-net-rest-graphql-grpc",
    chapterId: 2,
    title: "REST vs GraphQL vs gRPC",
    order: 3,
    difficulty: "intermediate",
    estimatedMinutes: 15,
    overview:
      "Three dominant API paradigms: REST (resource-oriented, HTTP verbs, JSON), GraphQL (query language, client specifies exact data shape, single endpoint), and gRPC (binary protocol, protocol buffers, streaming). REST is the default for public APIs. GraphQL shines for complex client apps with varied data needs (mobile vs web). gRPC dominates service-to-service communication where performance matters. The honest truth most senior engineers know: the choice between these three is less important than how well you implement whichever one you pick. A well-designed REST API beats a poorly-designed GraphQL API every time. But understanding the tradeoffs lets you make the right call for your specific situation — and that's what interviewers want to see.",
    keyPoints: [
      "REST: stateless, cacheable, uses HTTP verbs (GET/POST/PUT/DELETE), resource-based URLs",
      "GraphQL: single POST endpoint, client queries for exact fields, avoids over-fetching",
      "gRPC: HTTP/2, binary serialization (protobuf), 10x faster than REST, bidirectional streaming",
      "REST for: public APIs, simple CRUD, cacheability matters",
      "GraphQL for: complex UIs needing flexible data, mobile apps (minimize data transfer)",
      "gRPC for: microservice-to-microservice, low-latency, high-throughput internal calls",
      "HIDDEN GOTCHA — GraphQL N+1 problem: query { users { posts { comments } } } naively fetches all users, then for EACH user fetches posts, then for EACH post fetches comments. This can turn 1 client request into 1000+ database queries. The fix is DataLoader (batching + caching) — but most tutorials skip this, and it's the #1 GraphQL performance killer in production",
      "MOST DEVS DON'T KNOW: GraphQL is vulnerable to complexity attacks. A client can send: { users { friends { friends { friends { posts { comments { author { posts } } } } } } } }. This is exponential work on the server. You MUST implement query depth limiting, query cost analysis, or persisted queries (whitelist) for any public GraphQL API. GitHub's GraphQL API limits to 500,000 'node' cost per query",
      "REST versioning is an unsolved war: URL versioning (/v1/users) vs header versioning (Accept: application/vnd.api+json;v=2) vs no versioning (evolve the API with additive changes only). Most successful APIs use URL versioning because it's simplest, despite being 'impure'. Stripe's API is the gold standard of REST versioning",
      "gRPC's killer feature isn't speed — it's the generated client libraries. Write one .proto file, automatically get type-safe clients for Go, Java, Python, Rust, C++, etc. This eliminates an entire class of integration bugs. It's why Google uses gRPC internally for 10B+ RPC calls/second",
    ],
    deepDive: [
      {
        title: "The Over-fetching / Under-fetching Problem",
        content:
          "REST returns fixed response shapes. GET /users/1 returns ALL user fields even if you only need the name. That's over-fetching. To get a user's posts, you make another request GET /users/1/posts. That's under-fetching (N+1 problem). GraphQL solves both: query { user(id: 1) { name, posts { title } } } — one request, exact data. But GraphQL responses aren't cacheable by default (everything is POST to one endpoint), and query complexity can overload the server.",
      },
      {
        title: "gRPC and Protocol Buffers",
        content:
          "gRPC uses Protocol Buffers (protobuf) — a binary serialization format 5-10x smaller and faster than JSON. You define your service contract in a .proto file, generate client/server code automatically, and get type safety, streaming, and deadline propagation for free. It's the backbone of Google's internal communication (10+ billion RPC calls per second). The downside: not browser-friendly (needs a proxy like Envoy for web clients), binary format isn't human-readable for debugging.",
      },
      {
        title: "The BFF Pattern — The Real-World Answer",
        content:
          "In practice, the answer to 'REST vs GraphQL vs gRPC?' is often 'all three, in the right places.' The Backend For Frontend (BFF) pattern:\n\n▸ Mobile BFF: A lightweight GraphQL or REST API optimized for mobile screen sizes and bandwidth constraints\n▸ Web BFF: A GraphQL API that aggregates data for complex dashboard UIs\n▸ Internal: All microservices communicate via gRPC\n▸ Public API: REST with versioning for third-party developers\n\nEach client type gets an API tailored to its needs. The BFF acts as an aggregation layer that talks gRPC to backend services and translates to the client's preferred protocol.\n\nNetflix does exactly this: they have a 'Studio BFF' for their content creation apps, a 'Consumer BFF' for the streaming app, and all backend services use gRPC. The key insight: the API your mobile app needs is fundamentally different from what your admin dashboard needs. One API shape can't serve both well.\n\nWhy this matters in interviews: when the interviewer asks 'what API protocol would you use?', the senior answer is 'it depends on the client' and then you describe BFF. This shows architectural maturity.",
      },
      {
        title: "REST API Design Mistakes That Haunt You Forever",
        content:
          "Once a public API is published, changing it is nearly impossible without breaking clients. Here are the mistakes that cost companies millions in engineering hours:\n\n1. **Inconsistent naming**: /getUsers, /user-list, /api/v1/Users — pick one convention (kebab-case plural nouns: /users, /order-items) and enforce it\n\n2. **Not using HTTP status codes properly**: Returning 200 with {error: 'not found'} instead of 404. Clients can't distinguish success from failure without parsing the body.\n\n3. **Nested URLs that go too deep**: /users/123/orders/456/items/789/reviews — beyond 2 levels, use query params or separate endpoints\n\n4. **No pagination from day one**: /users returns ALL users. Works great with 100 users. Crashes with 10 million. Always paginate from the start. Cursor-based pagination (after=xyz) is better than offset-based (page=5) because it handles inserts/deletes during pagination.\n\n5. **Exposing internal IDs**: /users/1 tells attackers your user count and lets them enumerate all users. Use UUIDs or opaque IDs.\n\n6. **No rate limiting, no pagination limits**: a single client can fetch 1 million records or make 10,000 requests/second. Always have limits.\n\n7. **Breaking changes in 'minor' updates**: Removing a field, changing a type (string→number), renaming a key — all breaking. Treat your API like a contract. Add fields freely, never remove or rename them.",
      },
    ],
    realWorldExamples: [
      { company: "GitHub", description: "Offers both REST API v3 and GraphQL API v4. Migrated to GraphQL for their web UI because it reduced API calls and payload sizes significantly." },
      { company: "Netflix", description: "Uses gRPC for inter-service communication between 1000+ microservices. REST for public-facing APIs. The performance gain is critical at their scale." },
    ],
    tradeOffs: [
      { optionA: "REST", optionB: "GraphQL", comparison: "REST: simple, cacheable, well-understood, may over/under-fetch. GraphQL: flexible queries, single endpoint, harder to cache, risk of expensive queries." },
      { optionA: "REST", optionB: "gRPC", comparison: "REST: human-readable, browser-friendly, higher latency. gRPC: binary (fast), type-safe, streaming, not browser-native." },
    ],
    interviewTips: [
      "Default to REST for public-facing APIs — it's the most widely understood",
      "Mention gRPC for internal service communication when discussing microservices",
      "If the system has mobile clients, GraphQL can reduce data transfer significantly",
    ],
    practiceQuestions: [
      { question: "You're designing a system with 50 microservices and a mobile app. What API protocols would you use?", answer: "gRPC for service-to-service communication (low latency, type safety, streaming). REST or GraphQL for the mobile client API gateway. I'd lean GraphQL for mobile because different screens need different data shapes, and minimizing network calls matters on mobile. Use an API gateway that translates between the public API (REST/GraphQL) and internal gRPC calls." },
    ],
    tags: ["rest", "graphql", "grpc", "api-design", "protobuf"],
  },
  {
    id: "sd-net-websockets",
    chapterId: 2,
    title: "WebSockets & Real-time Communication",
    order: 4,
    difficulty: "intermediate",
    estimatedMinutes: 10,
    overview:
      "WebSockets provide full-duplex, persistent connections between client and server over a single TCP connection. Unlike HTTP (request-response), WebSocket connections stay open, allowing the server to push data to clients in real-time. Essential for chat apps, live notifications, multiplayer games, collaborative editing, and live dashboards. Alternatives include Server-Sent Events (SSE) for one-way server push and long polling as a fallback. Here's the thing tutorials gloss over: opening a WebSocket is easy. Scaling to 100K+ concurrent connections, handling reconnections gracefully, and maintaining connection state when servers restart — that's where real engineering happens.",
    keyPoints: [
      "WebSocket: bidirectional, full-duplex, persistent TCP connection",
      "SSE (Server-Sent Events): one-way server → client, uses HTTP, simpler than WebSocket",
      "Long Polling: client keeps making HTTP requests, server holds response until new data arrives",
      "WebSockets need sticky sessions or a pub/sub layer to work across multiple servers",
      "Connection management is the challenge: handling 1M+ concurrent connections requires careful tuning",
      "Use WebSockets when you need real-time bidirectional data; use SSE for simple push notifications",
      "HIDDEN GOTCHA: WebSocket connections are STATEFUL, which breaks horizontal scaling. If User A connects to Server 1 and User B connects to Server 2, how does A send a message to B? You need a pub/sub backbone (Redis, Kafka) connecting all servers. Every WebSocket server subscribes to relevant channels and pushes messages to its connected clients",
      "MOST DEVS DON'T KNOW: Each WebSocket connection consumes a file descriptor on the server. Linux default is 1,024 file descriptors per process. For 100K connections, you need: ulimit -n 200000 + sysctl net.core.somaxconn=65535 + multiple worker processes. This is low-level OS tuning that most web developers never encounter until their WebSocket server mysteriously stops accepting connections",
      "CRITICAL: Heartbeat/keepalive pings are NOT optional. Without them: NAT routers and load balancers silently close idle TCP connections after 60-120 seconds. The server thinks the client is connected, the client thinks it's connected, but the connection is dead. Send ping frames every 30 seconds. If no pong received in 10 seconds, consider the connection dead and clean up server-side state",
      "HTTP/2 Server Push was supposed to replace WebSockets for one-way push, but it was removed from Chrome in 2022 because it was almost never used correctly. SSE over HTTP/2 is now the recommended alternative for one-way server-to-client push",
    ],
    deepDive: [
      {
        title: "WebSocket vs HTTP",
        content:
          "HTTP: client sends request, server responds, connection closes. For real-time updates, client must keep asking (polling). WebSocket: client opens connection with HTTP Upgrade, both sides can send messages anytime. One TCP connection, zero overhead per message. A chat message over HTTP: ~800 bytes headers + payload. Over WebSocket: just the payload (~50 bytes). At 10K messages/sec, that's 7.5 MB/s saved.",
        diagram: `HTTP Polling vs WebSocket:

HTTP Polling:                    WebSocket:
Client ──req──► Server           Client ══════════ Server
Client ◄──res── Server             ◄── msg ──►
Client ──req──► Server              ◄── msg ──►
Client ◄──res── Server              ◄── msg ──►
(repeat every N seconds)         (persistent connection)`,
      },
      {
        title: "Scaling WebSockets — The Architecture Nobody Explains",
        content:
          "The core problem: WebSocket connections are stateful. HTTP is stateless — any server can handle any request. WebSocket requires the SAME server to handle messages for the duration of the connection. Here's how production systems solve this:\n\n**Architecture: Connection Gateway + Pub/Sub**\n\n1. **Connection Gateway Layer**: Stateless servers that only hold WebSocket connections. They don't contain business logic — they're just pipes.\n\n2. **Pub/Sub Backbone** (Redis Pub/Sub, Kafka, NATS): All gateway servers subscribe to relevant message channels.\n\n3. **Application Layer**: Stateless services that process business logic and publish messages to the pub/sub system.\n\nFlow: User A (Server 1) sends message to User B (Server 2):\n- Server 1 receives message via WebSocket\n- Publishes to Redis channel 'user:B:messages'\n- Server 2 is subscribed to 'user:B:messages'\n- Server 2 pushes message to User B via their WebSocket\n\nThis decouples connection management from message routing. Gateway servers can scale independently. If a gateway server dies, clients reconnect to any other gateway server — the pub/sub ensures messages still route correctly.\n\nSlack uses exactly this pattern. Discord uses a similar approach with Erlang/Elixir for the gateway layer (chosen because Erlang was literally built for managing millions of concurrent connections — it powers telephone switches).",
        diagram: `Scaled WebSocket Architecture:

  Clients                  Gateway Layer           Pub/Sub        App Layer
  ┌──────┐               ┌────────────┐         ┌─────────┐    ┌─────────┐
  │User A├──WS──────────►│ Gateway 1  ├────pub──►│         │    │         │
  │User B│               │ (50K conn) │◄───sub───│  Redis  │◄───│  Chat   │
  └──────┘               └────────────┘         │  Pub/Sub │    │ Service │
  ┌──────┐               ┌────────────┐         │         │    │         │
  │User C├──WS──────────►│ Gateway 2  ├────pub──►│         │    └─────────┘
  │User D│               │ (50K conn) │◄───sub───│         │
  └──────┘               └────────────┘         └─────────┘`,
      },
      {
        title: "Reconnection Strategies — The Part Everyone Gets Wrong",
        content:
          "WebSocket connections WILL drop. Mobile users switch from WiFi to cellular. Servers deploy and restart. Network hiccups happen. Your reconnection strategy determines whether users see a 'connected/disconnected/connected' flicker or a smooth experience.\n\n**Exponential Backoff with Jitter** (the correct approach):\n- 1st retry: 1 second + random(0-500ms)\n- 2nd retry: 2 seconds + random(0-1000ms)\n- 3rd retry: 4 seconds + random(0-2000ms)\n- Max: cap at 30 seconds\n\nWhy jitter? Without it, when a server restarts and 50,000 clients try to reconnect, they ALL retry at exactly the same intervals. At t=1s: 50,000 connection attempts. At t=2s: another 50,000. This is the **thundering herd problem** for WebSockets. Jitter spreads the reconnections over time.\n\n**Message Ordering During Reconnection**:\nWhen a client reconnects, it needs to catch up on missed messages. Two patterns:\n1. **Last Event ID**: Client sends its last received message ID on reconnect. Server replays all messages after that ID. SSE has this built-in (Last-Event-ID header).\n2. **Sync endpoint**: On reconnect, client calls an HTTP endpoint to fetch missed data, then resumes WebSocket for new messages.\n\nThe mistake: assuming messages arrive in order. Two messages sent 1ms apart can arrive out of order due to network conditions. If ordering matters (chat, collaborative editing), include sequence numbers and re-order on the client side.",
      },
    ],
    realWorldExamples: [
      { company: "Slack", description: "Uses WebSockets for real-time messaging. Each online user has a persistent connection. They handle millions of concurrent WebSocket connections using a gateway service that routes messages." },
      { company: "Figma", description: "Uses WebSockets for real-time collaborative editing. Multiple users editing the same design file see each other's changes in real-time through operational transform over WebSocket connections." },
    ],
    tradeOffs: [
      { optionA: "WebSockets", optionB: "Server-Sent Events (SSE)", comparison: "WebSocket: bidirectional, any data format, more complex. SSE: server→client only, text-based, auto-reconnect built-in, simpler, works through proxies/CDNs." },
    ],
    interviewTips: [
      "For chat/messaging systems, always mention WebSockets as the transport layer",
      "Discuss how to scale WebSockets: sticky sessions, a pub/sub backbone (Redis Pub/Sub), connection gateways",
      "Mention fallback strategies: WebSocket → SSE → long polling for maximum compatibility",
    ],
    practiceQuestions: [
      { question: "How would you push real-time notifications to 10 million connected users?", answer: "Use a gateway layer of stateless WebSocket servers behind a load balancer (with sticky sessions). Each server handles ~100K connections. Use Redis Pub/Sub or Kafka as a message bus: when a notification is created, publish to the topic, all gateway servers with subscribed users push the message. For users not currently connected, queue notifications for delivery on next connection. Connection servers need high file descriptor limits (ulimit), keep-alive pings, and graceful reconnection handling." },
    ],
    tags: ["websockets", "real-time", "sse", "long-polling", "push-notifications"],
  },
  {
    id: "sd-net-rate-limiting",
    chapterId: 2,
    title: "Rate Limiting",
    order: 5,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "Rate limiting controls how many requests a client can make in a given time window. It protects APIs from abuse, DDoS attacks, and ensures fair usage across all clients. Common algorithms: Token Bucket (smooth rate), Sliding Window Log (precise), Fixed Window Counter (simple), and Leaky Bucket (constant output rate). Rate limits are typically enforced at the API gateway or a dedicated middleware layer. What most engineers underestimate: rate limiting is easy to implement for a single server. It becomes a distributed systems problem the moment you have more than one server. And getting it wrong means either blocking legitimate users (false positives) or letting attackers through (false negatives).",
    keyPoints: [
      "Token Bucket: tokens are added at a fixed rate, each request consumes a token. Allows bursts up to bucket capacity.",
      "Sliding Window Log: tracks timestamps of all requests in the window. Most accurate but memory-intensive.",
      "Fixed Window Counter: counts requests per fixed time interval (e.g., per minute). Simple but has boundary burst problem.",
      "Leaky Bucket: requests enter a queue processed at a fixed rate. Smooth output but no burst tolerance.",
      "Rate limits should return HTTP 429 (Too Many Requests) with Retry-After header",
      "Distributed rate limiting is hard — use Redis for shared counters across servers",
      "HIDDEN GOTCHA — Fixed Window boundary burst: If limit is 100/minute and a user sends 100 requests at 0:59 and 100 at 1:01, they've sent 200 requests in 2 seconds while technically never exceeding the per-minute limit. The Sliding Window Counter algorithm (hybrid of fixed window + sliding log) solves this by weighting the previous window's count. Formula: current_window_count + (previous_window_count × overlap_percentage)",
      "MOST DEVS DON'T KNOW: Distributed rate limiting with Redis has a RACE CONDITION. Two servers simultaneously: GET count=99 (under limit 100) → both INCR → count=101 (over limit!). The fix: use a Lua script (EVAL) that atomically checks-and-increments in a single Redis operation. Or use Redis's built-in MULTI/EXEC for basic atomicity",
      "CRITICAL: Rate limiting should happen at MULTIPLE layers. Layer 1: CDN/WAF (Cloudflare) blocks known bad IPs and volumetric attacks. Layer 2: API Gateway enforces per-API-key limits. Layer 3: Application enforces per-user, per-resource limits. Each layer catches different attack types",
      "Client-side retry etiquette: When you GET a 429, use exponential backoff with jitter. Too many clients retrying at exact same intervals creates synchronized thundering herds. Stripe's API client SDKs implement this automatically — study their retry logic as a reference implementation",
    ],
    deepDive: [
      {
        title: "Token Bucket Algorithm",
        content:
          "The most widely used algorithm. Imagine a bucket that holds N tokens. Tokens are added at rate R per second. Each request takes one token. If the bucket is empty, the request is rejected. This naturally allows short bursts (up to N requests) while maintaining a long-term rate of R. Example: bucket size=10, refill rate=5/sec. A client can burst 10 requests instantly, then 5/sec thereafter.",
        diagram: `Token Bucket:

  [Token Source] ──── rate: 5/sec ────► [Bucket: max 10]
                                              │
                                         take 1 token
                                              │
                                         ┌────▼────┐
                                         │ Request  │
                                         │ allowed? │
                                         └────┬────┘
                                      YES     │     NO
                                   Process    429 Rate Limited`,
      },
      {
        title: "Rate Limiting in Distributed Systems — The Real Challenge",
        content:
          "You have 10 API servers behind a load balancer. Rate limit: 100 requests/minute per user. Problem: if you rate-limit locally per server, a user can send 100 × 10 = 1,000 requests/minute by hitting different servers.\n\nSolution 1 — Centralized Redis counter:\n- Key: rate_limit:{user_id}:{current_minute}\n- On each request: INCR key, EXPIRE key 60s\n- If count > limit: reject\n- Problem: Redis becomes a single point of failure and latency bottleneck. Every single API request now requires a Redis round-trip.\n\nSolution 2 — Local rate limiting with sync:\n- Each server tracks counts locally (in-memory)\n- Periodically sync to Redis every 5 seconds\n- Problem: less accurate (up to 5s of drift), but eliminates Redis as a hotpath dependency\n\nSolution 3 — Sliding Window Counter (best accuracy/performance trade-off):\n- Maintain two counters: current_window and previous_window\n- Estimated count = previous_count × ((window_size - elapsed) / window_size) + current_count\n- Example: 60s window, 42s elapsed, previous_count=70, current_count=18\n- Estimated = 70 × (18/60) + 18 = 21 + 18 = 39\n- This is what Cloudflare uses. It's simple, memory-efficient, and accurate within ~0.003% error.\n\nThe production reality: most companies use Cloudflare or AWS WAF for the first layer (no code needed), Redis + Lua script for API-level rate limiting, and local in-memory limits as a last resort. Writing a rate limiter from scratch is a great interview exercise but a terrible production decision when managed solutions exist.",
      },
      {
        title: "Rate Limiting vs DDoS Protection — They're Different",
        content:
          "Rate limiting protects against ABUSE (one user making too many requests). DDoS protection handles ATTACKS (millions of distributed bots flooding your service).\n\nRate limiting alone CANNOT stop a DDoS attack because:\n1. Attackers use millions of unique IPs — per-IP limits don't help\n2. The volume can overwhelm your servers before rate limiting code even executes\n3. Layer 3/4 attacks (SYN floods, UDP amplification) happen below the application layer where rate limiting operates\n\nDDoS protection requires:\n▸ **CDN/Anycast absorption**: Cloudflare, AWS Shield absorb traffic across their global network\n▸ **IP reputation databases**: Block known bot IPs before they reach your servers\n▸ **Challenge mechanisms**: CAPTCHA, JavaScript challenges for suspicious traffic\n▸ **Rate limiting at the edge**: CDN-level rate limiting (before traffic reaches your servers)\n▸ **Auto-scaling**: Absorb legitimate traffic spikes while blocking malicious traffic\n\nThe interview insight: when discussing rate limiting, mention that it's application-layer protection. For network-layer attacks, you need infrastructure-level solutions (CDN, WAF, DDoS protection services). This shows you think about security at multiple layers.",
      },
    ],
    realWorldExamples: [
      { company: "GitHub API", description: "5,000 requests/hour for authenticated users, 60/hour for unauthenticated. Uses X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset headers." },
      { company: "Stripe", description: "100 read requests/sec and 100 write requests/sec per API key. Uses separate limits for reads vs writes to protect write-heavy operations." },
    ],
    tradeOffs: [
      { optionA: "Token Bucket", optionB: "Fixed Window", comparison: "Token Bucket: allows controlled bursts, memory efficient, slightly more complex. Fixed Window: simplest to implement, but allows 2x the rate at window boundaries." },
    ],
    interviewTips: [
      "Rate limiting is a must-mention for any public-facing API design",
      "Discuss WHERE to place it: API gateway (centralized) vs application layer (per-service)",
      "Mention distributed rate limiting with Redis (INCR + EXPIRE is the simple version, but race conditions exist)",
    ],
    practiceQuestions: [
      { question: "Design a rate limiter for a distributed microservice architecture.", answer: "Use a centralized Redis store with the Token Bucket algorithm. Each request: (1) compute the rate limit key (user_id + API endpoint), (2) use a Redis Lua script to atomically check and decrement tokens (avoids race conditions), (3) return 429 if no tokens available. Store separate buckets per user per endpoint. Set TTL on Redis keys to auto-cleanup. For high availability, use Redis Cluster. For edge case: if Redis is down, fail open (allow requests) rather than blocking all traffic." },
    ],
    tags: ["rate-limiting", "token-bucket", "api-gateway", "throttling", "ddos"],
  },
  {
    id: "sd-net-api-gateway",
    chapterId: 2,
    title: "API Gateway Pattern",
    order: 6,
    difficulty: "intermediate",
    estimatedMinutes: 10,
    overview:
      "An API gateway is a single entry point for all client requests in a microservices architecture. It handles cross-cutting concerns: authentication, rate limiting, request routing, load balancing, SSL termination, request/response transformation, and monitoring. Without a gateway, clients would need to know about every microservice endpoint. Popular options include Kong, AWS API Gateway, Nginx, and Envoy. The nuance nobody discusses: an API gateway is also a double-edged sword. It simplifies client-service communication but adds a network hop, becomes a potential bottleneck, and creates a single point of failure. The question isn't whether to use one — it's how to keep it from becoming the weakest link in your architecture.",
    keyPoints: [
      "Single entry point: clients talk to one URL, gateway routes to correct microservice",
      "Cross-cutting concerns: auth, rate limiting, logging, metrics — handled once, not per-service",
      "Request aggregation: gateway can combine multiple microservice calls into one client response",
      "Protocol translation: external REST → internal gRPC",
      "Circuit breaker: gateway can stop sending requests to failing services",
      "Can become a bottleneck — must be horizontally scalable and highly available",
      "HIDDEN GOTCHA: API gateways add latency to EVERY request. A poorly configured gateway can add 10-50ms per request. At 1000 QPS with P99 of 200ms, adding 50ms of gateway overhead means your user-facing P99 is now 250ms. Profile your gateway. Kong vs Envoy vs Nginx have VERY different performance characteristics — benchmark with your actual traffic patterns, not synthetic loads",
      "MOST DEVS DON'T KNOW: There are TWO types of traffic in microservices. 'North-South' traffic is external client → your services (handled by API gateway). 'East-West' traffic is service → service internally (handled by service mesh). Most interview candidates mention API gateway but completely miss the service mesh for east-west traffic. Istio/Linkerd with Envoy sidecars is the modern answer for east-west concerns (mTLS, retries, circuit breaking between services)",
      "CRITICAL: The 'smart gateway, dumb services' vs 'dumb gateway, smart services' debate. If your gateway does request transformation, business logic, and complex routing, it becomes a monolith disguised as a gateway (the 'gateway monolith' anti-pattern). The gateway should only handle cross-cutting infra concerns. Business logic belongs in services",
      "Gateway authentication pattern: Validate JWT at the gateway, extract user claims, forward as headers (X-User-Id, X-User-Role) to downstream services. Services trust these headers (they came from the gateway, not the client). This eliminates auth logic from every microservice — a massive simplification",
    ],
    deepDive: [
      {
        title: "Gateway Responsibilities",
        content:
          "In a microservices world, the gateway is the traffic cop. Request comes in → authenticate (JWT validation) → rate limit check → route to correct service → aggregate responses if needed → add CORS headers → return to client. Without a gateway, EVERY microservice would need to implement auth, rate limiting, CORS, and logging independently. That's duplicated work and inconsistent behavior.",
        diagram: `API Gateway Architecture:

  Mobile App ─┐
  Web App ────┼──► [API Gateway] ──┬──► User Service
  3rd Party ──┘     │ Auth         ├──► Order Service
                    │ Rate Limit   ├──► Product Service
                    │ Logging      ├──► Payment Service
                    │ SSL Term     └──► Notification Service`,
      },
      {
        title: "Circuit Breaker Pattern — The Gateway's Kill Switch",
        content:
          "When a downstream service starts failing, without a circuit breaker, the gateway keeps sending requests to it. These requests pile up, consuming gateway threads/connections. Eventually, the gateway itself becomes unresponsive because all its resources are waiting on the failing service. One bad microservice takes down your ENTIRE system. This is called 'cascading failure.'\n\nThe circuit breaker pattern (popularized by Netflix's Hystrix, now Resilience4j):\n\n▸ **CLOSED state** (normal): Requests flow through. Track failure rate.\n▸ **OPEN state** (tripped): Failure rate exceeds threshold (e.g., 50% of last 20 calls failed). ALL requests immediately get a fallback response (cached data, default value, or error). No requests reach the failing service.\n▸ **HALF-OPEN state** (testing): After a cooldown period (e.g., 30 seconds), allow ONE request through. If it succeeds, go to CLOSED. If it fails, go back to OPEN.\n\nThe key settings that matter:\n- Failure threshold: 50% is common (too low = false trips, too high = too slow to react)\n- Sliding window: last 20 requests or last 10 seconds\n- Cooldown: 30-60 seconds (too short = hammering failing service, too long = slow recovery)\n- Timeout: How long to wait before considering a request 'failed' (critical — set this LOWER than you think)\n\nThe nuance: each downstream service needs its OWN circuit breaker. If service A fails, you want to circuit-break calls to A while still allowing calls to services B, C, D. A single global circuit breaker would take down everything when one service hiccups.",
        diagram: `Circuit Breaker States:

  CLOSED ──── failure rate > 50% ────► OPEN
    ▲                                    │
    │                              wait 30 seconds
    │                                    │
    └── success ── HALF-OPEN ◄───────────┘
                       │
                    failure
                       │
                       └────────────────► OPEN`,
      },
      {
        title: "API Gateway vs Service Mesh — When to Use Which",
        content:
          "This confusion trips up even experienced engineers. Here's the clean mental model:\n\n**API Gateway (North-South traffic)**:\n- External clients → your services\n- Authentication, rate limiting, request routing\n- One centralized component\n- Examples: Kong, AWS API Gateway, Nginx\n\n**Service Mesh (East-West traffic)**:\n- Service → service communication\n- mTLS (mutual TLS), retries, circuit breaking, observability\n- Sidecar proxy per service instance (not centralized)\n- Examples: Istio + Envoy, Linkerd, Consul Connect\n\nThe 'aha' moment: In a service mesh, each microservice gets a proxy sidecar (usually Envoy). Service A doesn't call Service B directly — it calls its local Envoy proxy, which handles TLS, retries, load balancing, and tracing, then forwards to Service B's Envoy proxy. Services are completely unaware of the mesh.\n\nWhen you need BOTH: Most production microservice architectures use an API gateway for external traffic AND a service mesh for internal traffic. They complement each other — the gateway handles what clients see, the mesh handles what services see.\n\nWhen a service mesh is OVERKILL: If you have fewer than 10 microservices, the operational overhead of Istio (it's complex!) outweighs the benefits. Use simple HTTP calls with retry libraries (Polly for .NET, Resilience4j for Java) until you genuinely need a mesh.\n\nThis is the kind of nuanced answer that distinguishes senior from mid-level in interviews. Don't just say 'use an API gateway' — discuss whether east-west traffic patterns also need attention.",
      },
    ],
    realWorldExamples: [
      { company: "Netflix (Zuul)", description: "Zuul handles 50+ billion requests/day. It provides dynamic routing, monitoring, security, and resiliency. Every request to Netflix goes through Zuul first." },
      { company: "Amazon", description: "AWS API Gateway handles auth, throttling, caching, and request transformation for all of AWS's public APIs and is available as a managed service for customers." },
    ],
    tradeOffs: [
      { optionA: "API Gateway (centralized)", optionB: "Service Mesh (sidecar)", comparison: "Gateway: single entry point, simpler, can become bottleneck. Service Mesh (Istio/Envoy): per-service proxy sidecar, handles service-to-service communication, more complex but better for east-west traffic." },
    ],
    interviewTips: [
      "Always include an API gateway when drawing microservice architectures",
      "Mention it handles auth, rate limiting, and routing — saves you from discussing these in every service",
      "Discuss the risk: gateway as single point of failure — must be highly available",
    ],
    practiceQuestions: [
      { question: "What's the difference between an API gateway and a load balancer?", answer: "A load balancer distributes requests across instances of the SAME service (Layer 4/7 traffic distribution). An API gateway routes requests to DIFFERENT services based on the URL path, performs authentication, rate limiting, protocol translation, and response aggregation. They serve different purposes: load balancers handle horizontal scaling, API gateways handle cross-cutting concerns and routing. In practice, you use BOTH: the API gateway routes to services, each service has its own load balancer for its instances." },
    ],
    tags: ["api-gateway", "microservices", "routing", "authentication", "cross-cutting"],
  },
];
