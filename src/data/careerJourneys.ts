import { CareerJourney } from "@/types/career";
import reflectsData from "../../reflects.json";

// Load data from reflects.json, excluding entries that aren't approved
export const careerJourneys: CareerJourney[] = reflectsData
  .filter((entry: any) => entry["Include this response?"] === "yes")
  .map((entry: any, index: number) => ({
    id: (index + 1).toString(),
    major: entry["What is your Major(s) and Minor(s)?"] || "",
    postGradPlans: entry["Post Grad Plans"] || "",
    careerPath: entry["Previous experiences and career path"] || "",
    freshmanAdvice: entry["What would you have done differently as a freshman or sophomore to better prepare for your career?"] || "",
    skillsToFocus: entry["Skills to focus on"] || "",
    shortcuts: entry["Hacks and shortcuts"] || "",
    networkingStrategies: entry["Networking strategies"] || "",
    additionalAdvice: entry["Additional advice"] || "",
    year: entry["Year"] || "",
    majorFilter: entry["Major Filter"] || "",
    careerFilter: entry["Career Filter"] || ""
  }));