"use client";

import { useState, useMemo } from "react";
import { PATTERNS_DB } from "./PatternSchema";

export function usePatternAtlasState() {
  const [selectedPatternId, setSelectedPatternId] = useState("retries");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareIds, setCompareIds] = useState([]);
  
  // Decision tree tracking
  const [decisionPath, setDecisionPath] = useState(["root"]);

  const selectedPattern = useMemo(() => {
    return PATTERNS_DB.find((p) => p.id === selectedPatternId) || PATTERNS_DB[0];
  }, [selectedPatternId]);

  const categories = useMemo(() => {
    const list = new Set(PATTERNS_DB.map((p) => p.category));
    return ["ALL", ...Array.from(list)];
  }, []);

  const filteredPatterns = useMemo(() => {
    return PATTERNS_DB.filter((p) => {
      const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectPattern = (id) => {
    const exists = PATTERNS_DB.some((p) => p.id === id);
    if (exists) {
      setSelectedPatternId(id);
    }
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      } else {
        if (prev.length >= 2) {
          // Keep maximum 2 patterns compared side-by-side
          return [prev[1], id];
        }
        return [...prev, id];
      }
    });
  };

  const resetComparison = () => {
    setCompareIds([]);
  };

  const pushDecisionNode = (nodeId) => {
    setDecisionPath((prev) => [...prev, nodeId]);
  };

  const popDecisionNode = () => {
    setDecisionPath((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  const resetDecisionTree = () => {
    setDecisionPath(["root"]);
  };

  return {
    selectedPatternId,
    selectedPattern,
    selectedCategory,
    searchQuery,
    compareIds,
    decisionPath,
    categories,
    filteredPatterns,
    allPatterns: PATTERNS_DB,
    selectPattern,
    setSelectedCategory,
    setSearchQuery,
    toggleCompare,
    resetComparison,
    pushDecisionNode,
    popDecisionNode,
    resetDecisionTree
  };
}
