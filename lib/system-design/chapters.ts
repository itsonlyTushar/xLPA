import { SDChapter } from "./types";

export const sdChapters: SDChapter[] = [
  {
    id: 1,
    number: 1,
    title: "Fundamentals",
    slug: "fundamentals",
    description:
      "Scalability, latency vs throughput, CAP theorem, consistency models — the vocabulary every system design interview starts with.",
    icon: "⚡",
    topicCount: 6,
  },
  {
    id: 2,
    number: 2,
    title: "Networking & APIs",
    slug: "networking-apis",
    description:
      "DNS, CDNs, REST vs GraphQL vs gRPC, WebSockets, API gateways, and rate limiting — the transport layer of every system.",
    icon: "🌐",
    topicCount: 6,
  },
  {
    id: 3,
    number: 3,
    title: "Databases",
    slug: "databases",
    description:
      "SQL vs NoSQL, indexing, sharding, replication, partitioning — choosing and scaling the right data store.",
    icon: "🗄️",
    topicCount: 6,
  },
  {
    id: 4,
    number: 4,
    title: "Caching",
    slug: "caching",
    description:
      "Cache strategies, eviction policies, Redis, CDN caching, cache invalidation — the fastest path to low latency.",
    icon: "⚙️",
    topicCount: 5,
  },
  {
    id: 5,
    number: 5,
    title: "Message Queues & Streaming",
    slug: "message-queues",
    description:
      "Pub/Sub, Kafka, event-driven architecture, CQRS — decoupling services for reliability and scale.",
    icon: "📨",
    topicCount: 5,
  },
  {
    id: 6,
    number: 6,
    title: "Load Balancing & Scaling",
    slug: "load-balancing",
    description:
      "Load balancer algorithms, reverse proxies, auto-scaling, microservices vs monoliths — distributing work efficiently.",
    icon: "⚖️",
    topicCount: 5,
  },
  {
    id: 7,
    number: 7,
    title: "Storage & Data Processing",
    slug: "storage",
    description:
      "Blob/object storage, distributed file systems, data pipelines, batch vs stream processing.",
    icon: "💾",
    topicCount: 4,
  },
  {
    id: 8,
    number: 8,
    title: "Case Studies",
    slug: "case-studies",
    description:
      "End-to-end system designs: URL shortener, Twitter feed, chat system, notification service — the real interview scenarios.",
    icon: "📐",
    topicCount: 6,
  },
];
