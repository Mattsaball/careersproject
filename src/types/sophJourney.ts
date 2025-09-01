export interface SophJourney {
  id: string;
  major: string;
  majorType: string;
  minor?: string;
  majorFilter?: string;
  careerFilter?: string;
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