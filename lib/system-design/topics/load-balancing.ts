import { SDTopic } from "../types";

export const loadBalancingTopics: SDTopic[] = [
  {
    id: "sd-lb-algorithms",
    chapterId: 6,
    title: "Load Balancer Algorithms",
    order: 1,
    difficulty: "beginner",
    estimatedMinutes: 12,
    overview:
      "A load balancer distributes incoming requests across multiple servers to ensure no single server is overwhelmed. Key algorithms: Round Robin (equal distribution in order), Weighted Round Robin (more traffic to stronger servers), Least Connections (route to the server with fewest active connections), IP Hash (same client always goes to same server), and Random. The choice depends on whether your servers are homogeneous, whether you need session affinity, and whether requests have variable processing times. The insight most engineers miss: load balancers aren't just about distributing load. They're about ISOLATING failures. A good load balancer with health checks means one crashed server doesn't bring down your whole system — traffic is seamlessly rerouted to healthy servers. The LB is your first line of defense against cascading failures.",
    keyPoints: [
      "Round Robin: simple, equal distribution. Works when all servers are identical and requests are similar.",
      "Weighted Round Robin: server with weight 3 gets 3x more requests than weight 1. For heterogeneous servers.",
      "Least Connections: routes to the server with fewest active connections. Best for variable request durations.",
      "IP Hash: hash(client_IP) → server. Same client always hits same server (session affinity).",
      "Layer 4 (TCP): load balances based on IP/port — fast, no request inspection.",
      "Layer 7 (HTTP): load balances based on URL, headers, cookies — smarter routing, more overhead.",
      "HIDDEN GOTCHA — The 'Least Connections' Lie: Least Connections sounds perfect, but it has a critical flaw: a server that's about to crash (slow, thrashing memory) has FEWER active connections because it's completing requests slowly and timing them out. The LB sees 'fewest connections' and sends MORE traffic to the dying server. This is called the 'thundering herd to a sick server' problem. Solution: combine Least Connections with latency-based routing (sometimes called 'Least Outstanding Requests' or 'Peak EWMA'). Route to the server with the best response time, not just the fewest connections. Envoy and HAProxy support this. Nginx Plus has 'least_time' directive",
      "MOST DEVS DON'T KNOW — Connection Draining Saves You During Deploys: When you remove a server from the LB pool (for deploy, maintenance, or scale-in), what happens to the requests currently being processed? Without connection draining, those requests are KILLED — users see 502 errors. With connection draining (also called 'graceful deregistration'), the LB stops sending NEW requests to that server but allows IN-FLIGHT requests to complete (typically 30-60 second timeout). This is critical for zero-downtime deployments. AWS ALB deregistration delay defaults to 300 seconds — check yours",
      "CRITICAL — Sticky Sessions Are a Code Smell: IP Hash / cookie-based sticky sessions route the same user to the same server. This seems convenient (you can store session data in server memory), but it creates problems: (1) Uneven load — some users make way more requests, (2) A server crash loses all in-memory sessions for those users, (3) Auto-scaling becomes harder — new servers get no existing sessions. The right fix: externalize session state to Redis/DynamoDB. Then any server can handle any request. Sticky sessions are acceptable as a short-term fix but never as architecture",
      "The 'Power of Two Random Choices' algorithm: Instead of checking ALL servers for least connections (expensive), pick 2 random servers and send to the one with fewer connections. This is provably better than random (reduces maximum load from O(log n / log log n) to O(log log n)) and used by Envoy, HAProxy, and gRPC. It's the Goldilocks of LB algorithms — smarter than random, cheaper than least-connections",
    ],
    deepDive: [
      {
        title: "Layer 4 vs Layer 7 Load Balancing",
        content:
          "Layer 4 operates at the TCP level: it sees IP addresses and port numbers, makes a routing decision, and forwards the TCP connection. Very fast (hardware-accelerated), no request parsing. Layer 7 operates at the HTTP level: it can inspect URLs, headers, cookies, and route based on content (e.g., /api/* → API servers, /static/* → CDN, /ws/* → WebSocket servers). More flexible but more CPU-intensive.",
        diagram: `Layer 4 vs Layer 7:

  Layer 4 (TCP):
  Client ──TCP──► LB ──TCP──► Server
  (routes by IP:port, no HTTP parsing)
  
  Layer 7 (HTTP):
  Client ──HTTP──► LB parses request
                    ├── /api/*    → API Servers
                    ├── /static/* → CDN
                    └── /ws/*     → WebSocket Servers`,
      },
      {
        title: "Health Checks — The Difference Between Good and Great",
        content:
          "Load balancers must detect unhealthy servers and stop routing to them. Active health checks: LB sends periodic pings (HTTP GET /health every 10s). If a server fails 3 consecutive checks, it's removed from the pool. Passive health checks: LB monitors actual requests. If a server returns 5xx errors or times out repeatedly, mark it unhealthy. Both should be used together for robust detection.\n\nWhat most engineers get wrong about health checks:\n\n**1. Shallow vs Deep Health Checks**: GET /health that returns 200 after checking nothing is useless. A deep health check verifies: database connection works, Redis connection works, disk space is available, critical dependencies are reachable. BUT — a deep check that depends on the database means: database down → ALL servers marked unhealthy → 100% outage from a partial failure. Solution: two health check endpoints: /health/live (is the process running?) for the LB, and /health/ready (can I serve requests?) for deployment readiness.\n\n**2. Health Check Timing Traps**: Interval=10s, threshold=3 failures means it takes 30 seconds to detect a dead server. That's 30 seconds of users hitting 502 errors. For latency-sensitive systems, use interval=2s with threshold=2 (4 second detection). But aggressive checks = more overhead.\n\n**3. Thundering Recovery**: When a previously unhealthy server passes health checks and is added back to the pool, the LB might send a burst of traffic (because it has 0 connections). Solution: use 'slow start' — gradually increase traffic to a recovering server over 30-60 seconds.",
      },
      {
        title: "Global Server Load Balancing (GSLB) — The Layer Most Tutorials Skip",
        content:
          "Everything above is single-region load balancing. GSLB distributes traffic across REGIONS. A user in Tokyo should hit your Tokyo datacenter, not your Virginia one.\n\nHow GSLB works:\n1. DNS-based: Return different DNS records based on client location. Client resolves api.example.com → nearest datacenter IP. (Cloudflare, Route53 latency-based routing)\n2. Anycast: Same IP address announced from multiple datacenters. Network routing sends the user to the nearest one. (Cloudflare's entire network uses this)\n3. GeoDNS + Health: If the nearest datacenter is down, DNS returns the next-nearest healthy location.\n\nThe multi-region architecture stack:\n▸ Layer 1: GSLB (Route53 / Cloudflare) → routes user to nearest region\n▸ Layer 2: Regional LB (ALB / NLB) → distributes within the region\n▸ Layer 3: Service-level LB (Kubernetes / Envoy) → distributes within the service\n\nEach layer handles failures at its scope: service-level LB handles pod crashes, regional LB handles server failures, GSLB handles regional outages.",
        diagram: `Global Load Balancing Architecture:

  User (Tokyo) ──DNS──► Route53 (latency routing)
                          │
                  ┌───────┴───────┐
                  ▼               ▼
           Tokyo Region    Virginia Region
           ┌─── ALB ───┐  ┌─── ALB ───┐
           │ ┌───┐┌───┐│  │ ┌───┐┌───┐│
           │ │ S1││ S2││  │ │ S1││ S2││
           │ └───┘└───┘│  │ └───┘└───┘│
           └───────────┘  └───────────┘`,
      },
    ],
    realWorldExamples: [
      { company: "Nginx", description: "The most popular software load balancer. Supports round-robin, least connections, IP hash, and custom Lua-based routing. Handles 10M+ concurrent connections on a single server." },
      { company: "AWS ALB", description: "Application Load Balancer (Layer 7): path-based routing, host-based routing, WAF integration, WebSocket support. Network Load Balancer (Layer 4): handles millions of requests/sec with ultra-low latency." },
    ],
    tradeOffs: [
      { optionA: "Round Robin", optionB: "Least Connections", comparison: "Round Robin: simple, equal distribution, doesn't account for request complexity. Least Connections: adapts to variable workloads, slightly more overhead to track connection counts." },
    ],
    interviewTips: [
      "Place a load balancer in front of every service tier in your architecture diagrams",
      "Mention health checks — shows you think about failure scenarios",
      "Use Layer 7 when you need content-based routing (most modern apps); Layer 4 for raw TCP performance",
    ],
    practiceQuestions: [
      { question: "Your servers have different specs (some 8-core, some 32-core). Which LB algorithm?", answer: "Weighted Round Robin or Weighted Least Connections. Assign weights proportional to server capacity: 32-core server gets weight 4, 8-core gets weight 1. The load balancer sends 4x more traffic to the powerful servers. If request durations vary significantly, use Weighted Least Connections to also account for active request counts. Monitor CPU utilization across servers to fine-tune weights over time." },
    ],
    tags: ["load-balancer", "round-robin", "least-connections", "layer-4", "layer-7"],
  },
  {
    id: "sd-lb-reverse-proxy",
    chapterId: 6,
    title: "Reverse Proxy & Forward Proxy",
    order: 2,
    difficulty: "beginner",
    estimatedMinutes: 8,
    overview:
      "A forward proxy sits in front of clients (hides client identity from servers). A reverse proxy sits in front of servers (hides server identity from clients). In system design, reverse proxies are everywhere — Nginx, HAProxy, Envoy. They provide: load balancing, SSL termination, caching, compression, request buffering, and security (DDoS protection, IP whitelisting). The key insight: a reverse proxy is really an 'infrastructure offload layer.' Every concern that's NOT business logic (SSL, compression, rate limiting, auth, caching, logging) can be handled at the proxy layer, keeping your application code clean. This is the same philosophy behind API gateways and service meshes — they're all variations of the reverse proxy pattern.",
    keyPoints: [
      "Forward proxy: client → proxy → server. Client uses proxy to access the internet (VPN, corporate proxy).",
      "Reverse proxy: client → proxy → server. Server hides behind proxy (Nginx in front of your app).",
      "SSL termination: reverse proxy handles HTTPS, backend servers use plain HTTP (simpler, faster).",
      "Compression: reverse proxy gzip/brotli compresses responses before sending to client.",
      "Request buffering: absorbs slow client uploads before forwarding to fast backend servers.",
      "Security: hides backend server IPs, applies rate limiting, blocks malicious requests.",
      "HIDDEN GOTCHA — Request Buffering is More Important Than You Think: When a mobile user on 3G uploads a 5MB image, they send data slowly (100KB/s = 50 seconds). Without request buffering, your application server's thread is BLOCKED for 50 seconds serving this one slow client. With request buffering, Nginx absorbs the slow upload into its buffer, then forwards the complete request to your app server instantly. This is why Nginx can handle 10,000+ concurrent connections while your app server handles 100: Nginx manages the slow clients, your app server only handles fast, local requests. This is the 'spoon-feeding' problem that reverse proxies solve",
      "MOST DEVS DON'T KNOW — The X-Forwarded-For Header Chain: When your app sits behind a reverse proxy, every request appears to come from the proxy's IP (e.g., 10.0.0.1). The REAL client IP is in the X-Forwarded-For header: 'X-Forwarded-For: 203.0.113.50, 70.41.3.18, 150.172.238.178.' Each proxy in the chain appends its IP. The client IP is the FIRST one — but it can be SPOOFED by the client! Only trust IPs added by YOUR proxies (the rightmost entries you control). This is THE most common security mistake in rate limiting and geo-blocking — you rate-limit based on the spoofable client-supplied IP instead of the verified proxy-added IP",
      "CRITICAL — Nginx vs HAProxy vs Envoy: Nginx: battle-tested web server + reverse proxy. Config file-based, amazing for static files + reverse proxy. HAProxy: purpose-built load balancer. Better health checking, connection draining, and LB algorithms than Nginx. More operational features. Envoy: cloud-native L7 proxy (created by Lyft). Dynamic configuration via API (xDS protocol) — no config file reloads. Foundation of Istio service mesh. Best for Kubernetes environments. The choice: legacy/simple → Nginx, heavy load balancing → HAProxy, Kubernetes/service mesh → Envoy",
    ],
    deepDive: [
      {
        title: "Reverse Proxy Architecture",
        content:
          "In a typical production setup: Internet → Cloudflare (CDN + DDoS protection) → Nginx (reverse proxy + SSL termination + load balancing) → Application Servers → Database. The reverse proxy is the Swiss Army knife of infrastructure: it handles everything the application shouldn't worry about. This separation of concerns keeps your application code focused on business logic.",
        diagram: `Production Architecture:

  Internet
     │
  [Cloudflare CDN + DDoS]
     │
  [Nginx Reverse Proxy]
  │ SSL termination
  │ Rate limiting
  │ Compression
  │ Load balancing
     │
  ┌──┼──┐
  ▼  ▼  ▼
  App Servers (HTTP, no SSL)`,
      },
      {
        title: "SSL/TLS Termination — The Full Story",
        content:
          "SSL termination at the reverse proxy is standard practice, but there are nuances most engineers miss:\n\n**Why Terminate at the Proxy?**\n▸ CPU savings: TLS handshake is CPU-intensive (RSA, ECDHE key exchange). One proxy can handle SSL for 20+ backend servers.\n▸ Certificate management: One place to install, renew, and rotate certificates (Let's Encrypt + certbot on the proxy).\n▸ HTTP/2 and HTTP/3: The proxy can negotiate modern protocols with clients while speaking HTTP/1.1 to backends.\n\n**The Security Concern — 'But the Internal Traffic is Unencrypted!'**\nBetween proxy and backend servers, traffic is plain HTTP. Is this safe? In a VPC (private network), yes — the traffic never leaves your controlled network. For compliance-heavy environments (PCI DSS, HIPAA): use 'SSL re-encryption' — proxy terminates client SSL, then establishes a NEW TLS connection to the backend (mTLS). This is what AWS ALB supports with 'end-to-end encryption.'\n\n**mTLS (Mutual TLS)**: Both client and server verify each other's certificates. Used for service-to-service communication in zero-trust networks. Service meshes (Istio) automate mTLS between all services — no code changes needed.",
      },
    ],
    realWorldExamples: [
      { company: "Cloudflare", description: "Acts as a reverse proxy for 20%+ of all websites. Every request goes through Cloudflare's network, which provides CDN caching, DDoS protection, and WAF — all transparently to the backend servers." },
    ],
    tradeOffs: [
      { optionA: "Reverse proxy (Nginx)", optionB: "Direct client → server", comparison: "Reverse proxy: additional hop but provides SSL termination, caching, load balancing, security. Direct: lower latency (no proxy hop), but each server must handle SSL, compression, rate limiting independently." },
    ],
    interviewTips: [
      "Always include a reverse proxy / load balancer in your architecture — it's expected",
      "Nginx is the safe default answer for reverse proxy",
      "Mention SSL termination at the proxy level — it's a common production pattern",
    ],
    practiceQuestions: [
      { question: "Why terminate SSL at the reverse proxy instead of the application server?", answer: "1) SSL/TLS handshakes are CPU-intensive — offloading to the proxy frees app server CPU for business logic. 2) Certificate management in one place instead of every app server. 3) Backend servers communicate over plain HTTP within the private network (faster, simpler). 4) The proxy can use hardware acceleration for SSL. 5) Easier to rotate certificates. The private network between proxy and app is trusted (VPC), so plain HTTP is acceptable and standard practice." },
    ],
    tags: ["reverse-proxy", "forward-proxy", "nginx", "ssl-termination", "infrastructure"],
  },
  {
    id: "sd-lb-auto-scaling",
    chapterId: 6,
    title: "Auto-Scaling Strategies",
    order: 3,
    difficulty: "intermediate",
    estimatedMinutes: 10,
    overview:
      "Auto-scaling automatically adjusts the number of server instances based on demand. Scale out (add instances) when traffic increases; scale in (remove instances) when traffic decreases. This ensures you handle peak traffic without over-provisioning during quiet periods. Key components: scaling metrics (CPU, memory, request count, custom metrics), scaling policies (target tracking, step, scheduled), and cooldown periods. The uncomfortable truth about auto-scaling: it's NOT instant. A new EC2 instance takes 2-5 minutes to launch, install dependencies, warm up caches, and pass health checks. A Kubernetes pod takes 30-60 seconds. A Lambda function takes 100ms-10s (cold start). For sudden traffic spikes (viral moment, DDoS, flash sale), auto-scaling ALONE is too slow. You need a combination of: pre-scaling (scheduled), over-provisioning (headroom), queue buffering, and reactive auto-scaling as backup.",
    keyPoints: [
      "Reactive scaling: respond to current metrics (CPU > 70% → add instances)",
      "Predictive scaling: ML-based prediction of future traffic based on historical patterns",
      "Scheduled scaling: pre-scale for known events (Black Friday, product launches)",
      "Target tracking: maintain a metric at a target value (e.g., keep avg CPU at 50%)",
      "Step scaling: different actions at different thresholds (60% → +1, 80% → +3, 95% → +5)",
      "Cooldown period: wait N minutes after scaling before evaluating again (prevents thrashing)",
      "HIDDEN GOTCHA — The Cold Start Cascade: You have 10 servers at 70% CPU. Traffic increases. Auto-scaler adds 5 new servers. But new servers have COLD caches (no data in memory). They're slower per request, so they process fewer requests. The existing 10 servers are still overloaded. The auto-scaler adds 5 MORE. Eventually caches warm up and you have 20 servers at 20% CPU — massively over-provisioned. Solutions: (1) Cache warming: pre-populate caches on new instances before adding to the LB pool, (2) Gradual traffic shift: slowly increase traffic to new instances (like connection draining in reverse), (3) Shared cache layer (Redis): new instances share the warm cache immediately",
      "MOST DEVS DON'T KNOW — Scaling DOWN is Harder Than Scaling UP: When traffic drops, the auto-scaler wants to remove instances. But which ones? If you remove a server processing requests, those requests fail. The server might hold in-memory state, WebSocket connections, or long-running jobs. The safe scale-in process: (1) Mark instance for termination, (2) Remove from LB (stop new requests), (3) Wait for in-flight requests to complete (connection draining, 30-300s), (4) If the instance runs background jobs, wait for current job to finish, (5) Terminate. AWS ASG supports lifecycle hooks for this. Kubernetes has preStop hooks + terminationGracePeriodSeconds. Most outages from auto-scaling are from aggressive SCALE-IN, not scale-out",
      "CRITICAL — The Metric You Scale On Determines Everything: CPU-based scaling sounds logical but fails for I/O-bound apps (a server waiting on database calls has 10% CPU but can't handle more load). Queue-depth scaling sounds great but oscillates (depth hits threshold → add workers → depth drops → remove workers → depth rises). The best practice COMBINATION: (1) Primary metric: request latency P99 (directly measures user experience), (2) Secondary metric: CPU/memory (prevents resource exhaustion), (3) Override: scheduled scaling for predictable events. Spotify scales on 'active listeners per pod' — a custom business metric that perfectly represents their load",
    ],
    deepDive: [
      {
        title: "Choosing Scaling Metrics — A Decision Framework",
        content:
          "CPU utilization is the simplest metric but can be misleading (I/O-bound apps have low CPU even under load). Better metrics: (1) Request rate per instance — directly measures load. (2) Request latency — scale when P99 exceeds SLO. (3) Queue depth — for worker services, scale when the backlog grows. (4) Custom business metrics — active WebSocket connections, concurrent video streams. The best approach: combine multiple metrics (e.g., scale out if CPU > 70% OR P99 latency > 200ms).\n\nMetric Selection by Service Type:\n▸ **Web API servers**: Scale on request count per instance OR P99 latency. NOT CPU (misleading for I/O-bound).\n▸ **Background workers**: Scale on queue depth. Target: keep queue depth < N (where N = acceptable processing delay).\n▸ **WebSocket servers**: Scale on connection count per instance. Each server has a connection limit (~50K per instance).\n▸ **ML inference servers**: Scale on GPU utilization (not CPU). Or scale on inference latency P99.\n▸ **Data pipeline workers**: Scale on input lag (how far behind is the consumer from the latest message?).",
      },
      {
        title: "Kubernetes HPA, VPA, and KEDA — The Modern Scaling Stack",
        content:
          "If you're on Kubernetes, you have three complementary auto-scalers:\n\n**HPA (Horizontal Pod Autoscaler)**: Adds or removes pods based on metrics. Default: CPU utilization. With custom metrics adapter: scale on Prometheus metrics, Datadog metrics, or any external metric.\n\n**VPA (Vertical Pod Autoscaler)**: Instead of adding more pods, makes existing pods BIGGER (more CPU/memory). Useful when your app doesn't scale horizontally well (stateful services, databases). VPA analyzes historical resource usage and adjusts requests/limits automatically. Warning: VPA restarts pods to apply new resource limits — combine with PodDisruptionBudget.\n\n**KEDA (Kubernetes Event-Driven Autoscaling)**: Scales based on EVENT SOURCES — Kafka consumer lag, SQS queue depth, Azure Service Bus messages, Prometheus queries, Cron schedules. KEDA can even scale to ZERO (no pods running when there's no work). This is huge for event-driven microservices and batch processing — why pay for idle pods?\n\nThe combination most production Kubernetes clusters use:\n▸ HPA for web services (scale on request rate)\n▸ KEDA for event-driven workers (scale on queue depth, scale to zero)\n▸ Cluster Autoscaler for nodes (add nodes when pods can't be scheduled)\n▸ VPA for recommendations (identify over/under-provisioned services)",
      },
    ],
    realWorldExamples: [
      { company: "Netflix", description: "Uses Titus (custom auto-scaler on AWS). Scales thousands of microservices independently. Combines reactive scaling with predictive scaling based on historical traffic patterns. Pre-scale for major content releases (new seasons)." },
      { company: "Spotify", description: "Uses Kubernetes HPA (Horizontal Pod Autoscaler) with custom metrics. Scales pod count based on active listener count per service, not just CPU — a much more meaningful metric for their workload." },
    ],
    tradeOffs: [
      { optionA: "Aggressive scaling (respond fast)", optionB: "Conservative scaling (prevent thrashing)", comparison: "Aggressive: fast reaction to spikes, may over-provision (higher cost), risk of thrashing (constant scale up/down). Conservative: stable instance count, may be slow to react to sudden spikes, lower cost. Use warmup time and cooldown periods to balance." },
    ],
    interviewTips: [
      "Mention auto-scaling for every stateless service in your architecture",
      "Discuss WHAT metric to scale on — it shows you understand the workload",
      "Mention pre-scaling / scheduled scaling for predictable events",
    ],
    practiceQuestions: [
      { question: "How would you handle a flash sale that starts at noon with 50x normal traffic?", answer: "Scheduled scaling: pre-scale to 50x capacity 30 minutes before the sale starts. Reactive scaling as backup: if traffic exceeds predictions, add more instances automatically. Caching: pre-warm caches with sale product data. Rate limiting: protect downstream services from being overwhelmed. Queue: buffer order requests in a message queue to smooth out DB writes. Post-sale: scheduled scale-in 2 hours after the sale ends. The key is NOT relying on reactive scaling alone — it's too slow for 50x spikes." },
    ],
    tags: ["auto-scaling", "horizontal-scaling", "metrics", "kubernetes", "elasticity"],
  },
  {
    id: "sd-lb-microservices",
    chapterId: 6,
    title: "Microservices vs Monolith",
    order: 4,
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "A monolith is a single deployable unit containing all the application's functions. Microservices split the application into small, independently deployable services, each owning its own data and communicating over the network. Most successful companies started as monoliths and migrated to microservices when team size and scale demanded it. Starting with microservices is almost always premature. Let's be brutally honest: microservices are a solution to an ORGANIZATIONAL problem, not a technical one. If you have 5 engineers, microservices will slow you down. If you have 500 engineers all pushing to the same codebase, a monolith will slow you down. The technology follows the org chart (Conway's Law). The most expensive mistake in modern engineering is adopting microservices too early because 'Netflix does it.'",
    keyPoints: [
      "Monolith: single codebase, single deployment, shared database. Simple, fast to develop, easy to debug.",
      "Microservices: independent services, independent deployments, separate databases per service.",
      "Microservices solve ORGANIZATIONAL problems (many teams touching the same codebase) more than technical ones.",
      "Network calls replace function calls: latency increases, failure modes multiply.",
      "Data consistency across services is much harder (no transactions across service boundaries).",
      "Start monolith → identify boundaries → extract services when the pain justifies the complexity.",
      "HIDDEN GOTCHA — The Distributed Monolith: The worst of both worlds. You split your monolith into 'microservices' but: (1) They all share one database (defeats independent deployment), (2) They must be deployed together (Service A's release requires Service B's update), (3) A change in one service breaks others (tight coupling through shared data models or synchronous API chains). You now have ALL the operational complexity of microservices (network failures, distributed tracing, multiple deploy pipelines) with NONE of the benefits (independent deployment, team autonomy, independent scaling). This happens when you split by technical layer (frontend-service, backend-service, database-service) instead of by domain (order-service, payment-service, user-service)",
      "MOST DEVS DON'T KNOW — The Hidden Costs Nobody Mentions In Conference Talks: Going from monolith to microservices requires: (1) Service discovery (Consul, Kubernetes DNS), (2) Distributed tracing (Jaeger, DataDog — $50K+/year), (3) Centralized logging (ELK stack, Grafana Loki), (4) API gateway, (5) CI/CD per service (N pipelines instead of 1), (6) Contract testing between services (Pact), (7) Saga pattern for distributed transactions, (8) On-call rotation per service team. A 50-person startup I know spent 6 months building microservices infrastructure before writing a single feature. They ended up going back to a monolith. Total cost: $500K and 6 months of lost product velocity",
      "CRITICAL — The Modular Monolith is The Answer Most Teams Need: Instead of microservices, structure your monolith with clear module boundaries: each module has its own directory, its own database schema (or database), communicates with other modules through well-defined interfaces (not direct DB queries). Deploy as one unit but maintain independence internally. When a module needs extraction: the boundaries are already clean, so extraction is straightforward. Shopify ($200B company) runs a modular monolith. Laravel (PHP) and Rails (Ruby) communities embrace this approach. It gives you 80% of microservices' organizational benefits at 20% of the operational cost",
      "Conway's Law is Real and Inescapable: 'Organizations produce designs which are copies of their communication structure.' If your org has 3 teams, you'll end up with 3 services — regardless of whether 3 is technically optimal. Inversely: if you want N microservices, you need N teams. Microservices without team autonomy (one team owns multiple services) is just a monolith with network calls. Structure your teams BEFORE splitting services",
    ],
    deepDive: [
      {
        title: "The Monolith-First Approach",
        content:
          "Martin Fowler's advice: 'Almost all the successful microservice stories have started with a monolith that got too big and was broken up.' Why? (1) You don't know the right service boundaries at the start. (2) Microservices add huge operational complexity (deployment pipelines, service discovery, distributed tracing, network failures). (3) A small team (< 20 engineers) moves faster with a monolith. Extract a service ONLY when you have a clear reason: independent scaling, different tech stack needed, or team autonomy.",
      },
      {
        title: "Service Boundaries",
        content:
          "Good microservice boundaries follow Domain-Driven Design: each service owns a bounded context (a coherent domain). Auth Service, Payment Service, Order Service, Notification Service. Bad boundaries: User-Read-Service and User-Write-Service (splitting by technical layer, not domain). A service should be ownable by one team (2-pizza rule) and deployable independently without coordinating with other teams.",
        diagram: `Good Service Boundaries:

  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │   Auth   │  │  Orders  │  │ Payments │
  │ Service  │  │ Service  │  │ Service  │
  │          │  │          │  │          │
  │ Users DB │  │Orders DB │  │Payments  │
  └──────────┘  └──────────┘  │   DB     │
                               └──────────┘
  Each service owns its data. No shared databases.`,
      },
      {
        title: "The Strangler Fig Pattern — How to Actually Migrate",
        content:
          "You have a monolith. You want microservices. You can't rewrite everything at once (the 'big bang rewrite' fails 90% of the time). The Strangler Fig pattern lets you migrate incrementally:\n\n1. **Intercept**: Place a proxy/API gateway in front of the monolith. All traffic flows through it.\n2. **Route**: Initially, the proxy routes 100% of requests to the monolith.\n3. **Extract**: Build a new microservice for ONE feature (e.g., user authentication).\n4. **Redirect**: Update the proxy to route auth requests to the new service, everything else to the monolith.\n5. **Repeat**: Extract the next feature. Each extraction is independent and reversible.\n6. **Retire**: When all features are extracted, decommission the monolith.\n\nKey rules:\n▸ Extract the most painful/frequently changing part first (highest ROI)\n▸ Keep the monolith running throughout — you can always route back if the new service has issues\n▸ The proxy is your safety net — you can do percentage-based routing (10% to new service, 90% to monolith) for gradual rollout\n▸ Expect the migration to take 1-3 YEARS for a medium-sized monolith. This is normal.\n\nAmazon's migration from monolith to microservices took ~3 years (2001-2004). They did it with zero downtime using this approach.",
        diagram: `Strangler Fig Migration:

  Phase 1:         Phase 2:         Phase 3:
  ┌─────┐          ┌─────┐          ┌─────┐
  │Proxy│          │Proxy│          │Proxy│
  └──┬──┘          └──┬──┘          └──┬──┘
     │              ┌──┴──┐         ┌──┴──┐
     ▼              ▼     ▼         ▼     ▼
  ┌──────┐      ┌──────┐ Auth   Orders  Auth
  │Mono- │      │Mono- │ Svc    Svc     Svc
  │lith  │      │lith  │          ▲
  │(ALL) │      │(most)│     ┌────┘
  └──────┘      └──────┘  ┌──────┐
                          │Mono- │
                          │lith  │
                          │(rest)│
                          └──────┘`,
      },
    ],
    realWorldExamples: [
      { company: "Amazon", description: "Started as a monolith in the early 2000s. Migrated to microservices as teams grew. Today runs thousands of independent services. The 'two-pizza team' rule came from this migration — each service owned by a team small enough to feed with two pizzas." },
      { company: "Shopify", description: "Famously stayed monolith (Ruby on Rails) until well past $1B revenue. They chose a modular monolith approach — clear module boundaries within a single deployable. Only recently started extracting critical services." },
    ],
    tradeOffs: [
      { optionA: "Monolith", optionB: "Microservices", comparison: "Monolith: simple deploy, easy debugging, shared DB transactions, slow CI/CD at scale, team contention. Microservices: independent scaling/deployment, team autonomy, distributed system complexity, network latency, eventual consistency." },
    ],
    interviewTips: [
      "Don't automatically say 'microservices' — explain when monolith is the right choice",
      "If you choose microservices, discuss: service discovery, observability, data consistency, and deployment",
      "The best answer often includes a monolith with a plan to extract services as needed",
    ],
    practiceQuestions: [
      { question: "You're at a startup with 5 engineers building a new product. Monolith or microservices?", answer: "Monolith — absolutely. With 5 engineers, microservices would slow you down dramatically: you'd spend more time on infrastructure (service discovery, deployment pipelines, distributed tracing) than building features. Use a well-structured monolith with clear module boundaries (auth, orders, payments as separate modules within the same app). When: (1) you have 20+ engineers stepping on each other, (2) a specific module needs different scaling, or (3) deployment conflicts block releases — THEN extract that module into a service." },
    ],
    tags: ["microservices", "monolith", "service-boundaries", "domain-driven-design", "architecture"],
  },
  {
    id: "sd-lb-service-discovery",
    chapterId: 6,
    title: "Service Discovery & Service Mesh",
    order: 5,
    difficulty: "advanced",
    estimatedMinutes: 10,
    overview:
      "In a microservices world, services need to find each other. Service discovery maintains a registry of available service instances and their locations. Client-side discovery: the client queries the registry and picks an instance (Netflix Eureka). Server-side discovery: requests go through a load balancer/proxy that queries the registry (Kubernetes Services, AWS ALB). A service mesh (Istio, Linkerd) goes further — adding a sidecar proxy to each service that handles discovery, load balancing, encryption, and observability transparently. The insight that simplifies everything: service discovery is just a dynamic DNS. In a traditional setup, you hardcode 'database-server.internal:5432' in your config. With microservices, you need 'order-service → 10.0.3.47:8080, 10.0.3.48:8080' and it changes every time pods restart. Service discovery automates this mapping. In Kubernetes, it's literally DNS: order-service.namespace.svc.cluster.local.",
    keyPoints: [
      "Service Registry: a database of service instances (name, IP, port, health) — Consul, Eureka, etcd",
      "Client-side discovery: client queries registry, selects instance, connects directly",
      "Server-side discovery: client sends to a proxy/LB that resolves the target — simpler for clients",
      "Kubernetes DNS: built-in service discovery. service-name.namespace.svc.cluster.local → pod IPs",
      "Service Mesh (Istio/Linkerd): sidecar proxy per pod handles discovery, mTLS, retries, circuit breaking",
      "Health checking: services register with heartbeats; registry removes unhealthy instances",
      "HIDDEN GOTCHA — DNS Caching Breaks Service Discovery: DNS clients cache resolved IPs. If a pod dies and a new one starts (new IP), clients still connect to the OLD IP for the cache TTL duration. In Java, the default DNS cache TTL is FOREVER (on OpenJDK with SecurityManager). In Kubernetes, CoreDNS returns records with TTL=30s by default, but the client might cache longer. This causes stale connections to dead pods. Solutions: (1) Set networkaddress.cache.ttl=5 in Java, (2) Use Kubernetes Services with ClusterIP (proxied, not DNS-dependent), (3) Use gRPC client-side load balancing that watches endpoints (not DNS), (4) Service mesh sidecars handle this automatically",
      "MOST DEVS DON'T KNOW — Service Mesh Adds 2-5ms Latency Per Hop: Every request goes through TWO Envoy proxies (source sidecar → destination sidecar). For a request that touches 5 services (A → B → C → D → E), that's 10 proxy hops = 20-50ms added latency. For most web applications, this is acceptable. For latency-critical paths (real-time bidding at < 10ms, game servers), a service mesh is too expensive. Also, each Envoy sidecar consumes 50-100MB RAM. With 1000 pods, that's 50-100GB of RAM just for sidecars. The trend: 'ambient mesh' (Istio Ambient) moves proxy functions to a per-node shared proxy instead of per-pod sidecar, reducing resource overhead",
      "CRITICAL — You Probably Don't Need a Service Mesh: Service meshes are designed for organizations running 50+ microservices with complex networking requirements (mTLS everywhere, traffic splitting, observability). If you have 5-10 services on Kubernetes, native Kubernetes Services + Ingress + NetworkPolicy gives you 90% of what you need. Add a service mesh ONLY when: (1) You need automatic mTLS (zero-trust networking requirement), (2) You need advanced traffic management (canary deployments with 5% traffic to new version), (3) You have regulatory requirements for encrypted service-to-service communication",
    ],
    deepDive: [
      {
        title: "Service Mesh Architecture",
        content:
          "A service mesh adds a sidecar proxy (Envoy) next to every service instance. All network traffic flows through the sidecar. This gives you: (1) automatic mTLS encryption between services, (2) service discovery and load balancing, (3) circuit breaking and retries, (4) observability (distributed tracing, metrics) — all WITHOUT changing application code. The control plane (Istio) configures all sidecars. The data plane (Envoy proxies) handles actual traffic.",
        diagram: `Service Mesh (Istio):

  ┌─ Pod A ─────────────┐    ┌─ Pod B ─────────────┐
  │ ┌────────┐ ┌──────┐ │    │ ┌──────┐ ┌────────┐ │
  │ │Service │→│Envoy │─┼────┼─│Envoy │→│Service │ │
  │ │   A    │ │Proxy │ │    │ │Proxy │ │   B    │ │
  │ └────────┘ └──────┘ │    │ └──────┘ └────────┘ │
  └─────────────────────┘    └─────────────────────┘
                    ▲              ▲
                    └──── Control Plane (Istio) ────┘`,
      },
      {
        title: "Observability in Microservices — The 3 Pillars You Need",
        content:
          "When you move from a monolith (one log file, one debugger) to microservices, debugging becomes exponentially harder. A user reports 'checkout is slow.' Which of your 30 services is the bottleneck? You need the three pillars of observability:\n\n**1. Distributed Tracing (Jaeger, Zipkin, DataDog APM)**: Every request gets a unique trace ID. As it flows through services (API → Order → Payment → Inventory → Notification), each service adds a 'span' with timing data. You can see: which service is slow, which span took the longest, where errors occurred. Propagate trace IDs via headers (W3C Trace Context or B3 format).\n\n**2. Centralized Logging (ELK, Loki, CloudWatch Logs)**: Every service logs to a central system. Logs are tagged with the trace ID. When debugging, search by trace ID to see logs from ALL services involved in that request. Without centralized logging, you're SSH-ing into 30 different servers. Critical: use STRUCTURED logging (JSON, not plain text). Log levels consistently (ERROR for actionable failures, WARN for expected issues, INFO for flow, DEBUG for development).\n\n**3. Metrics & Alerting (Prometheus + Grafana, DataDog)**: Track the RED metrics per service: Rate (requests/sec), Errors (error rate %), Duration (latency P50/P95/P99). Set alerts on SLOs: 'Alert if P99 latency > 500ms for 5 minutes.' Without metrics, you only know about problems when users complain.\n\nThe minimum viable observability stack:\n▸ Jaeger for tracing (free, open-source)\n▸ Grafana Loki for logs (free, pairs with Grafana)\n▸ Prometheus + Grafana for metrics (free, industry standard)\nOr just use DataDog (paid, but all-in-one — $15-25/host/month).",
      },
    ],
    realWorldExamples: [
      { company: "Kubernetes", description: "Built-in service discovery via DNS. Every Service object gets a DNS name. kube-proxy handles load balancing across pods. No external registry needed for most use cases." },
      { company: "Lyft", description: "Created Envoy proxy, now the foundation of most service meshes. Every Lyft microservice has an Envoy sidecar handling service discovery, retries, circuit breaking, and observability." },
    ],
    tradeOffs: [
      { optionA: "Service Mesh", optionB: "Manual service discovery", comparison: "Service Mesh: automatic mTLS, retries, observability, complex to set up, resource overhead (extra proxy per pod). Manual: simpler, less overhead, must implement retries/discovery/security in each service." },
    ],
    interviewTips: [
      "For Kubernetes-based systems, mention built-in service discovery via DNS",
      "Service mesh is appropriate only for large microservice deployments (50+ services)",
      "Mention Envoy/Istio by name to show you know the ecosystem",
    ],
    practiceQuestions: [
      { question: "How do microservices find each other in a Kubernetes cluster?", answer: "Kubernetes provides built-in service discovery via DNS. When you create a Service object, Kubernetes assigns it a stable DNS name (my-service.default.svc.cluster.local) and a ClusterIP. Other pods resolve this DNS name to reach the service. kube-proxy load-balances requests across the service's pods. For more advanced features (mTLS, traffic splitting, circuit breaking), deploy a service mesh like Istio — but for most systems, Kubernetes native DNS is sufficient." },
    ],
    tags: ["service-discovery", "service-mesh", "istio", "envoy", "kubernetes"],
  },
];
