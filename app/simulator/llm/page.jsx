"use client";

import SplitPaneViewer from "@/components/SplitPaneViewer";

export default function LlmSimulator() {
  return (
    <SplitPaneViewer
      concept="Large Language Model internals"
      title="LLM Transformer"
      visualizerUrl="https://bbycroft.net/llm"
      defaultQuery="How does an LLM Transformer work, what are matrix weights, and how does key-value caching optimize latency?"
    />
  );
}
