import { SophJourney } from "@/types/sophJourney";
import sophData from "../../soph cleaned .json";

export const sophJourneys: SophJourney[] = (sophData as any[]).map((entry, index) => ({
  id: `soph-${index + 1}`,
  major: entry["What is your major(s)?\n(Separate with commas if more than one)"] || "",
  majorType: entry["Major Type "] || "",
  majorFilter: entry["major filter"] || "",
  careerFilter: entry["career filter"] || "",
  minor: entry["What is your minor(s)?\n(Leave blank if none)"] || "",
  sophSummerJob: entry["What are you doing professionally this summer?\n(e.g., Business Analyst at Capital One)"] || "",
  sophSummerCareerType: entry["Career type soph summer"] || "",
  sophSummerHowGot: entry["How did you get this experience?\nWhen did you apply? Was it part of a program, a referral, or something else? Did you interview? We'd love to hear the whole story."] || "",
  freshmanSummerJob: entry["What did you do professionally last summer (going into sophomore year)?\n(e.g., Research Assistant at Columbia SIPA)"] || "",
  freshmanSummerCareerType: entry["Career Type Fresh summer "] || "",
  freshmanSummerHowGot: entry["How did you get that experience?\nWhen did you apply? Was it part of a program, a referral, or something else? Did you interview? We'd love to hear the whole story."] || "",
  networkingStrategies: entry["What specific networking strategies have actually worked for you?\nCold emailing? Coffee chats? LinkedIn? Tell us what got real results.  "] || "",
  advice: entry["If you could talk to your freshman or sophomore self, what would you tell them to focus on to get to where you are now (or where you're headed)? "] || "",
  hacks: entry["What hacks or shortcuts helped you accelerate your professional progress?\nThis could be tools, habits, resources, mindsets, anything that helped you level up faster"] || "",
  graduationYear: "2027"
}));