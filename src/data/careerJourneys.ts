import { CareerJourney } from "@/types/career";
import reflectsData from "../../reflects.json";

// Dynamically load all entries from reflects.json and add IDs
export const careerJourneys: CareerJourney[] = (reflectsData as any[]).map((entry, index) => ({
  id: (index + 1).toString(),
  company: (() => {
    const pg = entry["Post Grad Plans"] || "";
    if (typeof pg === "string") {
      const afterColon = pg.split(":")[1]?.trim();
      return afterColon || "";
    }
    return "";
  })(),
  industry: entry["Career Filter"] || "",
  graduationYear: entry["Year"] || "",
  major: entry["What is your Major(s) and Minor(s)?"] || "",
  postGradPlans: entry["Post Grad Plans"] || "",
  careerPath: entry["Previous experiences and career path"] || "",
  freshmanAdvice: entry["What would you have done differently as a freshman or sophomore to better prepare for your career?"] || "",
  skillsToFocus: entry["Skills to focus on"] || "",
  shortcuts: entry["Hacks and shortcuts"] || "",
  additionalAdvice: entry["Additional advice"] || "",
  majorFilter: entry["Major Filter"] || "",
  careerFilter: entry["Career Filter"] || "",
}));
