export interface SophJourney {
  id: string;
  major: string;
  majorType: string;
  majorFilter?: string;
  careerFilter?: string;
  minor?: string;
  sophSummerJob: string;
  sophSummerCareerType: string;
  sophSummerHowGot: string;
  freshmanSummerJob: string;
  freshmanSummerCareerType: string;
  freshmanSummerHowGot: string;
  networkingStrategies: string;
  advice: string;
  hacks: string;
  graduationYear: "2027"; // All sophs graduate in 2027
}