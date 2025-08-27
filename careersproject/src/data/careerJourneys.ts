// src/data/index.ts
import { CareerJourney } from "@/types/career";
import journeysData from "@/data/responses.json";

const toGradYear = (yearStr?: string) =>
  (yearStr?.match(/\b(20\d{2})\b/)?.[1]) || "";

const toArray = (v: unknown): string[] =>
  Array.isArray(v) ? (v as string[]).filter(Boolean) : v ? [String(v)] : [];

const splitPipes = (v: unknown) =>
  toArray(v)
    .flatMap(x => x.split("||").map(s => s.trim()))
    .filter(Boolean);

const toComma = (v?: string | string[]) =>
  Array.isArray(v) ? v.join(", ") : (v || "");

export const careerJourneys: CareerJourney[] = (journeysData as any[]).map(
  (j, i) => {
    const industryFilters = splitPipes(j.CareerFilter);  // <-- ensure this exists
    const majorFilters = splitPipes(j.MajorFilter);

    return {
      id: String(i + 1),

      // display fields
      company: "",
      industry: toComma(industryFilters),
      graduationYear: toGradYear(j.Year),
      major: j.MajorMinor ? j.MajorMinor : toComma(majorFilters),
      postGradPlans: j.PostGradPlans || "",
      careerPath: j.PreviousExperiences || "",
      freshmanAdvice: j.FreshmanSophomoreAdvice || "",
      skillsToFocus: j.Skills || "",
      shortcuts: j.Hacks || "",
      additionalAdvice: j.AdditionalAdvice || "",

      // structured filters (REQUIRED by type)
      industryFilters,           // <-- add this
      majorFilters,              // already present
    };
  }
);
