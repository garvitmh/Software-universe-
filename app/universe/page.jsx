"use client";

import React from "react";
import { UniverseProvider } from "@/components/universe/UniverseContext";
import UniverseDashboard from "@/components/universe/ui/UniverseDashboard";

export default function UniversePage() {
  return (
    <UniverseProvider>
      <main className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <UniverseDashboard />
      </main>
    </UniverseProvider>
  );
}
