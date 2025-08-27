// src/pages/Index.tsx   (or src/app/page.tsx for Next App Router)
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { careerJourneys } from "@/data/careerJourneys"; // mapped data with industryFilters & majorFilters
import type { CareerJourney } from "@/types/career";

import { CareerCard } from "@/components/CareerCard";
import { CareerModal } from "@/components/CareerModal";

const uniqueSorted = (arr: string[]) =>
  Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));

export default function Index() {
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [active, setActive] = useState<CareerJourney | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Build filter option lists
  const majorOptions = useMemo(
    () => uniqueSorted(careerJourneys.flatMap(j => j.majorFilters || [])),
    []
  );

  const industryOptions = useMemo(
    () => uniqueSorted(careerJourneys.flatMap(j => j.industryFilters || [])),
    []
  );

  // Filtering logic (AND across each dimension)
  const filtered = useMemo(() => {
    return careerJourneys.filter(j => {
      const majorsOk =
        selectedMajors.length === 0 ||
        selectedMajors.every(m => j.majorFilters.includes(m));
      const industriesOk =
        selectedIndustries.length === 0 ||
        selectedIndustries.every(i => j.industryFilters.includes(i));
      return majorsOk && industriesOk;
    });
  }, [selectedMajors, selectedIndustries]);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const openModal = (j: CareerJourney) => {
    setActive(j);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return (
    <div className="space-y-4">
      {/* Industry chips (with prefix) */}
      <div className="flex flex-wrap items-center gap-2">
        {industryOptions.map(opt => {
          const isActive = selectedIndustries.includes(opt);
          return (
            <Badge
              key={opt}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer flex items-center gap-1"
              onClick={() => toggle(selectedIndustries, setSelectedIndustries, opt)}
            >
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Industry
              </span>
              {opt}
            </Badge>
          );
        })}
        {selectedIndustries.length > 0 && (
          <button
            className="text-xs underline ml-1"
            onClick={() => setSelectedIndustries([])}
          >
            clear industries
          </button>
        )}
      </div>

      {/* Major chips (with prefix) */}
      <div className="flex flex-wrap items-center gap-2">
        {majorOptions.map(opt => {
          const isActive = selectedMajors.includes(opt);
          return (
            <Badge
              key={opt}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer flex items-center gap-1"
              onClick={() => toggle(selectedMajors, setSelectedMajors, opt)}
            >
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Major
              </span>
              {opt}
            </Badge>
          );
        })}
        {selectedMajors.length > 0 && (
          <button
            className="text-xs underline ml-1"
            onClick={() => setSelectedMajors([])}
          >
            clear majors
          </button>
        )}
      </div>

      <Separator />

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(j => (
          <CareerCard key={j.id} career={j} onClick={() => openModal(j)} />
        ))}
      </div>

      {/* Modal */}
      <CareerModal career={active} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
