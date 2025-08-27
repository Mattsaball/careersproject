import { useMemo } from "react";
import { CareerJourney } from "@/types/career";

export function useMajorOptions(journeys: CareerJourney[]) {
  return useMemo(() => {
    const s = new Set<string>();
    journeys.forEach(j => j.majorFilters.forEach(m => s.add(m)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [journeys]);
}

export function useIndustryOptions(journeys: CareerJourney[]) {
  return useMemo(() => {
    const s = new Set<string>();
    journeys.forEach(j => j.industryFilters.forEach(m => s.add(m)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [journeys]);
}
