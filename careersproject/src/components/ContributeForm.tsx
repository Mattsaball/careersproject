import React, { useState } from "react";

const ContributeForm: React.FC = () => {
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [summerExperiences, setSummerExperiences] = useState<string[]>([]);
  const [clubs, setClubs] = useState("");
  const [resources, setResources] = useState("");
  const [missed, setMissed] = useState("");
  const [advice, setAdvice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      linkedin,
      graduationYear: gradYear,
      summers: summerExperiences,
      clubs,
      resources,
      missed,
      advice,
      anonymous,
    };

    try {
      console.log("Submitting payload:", payload);
      const res = await fetch("http://localhost:8081/api/journeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Submission successful!");
        // Optionally: clear form or redirect
      } else {
        alert("Submission failed. Try again.");
      }
    } catch (err) {
      console.error("Error submitting journey:", err);
      alert("Server error.");
    }
  };

  const handleGradYearChange = (year: string) => {
    setGradYear(year);

    const gradYearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
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

    const years = [];
    for (let y = endYear; y >= startYear; y--) {
      years.push(y);
    }

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
          />

          <label className="font-semibold">LinkedIn (optional)</label>
          <input
            className="border p-2 rounded"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
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
          />
        </div>
      ))}

      <label className="font-semibold">Helpful Clubs</label>
      <textarea
        className="border p-2 rounded w-full"
        value={clubs}
        onChange={(e) => setClubs(e.target.value)}
      />

      <label className="font-semibold">Helpful External Resources</label>
      <textarea
        className="border p-2 rounded w-full"
        value={resources}
        onChange={(e) => setResources(e.target.value)}
      />

      <label className="font-semibold">Biggest Missed Opportunities</label>
      <textarea
        className="border p-2 rounded w-full"
        value={missed}
        onChange={(e) => setMissed(e.target.value)}
      />

      <label className="font-semibold">Any Other Pieces of Advice?</label>
      <textarea
        className="border p-2 rounded w-full"
        value={advice}
        onChange={(e) => setAdvice(e.target.value)}
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default ContributeForm;
