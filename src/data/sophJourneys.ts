import { SophJourney } from "@/types/sophJourney";
import { studentCards } from "../../populate_cards";

// Convert StudentCard instances to SophJourney format
export const sophJourneys: SophJourney[] = studentCards.map((studentCard, index) => ({
  id: `soph-${index + 1}`,
  major: studentCard.major || "",
  majorType: studentCard.major_filter || "",
  minor: "", // Not available in StudentCard, keeping empty
  majorFilter: studentCard.major_filter || "",
  careerFilter: studentCard.career_filter || "",
  sophSummerJob: studentCard.soph_summer || "",
  sophSummerCareerType: studentCard.soph_career_type || "",
  sophSummerHowGot: studentCard.soph_how_got || "",
  freshmanSummerJob: studentCard.fresh_summer || "",
  freshmanSummerCareerType: studentCard.fresh_career_type || "",
  freshmanSummerHowGot: studentCard.fresh_how_got || "",
  networkingStrategies: studentCard.networking_strats || "",
  advice: studentCard.advice || "",
  hacks: studentCard.hacks || "",
  graduationYear: "2027"
}));