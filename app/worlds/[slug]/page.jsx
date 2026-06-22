import React from "react";
import { notFound } from "next/navigation";
import { WORLD_CONTENT } from "@/components/worlds/world-content";
import WorldHero from "@/components/worlds/WorldHero";
import CodexPanel from "@/components/worlds/CodexPanel";
import SimulatorPanel from "@/components/worlds/SimulatorPanel";
import FailuresPanel from "@/components/worlds/FailuresPanel";
import ScalingPanel from "@/components/worlds/ScalingPanel";
import CodePanel from "@/components/worlds/CodePanel";
import IndustryPanel from "@/components/worlds/IndustryPanel";

// Generate static parameters for Next.js static page compilation
export async function generateStaticParams() {
  return [
    { slug: "order" },
    { slug: "payment" },
    { slug: "delivery" },
    { slug: "loyalty" },
    { slug: "security" },
    { slug: "pos" },
    { slug: "analytics" },
    { slug: "deployment" }
  ];
}

export default function WorldExplorerPage({ params }) {
  const { slug } = params;
  const world = WORLD_CONTENT[slug];

  if (!world) {
    notFound();
  }

  return (
    <main style={{ padding: "30px 40px 80px", maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Hero Section */}
      <WorldHero world={world} />

      {/* Middle Split View Screen */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 24 }} className="hero-grid">
        {/* Left Column: Codex Text Panel */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <CodexPanel codex={world.codex} worldSlug={slug} tint={world.tint} />
        </div>

        {/* Right Column: Simulator Interactive Panel */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SimulatorPanel simulatorName={world.simulatorName} />
        </div>
      </section>

      {/* Bottom Failure Panel */}
      <section>
        <FailuresPanel failures={world.failures} />
      </section>

      {/* Bottom Scaling Panel */}
      <section>
        <ScalingPanel scalingStats={world.scalingStats} worldSlug={slug} />
      </section>

      {/* Bottom 2-Column Grid (Code references & Industry examples) */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="path-grid">
        <CodePanel anchors={world.anchors} />
        <IndustryPanel industry={world.industry} />
      </section>
    </main>
  );
}
