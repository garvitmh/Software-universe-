"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { COMPANIES_DB } from "./CompanySchema";

export function useCaseStudyMuseumState() {
  const [selectedCompanyId, setSelectedCompanyId] = useState("netflix");
  const [compareIds, setCompareIds] = useState([]);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef(null);

  const selectedCompany = useMemo(() => {
    return COMPANIES_DB.find((c) => c.id === selectedCompanyId) || COMPANIES_DB[0];
  }, [selectedCompanyId]);

  // Reset active timeline index when changing company
  const selectCompany = (id) => {
    const exists = COMPANIES_DB.some((c) => c.id === id);
    if (exists) {
      setSelectedCompanyId(id);
      setActiveTimelineIndex(0);
      setIsPlayingTimeline(false);
    }
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      } else {
        if (prev.length >= 2) {
          return [prev[1], id];
        }
        return [...prev, id];
      }
    });
  };

  const resetComparison = () => {
    setCompareIds([]);
  };

  // Timeline autoplay logic
  useEffect(() => {
    if (isPlayingTimeline && selectedCompany.timeline) {
      const intervalTime = 5000 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setActiveTimelineIndex((prev) => {
          if (prev >= selectedCompany.timeline.length - 1) {
            setIsPlayingTimeline(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalTime);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlayingTimeline, playbackSpeed, selectedCompany]);

  return {
    selectedCompanyId,
    selectedCompany,
    compareIds,
    activeTimelineIndex,
    isPlayingTimeline,
    playbackSpeed,
    allCompanies: COMPANIES_DB,
    selectCompany,
    toggleCompare,
    resetComparison,
    setTimelineIndex: setActiveTimelineIndex,
    togglePlayTimeline: () => setIsPlayingTimeline(!isPlayingTimeline),
    setPlaybackSpeed
  };
}
