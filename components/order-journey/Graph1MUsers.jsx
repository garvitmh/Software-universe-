"use client";

import React from "react";
import { Edge, Node } from "./GraphHelpers";

export default function Graph1MUsers({ activeLinks, errorLink }) {
  return (
    <svg width="100%" height="260" viewBox="0 0 600 240" style={{ background: "var(--bg-2)", borderRadius: 14, border: "1px solid var(--hairline-2)" }}>
      {/* Edges */}
      <Edge x1={78} y1={110} x2={92} y2={110} from="app" to="cdn" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={170} y1={110} x2={192} y2={110} from="cdn" to="gateway" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={240} y1={92} x2={272} y2={58} from="gateway" to="payment_service" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={368} y1={48} x2={402} y2={48} from="payment_service" to="stripe_api" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={240} y1={128} x2={272} y2={162} from="gateway" to="order_service" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={368} y1={162} x2={385} y2={140} from="order_service" to="database_cluster" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={368} y1={172} x2={385} y2={210} from="order_service" to="redis_cache" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={368} y1={162} x2={412} y2={162} from="order_service" to="kafka_queue" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={508} y1={162} x2={520} y2={125} from="kafka_queue" to="pos_api" activeLinks={activeLinks} errorLink={errorLink} />

      {/* Nodes */}
      <Node x={30} y={110} label="Flutter App" icon="📱" id="app" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={130} y={110} label="Cloudflare CDN" icon="☁️" id="cdn" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={230} y={110} label="Kong Gateway" icon="🛡️" id="gateway" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={320} y={48} label="Payment Micro" icon="⚙️" id="payment_service" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={450} y={48} label="Stripe Gateway" icon="💳" id="stripe_api" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={320} y={162} label="Order Micro" icon="⚙️" id="order_service" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={430} y={120} label="Postgres Cluster" icon="💽" id="database_cluster" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={430} y={210} label="Redis Cache" icon="💾" id="redis_cache" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={460} y={162} label="Kafka Queue" icon="📦" id="kafka_queue" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={550} y={110} label="Kitchen POS API" icon="🖨️" id="pos_api" activeLinks={activeLinks} errorLink={errorLink} />
    </svg>
  );
}
