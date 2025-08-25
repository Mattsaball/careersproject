// src/components/ContributeForm.tsx
import React, { useState } from "react";
import { api } from "@/api/api";

interface ContributeFormProps {
  onSubmitSuccess: (newJourney: any) => void;
}

interface JourneyPayload {
  name: string;
  linkedin: string;
  graduationYear: number | null;
  summers: string[];
  clubs: string;
  resources: string;
  missed: string;
  advice: string;
  anonymous: boolean;
}

const ContributeForm: React.FC<ContributeFormProps> = ({ onSubmitSuccess }) => {
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [summerExperiences, setSummerExperiences] = useState<string[]>([]);
  const [clubs, setClubs] = useState("");
  const [resources, setResources] = useState("");
  const [missed, setMissed] = useState("");
  const [advice, setAdvice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const payload: JourneyPayload = {
      name: anonymous ? "" : name.trim(),
      linkedin: anonymous ? "" : linkedin.trim(),
      graduationYear: gradYear ? Number(gradYear) : null, // <-- ensure number
      summers: summerExperiences,
      clubs: clubs.trim(),
      resources: resources.trim(),
      missed: missed.trim(),
      advice: advice.trim(),
      anonymous,
    };

    try {
      setSubmitting(true);
      // Uses the shared axios client (adds Authorization header automatically)
      const { data: savedJourney } = await api.post("/api/journeys", payload);
      onSubmitSuccess(savedJourney);
      alert("Submission successful!");

      // Reset form
      setName("");
      setLinkedin("");
      setGradYear("");
      setSummerExperiences([]);
      setClubs("");
      setResources("");
      setMissed("");
      setAdvice("");
      setAnonymous(true);
    } catch (err) {
      console.error("Error submitting journey:", err);
      alert("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGradYearChange = (year: string) => {
    setGradYear(year);

    const gradYearNum = parseInt(year);
    if (Number.isNaN(gradYearNum)) {
      setSummerExperiences([]);
      return;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 = Jan
    const adjustedYear = currentMonth < 5 ? currentYear - 1 : currentYear;

    const academicYearsLeft = gradYearNum - adjustedYear;
    const summers = Math.max(0, Math.min(3, 3 - academicYearsLeft));
    setSummerExperiences(Array(summers).fill(""));
  };

  const generateValidGradYears = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const effectiveYear = currentMonth < 5 ? currentYear - 1 : currentYear;

    const startYear = 2000;
    const endYear = effectiveYear + 2;

    const years: number[] = [];
    for (let y = endYear; y >= startYear; y--) years.push(y);
    return years;
  };

  const handleSummerChange = (index: number, value: string) => {
    const updated = [...summerExperiences];
    updated[index] = value;
    setSummerExperiences(updated);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 max-w-2xl mx-auto"
    >
      <label className="font-semibold">Do you want to stay anonymous?</label>
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            anonymous ? "bg-blue-600 text-white" : "border"
          }`}
          onClick={() => setAnonymous(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            !anonymous ? "bg-blue-600 text-white" : "border"
          }`}
          onClick={() => setAnonymous(false)}
        >
          No
        </button>
      </div>

      {!anonymous && (
        <>
          <label className="font-semibold">Name</label>
          <input
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />

          <label className="font-semibold">LinkedIn (optional)</label>
          <input
            className="border p-2 rounded"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://www.linkedin.com/in/username"
          />
        </>
      )}

      <label className="font-semibold">Graduation Year</label>
      <select
        className="border p-2 rounded"
        value={gradYear}
        onChange={(e) => handleGradYearChange(e.target.value)}
      >
        <option value="">Select your graduation year</option>
        {generateValidGradYears().map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {summerExperiences.map((exp, idx) => (
        <div key={idx}>
          <label className="font-semibold">
            {["First", "Second", "Third"][idx]} Year Summer
          </label>
          <textarea
            className="border p-2 rounded w-full"
            value={exp}
            onChange={(e) => handleSummerChange(idx, e.target.value)}
            placeholder="What did you do this summer?"
          />
        </div>
      ))}

      <label className="font-semibold">Helpful Clubs</label>
      <textarea
        className="border p-2 rounded w-full"
        value={clubs}
        onChange={(e) => setClubs(e.target.value)}
        placeholder="Clubs that helped you (e.g., CSI, SWE, etc.)"
      />

      <label className="font-semibold">Helpful External Resources</label>
      <textarea
        className="border p-2 rounded w-full"
        value={resources}
        onChange={(e) => setResources(e.target.value)}
        placeholder="Courses, websites, books, mentors…"
      />

      <label className="font-semibold">Biggest Missed Opportunities</label>
      <textarea
        className="border p-2 rounded w-full"
        value={missed}
        onChange={(e) => setMissed(e.target.value)}
        placeholder="What would you do differently?"
      />

      <label className="font-semibold">Any Other Pieces of Advice?</label>
      <textarea
        className="border p-2 rounded w-full"
        value={advice}
        onChange={(e) => setAdvice(e.target.value)}
        placeholder="Anything else future students should know?"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
};

export default ContributeForm;
