// components/planet-scale/PlanetSchema.js

export const REGIONS = {
  "us-east": {
    id: "us-east",
    name: "US-East (N. Virginia)",
    x: 28, // percentages for coordinates on map
    y: 38,
    baseUsers: 45000,
    baseCost: 1200,
    color: "#e28743"
  },
  "us-west": {
    id: "us-west",
    name: "US-West (Oregon)",
    x: 12,
    y: 34,
    baseUsers: 30000,
    baseCost: 1100,
    color: "#eab308"
  },
  "europe": {
    id: "europe",
    name: "Europe (Frankfurt)",
    x: 50,
    y: 28,
    baseUsers: 50000,
    baseCost: 1300,
    color: "#f97316"
  },
  "india": {
    id: "india",
    name: "Asia Pacific (Mumbai)",
    x: 69,
    y: 48,
    baseUsers: 60000,
    baseCost: 950,
    color: "#854d0e"
  },
  "singapore": {
    id: "singapore",
    name: "Asia Pacific (Singapore)",
    x: 76,
    y: 60,
    baseUsers: 25000,
    baseCost: 1050,
    color: "#d97706"
  },
  "japan": {
    id: "japan",
    name: "Asia Pacific (Tokyo)",
    x: 86,
    y: 32,
    baseUsers: 35000,
    baseCost: 1250,
    color: "#ca8a04"
  },
  "australia": {
    id: "australia",
    name: "Asia Pacific (Sydney)",
    x: 88,
    y: 78,
    baseUsers: 15000,
    baseCost: 1150,
    color: "#b45309"
  }
};

// Speed-of-light latency matrix in milliseconds
export const LATENCY_MATRIX = {
  "us-east": { "us-east": 5, "us-west": 70, "europe": 90, "india": 180, "singapore": 210, "japan": 160, "australia": 220 },
  "us-west": { "us-east": 70, "us-west": 5, "europe": 150, "india": 220, "singapore": 180, "japan": 110, "australia": 160 },
  "europe": { "us-east": 90, "us-west": 150, "europe": 5, "india": 120, "singapore": 170, "japan": 220, "australia": 260 },
  "india": { "us-east": 180, "us-west": 220, "europe": 120, "india": 5, "singapore": 40, "japan": 130, "australia": 180 },
  "singapore": { "us-east": 210, "us-west": 180, "europe": 170, "india": 40, "singapore": 5, "japan": 75, "australia": 95 },
  "japan": { "us-east": 160, "us-west": 110, "europe": 220, "india": 130, "singapore": 75, "japan": 5, "australia": 140 },
  "australia": { "us-east": 220, "us-west": 160, "europe": 260, "india": 180, "singapore": 95, "japan": 140, "australia": 5 }
};

// Growth scales of Software Universe
export const SCALES = [
  { id: "10k", label: "10k req/sec", multiplier: 1, labelFull: "10,000 requests/sec" },
  { id: "100k", label: "100k req/sec", multiplier: 10, labelFull: "100,000 requests/sec" },
  { id: "1m", label: "1M req/sec", multiplier: 100, labelFull: "1,000,000 requests/sec" },
  { id: "10m", label: "10M req/sec", multiplier: 1000, labelFull: "10,000,000 requests/sec" },
  { id: "100m", label: "100M req/sec", multiplier: 10000, labelFull: "100,000,000 requests/sec" }
];

// Active disaster scenarios
export const SCENARIOS = {
  "normal": {
    id: "normal",
    name: "Normal Day Operations",
    description: "System running under typical distributed workload across all regions.",
    trafficMultiplier: 1.0,
    affectedRegions: [],
    failures: []
  },
  "black_friday": {
    id: "black_friday",
    name: "Black Friday Shopping Spree",
    description: "Massive global traffic surge, testing replication queues and database locks.",
    trafficMultiplier: 5.5,
    affectedRegions: ["us-east", "us-west", "europe"],
    failures: []
  },
  "payment_outage": {
    id: "payment_outage",
    name: "Global Payment Pipeline Outage",
    description: "Regional payment gateways fail to process transactions, backing up orders in queues.",
    trafficMultiplier: 1.2,
    affectedRegions: ["india", "singapore"],
    failures: ["payment_gateway"]
  },
  "regional_failure": {
    id: "regional_failure",
    name: "US-East Datacenter Fire",
    description: "Total power loss in Virginia region. Traffic must failover to US-West and Europe.",
    trafficMultiplier: 1.0,
    affectedRegions: ["us-east"],
    failures: ["region_down"]
  },
  "ddos": {
    id: "ddos",
    name: "Botnet DDoS Attack on Europe",
    description: "Huge ingress of malicious requests target Frankfurt load balancers, causing regional congestion.",
    trafficMultiplier: 4.0,
    affectedRegions: ["europe"],
    failures: ["network_congestion"]
  },
  "cable_cut": {
    id: "cable_cut",
    name: "Transatlantic Undersea Fiber Cut",
    description: "Anchor drags across undersea cable, spiking US-Europe latency to 450ms via satellite link.",
    trafficMultiplier: 1.0,
    affectedRegions: ["us-east", "europe"],
    failures: ["undersea_fiber_cut"]
  },
  "database_failure": {
    id: "database_failure",
    name: "US-West Database Replication Lockup",
    description: "Primary-replica sync freezes due to write-lock deadlock, causing stale reads on local replicas.",
    trafficMultiplier: 1.0,
    affectedRegions: ["us-west"],
    failures: ["database_replication_lock"]
  },
  "cache_failure": {
    id: "cache_failure",
    name: "Global Redis Cache Collapse",
    description: "Eviction storm crash wipes edge caches, causing all traffic to slam origin databases directly.",
    trafficMultiplier: 1.0,
    affectedRegions: ["us-east", "us-west", "europe", "india", "singapore", "japan", "australia"],
    failures: ["redis_cache_collapse"]
  },
  "worker_failure": {
    id: "worker_failure",
    name: "Kafka Consumer Queue Congestion",
    description: "Background workers fail to process log files, resulting in consumer lag and eventual state divergence.",
    trafficMultiplier: 1.0,
    affectedRegions: ["japan", "australia"],
    failures: ["kafka_consumer_lag"]
  }
};
