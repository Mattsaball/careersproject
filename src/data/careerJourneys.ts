import { CareerJourney } from "@/types/career";
import journeysData from "../../journeys(old).json";

// Dynamically load all entries from JSON and add IDs
export const careerJourneys: CareerJourney[] = journeysData.map((journey, index) => ({
  id: (index + 1).toString(),
  company: journey.company || "",
  industry: journey.industry || "",
  graduationYear: journey.graduationYear || "",
  major: journey.major || "",
  postGradPlans: journey.postGradPlans || "",
  careerPath: journey.careerPath || "",
  freshmanAdvice: journey.freshmanAdvice || "",
  skillsToFocus: journey.skillsToFocus || "",
  shortcuts: journey.shortcuts || "",
  additionalAdvice: journey.additionalAdvice || ""
}));