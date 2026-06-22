"use client";

import SplitPaneViewer from "@/components/SplitPaneViewer";

export default function RaftSimulator() {
  return (
    <SplitPaneViewer
      concept="Raft distributed consensus"
      title="Raft Consensus"
      visualizerUrl="https://raft.github.io/raft.html"
      defaultQuery="Explain Raft consensus. How does leader election, split-brain, and log replication work?"
    />
  );
}
