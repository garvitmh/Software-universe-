"use client";

import React from "react";
import Graph10Users from "./Graph10Users";
import Graph100kUsers from "./Graph100kUsers";
import Graph1MUsers from "./Graph1MUsers";

export default function DependencyGraph({ activeLinks, errorLink, scale }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", margin: 0 }}>
          Live Service Topology
        </h5>
        <div style={{ display: "flex", gap: 10, fontSize: 11, fontWeight: 600 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)" }} /> 
            Active Data
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand)" }} /> 
            Error
          </span>
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        {scale === "10" && (
          <Graph10Users activeLinks={activeLinks} errorLink={errorLink} />
        )}
        {scale === "100k" && (
          <Graph100kUsers activeLinks={activeLinks} errorLink={errorLink} />
        )}
        {scale === "1M" && (
          <Graph1MUsers activeLinks={activeLinks} errorLink={errorLink} />
        )}
      </div>
    </div>
  );
}
