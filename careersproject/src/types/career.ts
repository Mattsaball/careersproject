// src/types/career.ts
export interface CareerJourney {
  id: string;
  company: string;
  industry: string;
  graduationYear: string;
  major: string;
  postGradPlans: string;
  careerPath: string;
  freshmanAdvice: string;
  skillsToFocus: string;
  shortcuts: string;
  additionalAdvice: string;
  majorFilters: string[];
  industryFilters: string[]; // change to `industryFilters?: string[]` if you choose the temporary route
}
