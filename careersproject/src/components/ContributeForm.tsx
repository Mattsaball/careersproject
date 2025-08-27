// src/components/ContributeForm.tsx (relevant parts)
import { useState } from "react";

const MAJOR_OPTIONS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Biomedical Engineering",
  "Applied Math",
  "Mathematics",
  "Physics",
  "Economics",
  "Political Science",
  "Art History",
  "English",
  // ...expand as needed
];

type JourneyPayload = {
  // new structured fields:
  majorFilters: string[];       // NEW
  careerFilter: string[];       // consider structuring this too

  // existing display fields:
  majorMinor: string;           // display-friendly (optional)
  postGradPlans: string;
  previousExperiences: string;
  freshmanSophomoreAdvice: string;
  skills: string;
  hacks: string;
  networking: string;
  additionalAdvice: string;

  year: string; // "Class of 2025"
};

export default function ContributeForm({ onSubmitSuccess }: { onSubmitSuccess: (j: any) => void }) {
  const [majorFilters, setMajorFilters] = useState<string[]>([]);
  const [majorMinor, setMajorMinor] = useState("");

  // ...other state

  const toggleMajor = (m: string) =>
    setMajorFilters(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: JourneyPayload = {
      majorFilters,
      careerFilter: [], // fill from your existing career inputs
      majorMinor,
      postGradPlans: "", // ...
      previousExperiences: "",
      freshmanSophomoreAdvice: "",
      skills: "",
      hacks: "",
      networking: "",
      additionalAdvice: "",
      year: "Class of 2025", // set properly from a dropdown
    };
    // await api.post("/api/journeys", payload)
    // onSubmitSuccess(newJourney)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display major/minor free text */}
      <div>
        <label className="block text-sm font-medium">Major(s) & Minor(s) (display)</label>
        <input
          value={majorMinor}
          onChange={e => setMajorMinor(e.target.value)}
          className="mt-1 w-full border rounded-md p-2"
          placeholder="e.g., Mechanical Engineering, English"
        />
      </div>

      {/* Major filters */}
      <div>
        <div className="block text-sm font-medium mb-2">Select your major(s) for filtering</div>
        <div className="flex flex-wrap gap-2">
          {MAJOR_OPTIONS.map(m => {
            const active = majorFilters.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMajor(m)}
                className={`px-3 py-1 rounded-full border ${active ? "bg-black text-white" : "bg-white"}`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <button type="submit" className="px-4 py-2 rounded-md bg-black text-white">
        Submit
      </button>
    </form>
  );
}
