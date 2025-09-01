import { CareerJourney } from "@/types/career";
import { alumniCards } from "../../populate_cards";

console.log("Alumni cards loaded:", alumniCards.length);
console.log("First alumni card:", alumniCards[0]);

// Convert AlumniCard instances to CareerJourney format
export const careerJourneys: CareerJourney[] = alumniCards.map((alumniCard, index) => ({
  id: (index + 1).toString(),
  company: (() => {
    const pg = alumniCard.post_grad_plans || "";
    if (typeof pg === "string") {
      const afterColon = pg.split(":")[1]?.trim();
      return afterColon || "";
    }
    return "";
  })(),
  industry: alumniCard.career_filter || "",
  majorFilter: alumniCard.major_filter || "",
  careerFilter: alumniCard.career_filter || "",
  graduationYear: `fulltime • Class of ${alumniCard.grad_year}`,
  major: alumniCard.major || "",
  postGradPlans: alumniCard.post_grad_plans || "",
  careerPath: alumniCard.prev_experience || "",
  freshmanAdvice: alumniCard.advice || "",
  skillsToFocus: alumniCard.skills_to_focus_on || "",
  shortcuts: alumniCard.hacks || "",
  additionalAdvice: alumniCard.additional_advice || "",
  networkingStrategies: alumniCard.networking_strats || "",
  prevExperience: alumniCard.prev_experience || ""
}));
