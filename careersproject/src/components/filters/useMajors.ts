// src/components/filters/useMajors.ts
import { useMemo } from "react";
import { CareerJourney } from "@/types/career";

export function useMajorOptions(journeys: CareerJourney[]) {
  return useMemo(() => {
    const set = new Set<string>();
    journeys.forEach(j => j.majorFilters.forEach(m => set.add(m)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [journeys]);
}
