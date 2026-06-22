export const TOPOLOGY_CONTENT = {
  order: {
    "10": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 60, y: 120 },
        { id: "backend", label: "Express Server", icon: "🖥️", x: 220, y: 120 },
        { id: "payment", label: "Stripe Gateway", icon: "💳", x: 380, y: 60 },
        { id: "database", label: "PostgreSQL DB", icon: "💽", x: 380, y: 180 },
        { id: "pos", label: "Kitchen POS", icon: "🖨️", x: 540, y: 120 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "payment" },
        { from: "payment", to: "backend" },
        { from: "backend", to: "database" },
        { from: "backend", to: "pos" }
      ]
    },
    "100k": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 50, y: 120 },
        { id: "gateway", label: "API Gateway", icon: "🛡️", x: 170, y: 120 },
        { id: "backend", label: "Express Cluster", icon: "🖥️", x: 290, y: 120 },
        { id: "payment", label: "Stripe API", icon: "💳", x: 410, y: 60 },
        { id: "database_primary", label: "PostgreSQL Prim", icon: "💽", x: 410, y: 150 },
        { id: "database_replica", label: "DB Read Replica", icon: "💽", x: 540, y: 150 },
        { id: "queue", label: "Redis Queue", icon: "📦", x: 410, y: 210 },
        { id: "pos", label: "Kitchen POS", icon: "🖨️", x: 540, y: 90 }
      ],
      edges: [
        { from: "app", to: "gateway" },
        { from: "gateway", to: "backend" },
        { from: "backend", to: "payment" },
        { from: "backend", to: "database_primary" },
        { from: "database_primary", to: "database_replica" },
        { from: "backend", to: "queue" },
        { from: "queue", to: "pos" },
        { from: "backend", to: "pos" }
      ]
    },
    "1M": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 40, y: 120 },
        { id: "cdn", label: "Cloudflare Edge", icon: "🌐", x: 140, y: 120 },
        { id: "gateway", label: "API Gateway", icon: "🛡️", x: 240, y: 120 },
        { id: "backend", label: "Express Services", icon: "🖥️", x: 350, y: 120 },
        { id: "payment", label: "Stripe Gateway", icon: "💳", x: 470, y: 50 },
        { id: "database_primary", label: "Postgres Write", icon: "💽", x: 470, y: 110 },
        { id: "database_replica_cluster", label: "Replica Cluster", icon: "💽", x: 560, y: 110 },
        { id: "queue", label: "Kafka Stream", icon: "📦", x: 470, y: 170 },
        { id: "worker_pool", label: "POS Workers", icon: "⚙️", x: 470, y: 220 },
        { id: "pos", label: "Kitchen POS", icon: "🖨️", x: 560, y: 190 }
      ],
      edges: [
        { from: "app", to: "cdn" },
        { from: "cdn", to: "gateway" },
        { from: "gateway", to: "backend" },
        { from: "backend", to: "payment" },
        { from: "backend", to: "database_primary" },
        { from: "database_primary", to: "database_replica_cluster" },
        { from: "backend", to: "queue" },
        { from: "queue", to: "worker_pool" },
        { from: "worker_pool", to: "pos" }
      ]
    }
  },

  payment: {
    "10": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 80, y: 120 },
        { id: "backend", label: "Express Server", icon: "🖥️", x: 260, y: 120 },
        { id: "stripe", label: "Stripe Gateway", icon: "💳", x: 440, y: 70 },
        { id: "database", label: "PostgreSQL DB", icon: "💽", x: 440, y: 170 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "stripe" },
        { from: "backend", to: "database" }
      ]
    },
    "100k": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 60, y: 120 },
        { id: "backend", label: "Express Cluster", icon: "🖥️", x: 220, y: 120 },
        { id: "stripe", label: "Stripe Gateway", icon: "💳", x: 380, y: 60 },
        { id: "redis_lock", label: "Redis Lock", icon: "🔑", x: 380, y: 180 },
        { id: "database", label: "PostgreSQL DB", icon: "💽", x: 540, y: 120 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "stripe" },
        { from: "stripe", to: "backend" },
        { from: "backend", to: "redis_lock" },
        { from: "backend", to: "database" }
      ]
    },
    "1M": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 50, y: 120 },
        { id: "gateway", label: "API Gateway", icon: "🛡️", x: 180, y: 120 },
        { id: "backend", label: "Express Services", icon: "🖥️", x: 310, y: 120 },
        { id: "stripe", label: "Stripe Webhook", icon: "💳", x: 440, y: 50 },
        { id: "redis_cluster", label: "Redis Cluster", icon: "🔑", x: 440, y: 120 },
        { id: "webhook_queue", label: "Webhook Queue", icon: "📦", x: 440, y: 190 },
        { id: "payment_workers", label: "Payment Workers", icon: "⚙️", x: 550, y: 190 },
        { id: "database", label: "Primary DB", icon: "💽", x: 550, y: 120 }
      ],
      edges: [
        { from: "app", to: "gateway" },
        { from: "gateway", to: "backend" },
        { from: "backend", to: "redis_cluster" },
        { from: "stripe", to: "webhook_queue" },
        { from: "webhook_queue", to: "payment_workers" },
        { from: "payment_workers", to: "database" }
      ]
    }
  },

  delivery: {
    "10": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 80, y: 120 },
        { id: "backend", label: "Express Server", icon: "🖥️", x: 260, y: 120 },
        { id: "google_maps", label: "Google Maps API", icon: "🗺️", x: 440, y: 70 },
        { id: "db", label: "PostgreSQL DB", icon: "💽", x: 440, y: 170 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "google_maps" },
        { from: "backend", to: "db" }
      ]
    },
    "100k": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 60, y: 120 },
        { id: "backend", label: "Express Cluster", icon: "🖥️", x: 220, y: 120 },
        { id: "db_spatial", label: "Postgres PostGIS", icon: "🌐", x: 380, y: 180 },
        { id: "google_maps", label: "Google Maps API", icon: "🗺️", x: 380, y: 60 },
        { id: "local_cache", label: "Geofence Cache", icon: "⚡", x: 540, y: 120 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "local_cache" },
        { from: "backend", to: "db_spatial" },
        { from: "backend", to: "google_maps" }
      ]
    },
    "1M": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 50, y: 120 },
        { id: "gateway", label: "API Gateway", icon: "🛡️", x: 180, y: 120 },
        { id: "backend", label: "Express Services", icon: "🖥️", x: 310, y: 120 },
        { id: "redis_geo", label: "Redis Geospatial", icon: "⚡", x: 440, y: 70 },
        { id: "db_spatial", label: "DB PostGIS", icon: "🌐", x: 560, y: 120 },
        { id: "google_maps", label: "Google Maps", icon: "🗺️", x: 440, y: 170 }
      ],
      edges: [
        { from: "app", to: "gateway" },
        { from: "gateway", to: "backend" },
        { from: "backend", to: "redis_geo" },
        { from: "redis_geo", to: "db_spatial" },
        { from: "backend", to: "google_maps" }
      ]
    }
  },

  loyalty: {
    "10": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 80, y: 120 },
        { id: "backend", label: "Express Server", icon: "🖥️", x: 260, y: 120 },
        { id: "db", label: "Mutable Bal Table", icon: "💽", x: 440, y: 120 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "db" }
      ]
    },
    "100k": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 60, y: 120 },
        { id: "backend", label: "Express Cluster", icon: "🖥️", x: 220, y: 120 },
        { id: "redis_balance", label: "Redis Balance", icon: "⚡", x: 380, y: 60 },
        { id: "db_ledger", label: "Prisma Ledger DB", icon: "💽", x: 380, y: 180 },
        { id: "occ_verifier", label: "OCC Verifier", icon: "🔑", x: 540, y: 120 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "redis_balance" },
        { from: "backend", to: "db_ledger" },
        { from: "db_ledger", to: "occ_verifier" }
      ]
    },
    "1M": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 50, y: 120 },
        { id: "gateway", label: "API Gateway", icon: "🛡️", x: 180, y: 120 },
        { id: "backend", label: "Express Services", icon: "🖥️", x: 310, y: 120 },
        { id: "kafka_ledger", label: "Kafka Ledger Strm", icon: "📦", x: 440, y: 120 },
        { id: "ledger_workers", label: "Ledger Workers", icon: "⚙️", x: 560, y: 180 },
        { id: "redis_balance", label: "Redis Balance Cls", icon: "⚡", x: 440, y: 50 },
        { id: "db_ledger", label: "PostgreSQL DB", icon: "💽", x: 560, y: 120 }
      ],
      edges: [
        { from: "app", to: "gateway" },
        { from: "gateway", to: "backend" },
        { from: "backend", to: "kafka_ledger" },
        { from: "kafka_ledger", to: "ledger_workers" },
        { from: "ledger_workers", to: "db_ledger" },
        { from: "ledger_workers", to: "redis_balance" }
      ]
    }
  },

  pos: {
    "10": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 80, y: 120 },
        { id: "backend", label: "Express Server", icon: "🖥️", x: 260, y: 120 },
        { id: "printer", label: "Kitchen Printer", icon: "🖨️", x: 440, y: 120 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "printer" }
      ]
    },
    "100k": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 60, y: 120 },
        { id: "sqlite", label: "Local SQLite", icon: "📱", x: 60, y: 210 },
        { id: "backend", label: "Express Cluster", icon: "🖥️", x: 220, y: 120 },
        { id: "queue", label: "Redis Print Queue", icon: "📦", x: 380, y: 120 },
        { id: "printer", label: "Kitchen Printer", icon: "🖨️", x: 540, y: 120 }
      ],
      edges: [
        { from: "app", to: "sqlite" },
        { from: "sqlite", to: "backend" },
        { from: "app", to: "backend" },
        { from: "backend", to: "queue" },
        { from: "queue", to: "printer" }
      ]
    },
    "1M": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 50, y: 120 },
        { id: "sqlite", label: "Local SQLite", icon: "📱", x: 50, y: 200 },
        { id: "gateway", label: "API Gateway", icon: "🛡️", x: 180, y: 120 },
        { id: "backend", label: "Express Services", icon: "🖥️", x: 310, y: 120 },
        { id: "kafka", label: "Kafka Print Stream", icon: "📦", x: 440, y: 120 },
        { id: "pos_controllers", label: "Store Controllers", icon: "⚙️", x: 560, y: 70 },
        { id: "printers", label: "Multiple Printers", icon: "🖨️", x: 560, y: 170 }
      ],
      edges: [
        { from: "app", to: "sqlite" },
        { from: "sqlite", to: "gateway" },
        { from: "app", to: "gateway" },
        { from: "gateway", to: "backend" },
        { from: "backend", to: "kafka" },
        { from: "kafka", to: "pos_controllers" },
        { from: "pos_controllers", to: "printers" }
      ]
    }
  },

  security: {
    "10": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 80, y: 120 },
        { id: "backend", label: "Express (MemSess)", icon: "🔑", x: 260, y: 120 },
        { id: "db", label: "Users Table", icon: "💽", x: 440, y: 120 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "db" }
      ]
    },
    "100k": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 60, y: 120 },
        { id: "backend", label: "Express (JWT verify)", icon: "🔑", x: 220, y: 120 },
        { id: "redis_blacklist", label: "Redis Blacklist", icon: "⚡", x: 380, y: 60 },
        { id: "db", label: "Users DB (Auth)", icon: "💽", x: 380, y: 180 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "backend", to: "redis_blacklist" },
        { from: "backend", to: "db" }
      ]
    },
    "1M": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 50, y: 120 },
        { id: "gateway", label: "API Gate (Edge JWT)", icon: "🛡️", x: 180, y: 120 },
        { id: "backend_services", label: "Microservices", icon: "🖥️", x: 310, y: 120 },
        { id: "redis_blacklist", label: "Redis Blacklist", icon: "⚡", x: 440, y: 70 },
        { id: "db", label: "User Database", icon: "💽", x: 560, y: 120 }
      ],
      edges: [
        { from: "app", to: "gateway" },
        { from: "gateway", to: "backend_services" },
        { from: "gateway", to: "redis_blacklist" },
        { from: "backend_services", to: "db" }
      ]
    }
  },

  analytics: {
    "10": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 60, y: 150 },
        { id: "admin_dashboard", label: "Admin Panel", icon: "📊", x: 60, y: 70 },
        { id: "backend", label: "Express Server", icon: "🖥️", x: 220, y: 110 },
        { id: "db", label: "Single Database", icon: "💽", x: 380, y: 110 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "admin_dashboard", to: "backend" },
        { from: "backend", to: "db" }
      ]
    },
    "100k": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 60, y: 150 },
        { id: "admin_dashboard", label: "Admin Panel", icon: "📊", x: 60, y: 70 },
        { id: "backend", label: "Express Cluster", icon: "🖥️", x: 220, y: 110 },
        { id: "db_primary", label: "OLTP Write DB", icon: "💽", x: 380, y: 150 },
        { id: "db_replica", label: "OLAP Read Replica", icon: "💽", x: 380, y: 70 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "admin_dashboard", to: "backend" },
        { from: "backend", to: "db_primary" },
        { from: "db_primary", to: "db_replica" },
        { from: "backend", to: "db_replica" }
      ]
    },
    "1M": {
      nodes: [
        { id: "app", label: "Flutter App", icon: "📱", x: 50, y: 150 },
        { id: "admin_dashboard", label: "Admin Panel", icon: "📊", x: 50, y: 60 },
        { id: "backend", label: "Express Services", icon: "🖥️", x: 190, y: 110 },
        { id: "db_primary", label: "OLTP Write DB", icon: "💽", x: 330, y: 150 },
        { id: "event_stream", label: "Kafka Event Stream", icon: "📦", x: 330, y: 60 },
        { id: "olap_db", label: "ClickHouse OLAP", icon: "📊", x: 470, y: 60 }
      ],
      edges: [
        { from: "app", to: "backend" },
        { from: "admin_dashboard", to: "backend" },
        { from: "backend", to: "db_primary" },
        { from: "backend", to: "event_stream" },
        { from: "event_stream", to: "olap_db" },
        { from: "backend", to: "olap_db" }
      ]
    }
  }
};
