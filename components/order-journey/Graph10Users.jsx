"use client";

import React from "react";
import { Edge, Node } from "./GraphHelpers";

export default function Graph10Users({ activeLinks, errorLink }) {
  return (
    <svg width="100%" height="260" viewBox="0 0 600 240" style={{ background: "var(--bg-2)", borderRadius: 14, border: "1px solid var(--hairline-2)" }}>
      {/* Edges */}
      <Edge x1={96} y1={110} x2={152} y2={110} from="app" to="backend" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={248} y1={110} x2={432} y2={110} from="backend" to="pos" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={220} y1={92} x2={302} y2={58} from="backend" to="payment" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={398} y1={58} x2={230} y2={92} from="payment" to="backend" activeLinks={activeLinks} errorLink={errorLink} />
      <Edge x1={220} y1={128} x2={302} y2={162} from="backend" to="database" activeLinks={activeLinks} errorLink={errorLink} />

      {/* Nodes */}
      <Node x={50} y={110} label="Flutter App" icon="📱" id="app" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={200} y={110} label="Express Server" icon="🖥️" id="backend" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={350} y={48} label="Stripe Gateway" icon="💳" id="payment" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={350} y={172} label="PostgreSQL DB" icon="💽" id="database" activeLinks={activeLinks} errorLink={errorLink} />
      <Node x={480} y={110} label="Kitchen POS" icon="🖨️" id="pos" activeLinks={activeLinks} errorLink={errorLink} />
    </svg>
  );
}
