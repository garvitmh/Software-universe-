"use client";

import SplitPaneViewer from "@/components/SplitPaneViewer";

export default function VisualgoSimulator() {
  return (
    <SplitPaneViewer
      concept="B-Tree database index"
      title="B-Tree Indexing"
      visualizerUrl="https://visualgo.net/en/bst?mode=BTree"
      defaultQuery="Explain how a database B-Tree index functions, why it is preferred over Binary Search Trees, and when node splits occur."
    />
  );
}
