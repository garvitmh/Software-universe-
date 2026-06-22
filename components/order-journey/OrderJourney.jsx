"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TimelineControls from "./TimelineControls";
import PipelineStages from "./PipelineStages";
import EventLog from "./EventLog";
import StateInspector from "./StateInspector";
import DependencyGraph from "./DependencyGraph";
import EventDetailsPanel from "./EventDetailsPanel";
import GiantComparisonPanel from "./GiantComparisonPanel";

const getEvents = (posOffline) => {
  const baseEvents = [
    {
      id: "CUSTOMER_TAP",
      label: "Customer Tap",
      stage: "customer",
      narration: "Customer taps “Place Order” on the mobile application to purchase their meal.",
      details: "The journey begins on the user's device. A client-side touch registers the intent, but the phone holds no data or inventory. It merely initiates the network request chain.",
      giant: "Amazon: Uses 1-Click checkout systems that perform instant client-side validation and initiate request routing to Edge locations.",
      state: {
        app: { cart: ["Double Cheeseburger", "Fries"], status: "draft" },
        network: null,
        database: null,
        payment: null,
        pos: null,
        queue: null
      },
      activeLinks: []
    },
    {
      id: "REQ_DISPATCHED",
      label: "Request Dispatched",
      stage: "app",
      narration: "The Flutter app packages the cart data with a JWT token and idempotency key, sending it to the API Gateway.",
      details: "The network client (Dio) serializes the cart and includes request headers (`Authorization` and `X-Idempotency-Key`) to protect against network drops and duplicate processing.",
      giant: "Netflix: Mobile apps construct retry headers and fallback mechanisms directly on client network layers to prevent request dropouts on spotty connections.",
      state: {
        app: { status: "sending" },
        network: {
          url: "/api/v1/orders",
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsIn...",
            "X-Idempotency-Key": "idem-9a84b2-291c"
          },
          body: { cartId: "cart_99a", items: ["Double Cheeseburger", "Fries"] }
        },
        database: null,
        payment: null,
        pos: null,
        queue: null
      },
      activeLinks: ["app->cdn", "app->gateway", "cdn->gateway", "app->backend"]
    },
    {
      id: "VALIDATION_OK",
      label: "Validation Check",
      stage: "backend",
      narration: "Express server receives the request, validates active items, and verifies current pricing.",
      details: "The backend acts as the gateway warden. It checks if the items exist, matches the incoming cart prices against the database menu pricing, and verifies that the store is active.",
      giant: "Swiggy: Server-side validators query cache layers to check menu availability, active pricing overrides, and store open hours before executing transactions.",
      state: {
        app: { status: "processing" },
        network: { status: "received" },
        database: { connection: "active", query: "SELECT * FROM menu_items WHERE id IN (...)" },
        payment: null,
        pos: null,
        queue: null
      },
      activeLinks: ["gateway->backend", "backend->database", "gateway->order_service", "order_service->database_cluster"]
    },
    {
      id: "PAYMENT_PENDING",
      label: "Payment Intent",
      stage: "payment",
      narration: "Backend contacts external payment gateway (Stripe/Razorpay) to register transaction intent.",
      details: "Instead of collecting credit card details directly, the backend requests a secure payment token and intent session from the external gateway, keeping our database out of PCI compliance scope.",
      giant: "Stripe: Creates localized PaymentIntent objects that lock in currency exchange rates, taxes, and transaction values before billing.",
      state: {
        app: { status: "paying" },
        network: { status: "pending_callback" },
        database: { connection: "active" },
        payment: { intentId: "pi_stripe_7719a", status: "requires_action", amount: 12.50 },
        pos: null,
        queue: null
      },
      activeLinks: ["backend->payment", "gateway->payment_service", "payment_service->stripe_api"]
    },
    {
      id: "PAYMENT_SUCCESS",
      label: "Webhook Authorized",
      stage: "payment",
      narration: "Payment is captured successfully, and Stripe fires a webhook event back to the server.",
      details: "The server receives a cryptographically signed webhook confirming payment. We rely ONLY on server-to-server webhook confirmation, never trust app-side confirmations.",
      giant: "Adyen: Enforces strict webhook authentication signatures to avoid spoofing attacks, shielding core orders from client-side drops.",
      state: {
        app: { status: "paying" },
        network: { status: "webhook_received" },
        database: { connection: "active" },
        payment: { transactionId: "txn_stripe_994a1", status: "succeeded" },
        pos: null,
        queue: null
      },
      activeLinks: ["payment->backend", "stripe_api->payment_service", "payment_service->gateway"]
    },
    {
      id: "DB_TRANSACTION",
      label: "Database Commit",
      stage: "database",
      narration: "The server executes a Prisma transaction writing the Order & OrderPayment logs in a single commit.",
      details: "A database transaction ensures all-or-nothing writes. If the order insertion fails, the payment log rollback occurs, avoiding mismatched financial records. The order is stored as PLACED.",
      giant: "Stripe Ledger: Enforces immutable append-only ledger logs in transactions so accounting records can always be reconciled.",
      state: {
        app: { status: "placed" },
        network: null,
        database: {
          transaction: "committed",
          rowsInserted: {
            Order: { id: 412, status: "PLACED" },
            OrderPayment: { id: 89, amount: 12.50, status: "PAID" }
          }
        },
        payment: { status: "captured" },
        pos: null,
        queue: null
      },
      activeLinks: ["backend->database", "gateway->order_service", "order_service->database_cluster"]
    }
  ];

  const posEvents = [];

  if (posOffline) {
    posEvents.push(
      {
        id: "POS_FAILURE",
        label: "POS Timeout",
        stage: "pos",
        narration: "Attempt to dispatch ticket to restaurant POS fails due to offline local hardware.",
        details: "Restaurant tablet is offline (unstable Wi-Fi). If the backend tried to write synchronously without fallbacks, the client checkout would freeze, and the order would be dropped.",
        giant: "Uber: Detects partner hardware timeouts and immediately reroutes orders through asynchronous fallbacks to maintain 100% booking success.",
        state: {
          app: { status: "confirmed" },
          network: null,
          database: { Order: { id: 412, status: "PLACED" } },
          payment: { status: "captured" },
          pos: { status: "TIMEOUT_ERROR" },
          queue: null
        },
        activeLinks: ["backend->pos", "order_service->pos_api"],
        errorLink: "backend->pos"
      },
      {
        id: "QUEUE_INGESTION",
        label: "Queue Buffer Ingest",
        stage: "pos",
        narration: "Rescue flow: The dispatch job is pushed into Redis queue for retries, freeing the client.",
        details: "We decouple the kitchen dispatch. The backend places the dispatch command in a Redis message queue and responds OK to the client. The customer thinks their order was received, keeping the UX fast.",
        giant: "Netflix: Employs circuit breakers and fallback queues (Resilience4j) to prevent failures in downstream partner components from freezing checkout paths.",
        state: {
          app: { status: "confirmed" },
          network: null,
          database: { Order: { id: 412, status: "PLACED" } },
          payment: { status: "captured" },
          pos: { status: "OFFLINE" },
          queue: { size: 1, jobs: [{ id: "job_99a", payload: { orderId: 412 } }] }
        },
        activeLinks: ["backend->queue", "gateway->order_service", "order_service->kafka_queue"]
      },
      {
        id: "QUEUE_RETRY",
        label: "Queue Retry Success",
        stage: "pos",
        narration: "POS terminal reconnects. The background worker retries and prints the ticket.",
        details: "The queue processor retries every 5 seconds. Once the terminal responds, the job completes, database is updated, and the ticket is physically printed in the kitchen. Nothing is lost.",
        giant: "Swiggy: Employs persistent RabbitMQ clusters to throttle and retry order deliveries to remote restaurant hardware, achieving 99.9% print success.",
        state: {
          app: { status: "confirmed" },
          network: null,
          database: { Order: { id: 412, status: "PREPARING" } },
          payment: { status: "captured" },
          pos: { status: "printed", ticketId: "t-412" },
          queue: { size: 0, jobs: [] }
        },
        activeLinks: ["queue->pos", "kafka_queue->pos_api"]
      }
    );
  } else {
    posEvents.push({
      id: "POS_SUCCESS",
      label: "POS Ticket Printed",
      stage: "pos",
      narration: "Order ticket is transmitted to restaurant POS system, and the receipt printer outputs the chef ticket.",
      details: "At normal scale, the POS receives the payload and acknowledges receipt, updating the order state to PREPARING in the database.",
      giant: "McDonald's: Integrates standard POS systems (NP6) that consume JSON payloads from web services to print tickets for assembly lines.",
      state: {
        app: { status: "confirmed" },
        network: null,
        database: { Order: { id: 412, status: "PREPARING" } },
        payment: { status: "captured" },
        pos: { status: "printed", ticketId: "t-412" },
        queue: null
      },
      activeLinks: ["backend->pos", "gateway->order_service", "order_service->kafka_queue", "kafka_queue->pos_api"]
    });
  }

  const remainingEvents = [
    {
      id: "PREP_START",
      label: "Kitchen Assembly",
      stage: "kitchen",
      narration: "Chef accepts order on the Kitchen Screen and begins burger assembly.",
      details: "Kitchen staff prepare the food. Status transitions to PREPARING. Database state replicates to read-only replica servers to offload analytical query traffic.",
      giant: "Chipotle: Uses digital kitchen screens (KDS) synchronized with webhooks to coordinate assembler flows and cooking times.",
      state: {
        app: { status: "preparing" },
        network: null,
        database: { Order: { id: 412, status: "PREPARING" } },
        payment: { status: "captured" },
        pos: { status: "cooking" },
        queue: null
      },
      activeLinks: []
    },
    {
      id: "COURIER_ASSIGNED",
      label: "Courier Dispatched",
      stage: "delivery",
      narration: "System assigns a delivery courier and computes geographical routing serviceability.",
      details: "We check the delivery coordinates against our in-memory geofence polygon cache first to save Google Maps API costs. The courier accepts the dispatch and picks up the meal.",
      giant: "Uber: Executes spatial indexing algorithms (H3 hexagons) to match orders with couriers, minimizing pickup travel times.",
      state: {
        app: { status: "out_for_delivery" },
        network: null,
        database: { Order: { id: 412, status: "OUT_FOR_DELIVERY" } },
        payment: { status: "captured" },
        pos: { status: "completed" },
        queue: null
      },
      activeLinks: ["backend->delivery", "gateway->order_service", "order_service->courier"]
    },
    {
      id: "ORDER_DELIVERED",
      label: "Order Delivered",
      stage: "customer",
      narration: "The courier hands the meal to the customer. Order marked COMPLETED in database.",
      details: "The lifecycle terminates. The order record transitions to its final state (COMPLETED) in the primary database and is archived into analytical storage.",
      giant: "Swiggy: Closes the transaction cycle by archiving events to cold data lakes for future analytical aggregations.",
      state: {
        app: { status: "delivered", cart: [] },
        network: null,
        database: { Order: { id: 412, status: "COMPLETED" } },
        payment: { status: "captured" },
        pos: null,
        queue: null
      },
      activeLinks: []
    }
  ];

  return [...baseEvents, ...posEvents, ...remainingEvents];
};

export default function OrderJourney() {
  const [scaleLoad, setScaleLoad] = useState("10"); // "10" | "100k" | "1M"
  const [posOffline, setPosOffline] = useState(false);
  const [currentEventIdx, setCurrentEventIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState("graph"); // "graph" | "inspector"
  const [selectedEventIdx, setSelectedEventIdx] = useState(-1);

  const runId = useRef(0);
  const events = getEvents(posOffline);

  // Sync selected event index with current simulator event during execution
  useEffect(() => {
    if (running) {
      setSelectedEventIdx(currentEventIdx);
    }
  }, [currentEventIdx, running]);

  // If configuration changes, reset timeline
  useEffect(() => {
    reset();
  }, [posOffline, scaleLoad]);

  const activeEvent = selectedEventIdx >= 0 ? events[selectedEventIdx] : null;

  async function run() {
    if (running) {
      setRunning(false);
      return;
    }
    setRunning(true);
    const myRun = ++runId.current;
    
    let startIdx = currentEventIdx;
    if (startIdx >= events.length - 1) {
      startIdx = -1;
    }

    for (let i = startIdx + 1; i < events.length; i++) {
      if (runId.current !== myRun) return;
      setCurrentEventIdx(i);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    setRunning(false);
  }

  function stepBack() {
    setRunning(false);
    setCurrentEventIdx((prev) => Math.max(-1, prev - 1));
    setSelectedEventIdx((prev) => Math.max(-1, prev - 1));
  }

  function stepForward() {
    setRunning(false);
    setCurrentEventIdx((prev) => Math.min(events.length - 1, prev + 1));
    setSelectedEventIdx((prev) => Math.min(events.length - 1, prev + 1));
  }

  function reset() {
    runId.current++;
    setRunning(false);
    setCurrentEventIdx(-1);
    setSelectedEventIdx(-1);
  }

  const handleStageSelect = (stageId) => {
    setRunning(false);
    const evIdx = events.findIndex(e => e.stage === stageId);
    if (evIdx >= 0) {
      setCurrentEventIdx(evIdx);
      setSelectedEventIdx(evIdx);
    }
  };

  const handleEventSelect = (idx) => {
    setRunning(false);
    setCurrentEventIdx(idx);
    setSelectedEventIdx(idx);
  };

  const handleScrub = (val) => {
    setRunning(false);
    setCurrentEventIdx(val);
    setSelectedEventIdx(val);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* Playback & Scale controls */}
      <TimelineControls 
        running={running}
        currentEventIdx={currentEventIdx}
        events={events}
        run={run}
        stepBack={stepBack}
        stepForward={stepForward}
        reset={reset}
        posOffline={posOffline}
        setPosOffline={setPosOffline}
        scaleLoad={scaleLoad}
        setScaleLoad={setScaleLoad}
        onScrub={handleScrub}
      />

      {/* Horizontal Pipeline Steps */}
      <PipelineStages 
        activeEvent={activeEvent}
        events={events}
        currentEventIdx={currentEventIdx}
        onStageSelect={handleStageSelect}
      />

      {/* Main Debugger Dashboard (Split Screen: Left Event Log, Right Details/Inspector) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 24 }} className="hero-grid">
        
        {/* Left Side: Chronological Event Log */}
        <EventLog 
          events={events}
          currentEventIdx={currentEventIdx}
          selectedEventIdx={selectedEventIdx}
          onEventSelect={handleEventSelect}
        />

        {/* Right Side: Tabbed Display (Dependency Graph or State Inspector) */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14, padding: 20 }}>
          {/* Tab Selection */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--hairline)", paddingBottom: 8 }}>
            <div style={{ display: "flex", background: "var(--bg-2)", padding: 3, borderRadius: 8, gap: 4 }}>
              <button
                onClick={() => setSelectedTab("graph")}
                style={{
                  padding: "5px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  background: selectedTab === "graph" ? "var(--surface)" : "transparent",
                  color: selectedTab === "graph" ? "var(--brand-2)" : "var(--ink-2)",
                  boxShadow: selectedTab === "graph" ? "var(--shadow)" : "none"
                }}
              >
                🗺️ Dependency Graph
              </button>
              <button
                onClick={() => setSelectedTab("inspector")}
                style={{
                  padding: "5px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  background: selectedTab === "inspector" ? "var(--surface)" : "transparent",
                  color: selectedTab === "inspector" ? "var(--brand-2)" : "var(--ink-2)",
                  boxShadow: selectedTab === "inspector" ? "var(--shadow)" : "none"
                }}
              >
                🔍 State Inspector
              </button>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
              Scale: {scaleLoad === "10" ? "Single Node" : scaleLoad === "100k" ? "Clustered Architecture" : "Distributed Enterprise"}
            </span>
          </div>

          {/* Dynamic Content */}
          <div style={{ flex: 1, minHeight: 280 }}>
            {selectedTab === "graph" ? (
              <DependencyGraph activeLinks={activeEvent?.activeLinks || []} errorLink={activeEvent?.errorLink} scale={scaleLoad} />
            ) : (
              <StateInspector state={activeEvent?.state} />
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row: Detailed Explanations, State transitions, and Giant Comparisons */}
      <AnimatePresence mode="wait">
        {activeEvent && (
          <motion.div
            key={activeEvent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}
            className="path-grid"
          >
            {/* Stage Detailed Info Panel */}
            <EventDetailsPanel activeEvent={activeEvent} />

            {/* Giant Comparison Panel */}
            <GiantComparisonPanel activeEvent={activeEvent} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
