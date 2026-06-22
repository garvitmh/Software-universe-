"use client";

import React from "react";
import { Edge, Node } from "./GraphHelpers";

export default function Graph100kUsers({ activeLinks, errorLink }) {
  return (
    <svg width="100%" height="260" viewBox="0 0 600 240" style={{ background: "var(--bg-2)", borderRadius: 14, border: "1px solid var(--hairline-2)" }}>
      {/* Edges */}
      <Edge x1={78} y1={110} x2={102} y2={110} from="app" to="gateway" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={198} y1={110} x2={212} y2={110} from="gateway" to="backend" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={260} y1={92} x2={322} y2={58} from="backend" to="payment" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={260} y1={128} x2={322} y2={162} from="backend" to="database_primary" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={418} y1={162} x2={482} y2={162} from="database_primary" to="database_replica" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={285} y1={120} x2={325} y2={210} from="backend" to="queue" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={390} y1={210} x2={485} y2={128} from="queue" to="pos" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={260} y1={110} x2={460} y2={110} from="backend" to="pos" activeLinks={activeLinks} errorLink={errorLink} />

      {/* Nodes */}
      <Node x={30} y={110} label="Flutter App" icon="📱" id="app" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={150} y={110} label="API Gateway" icon="🛡️" id="gateway" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={260} y={110} label="Express Cluster" icon="🖥️" id="backend" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={370} y={48} label="Stripe API" icon="💳" id="payment" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={370} y={150} label="PostgreSQL Prim" icon="💽" id="database_primary" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={530} y={150} label="DB Read Replica" icon="💽" id="database_replica" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={370} y={210} label="Redis Queue" icon="📦" id="queue" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={520} y={110} label="Kitchen POS" icon="🖨️" id="pos" activeLinks={activeLinks} errorLink={errorLink} />
    </svg>
  );
}
