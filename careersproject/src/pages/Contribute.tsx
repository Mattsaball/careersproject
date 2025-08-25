// src/pages/Contribute.tsx
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ContributeForm from "../components/ContributeForm";

const Contribute: React.FC = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const handleSuccess = (newJourney: any) => {
    // Optimistically prepend the new journey to the cached list (if it exists)
    qc.setQueryData<any[]>(["journeys"], (old) => {
      if (!old) return [newJourney];
      return [newJourney, ...old];
    });

    // Also trigger a refetch to stay in sync with the server
    qc.invalidateQueries({ queryKey: ["journeys"], exact: true });

    // Go back to the home feed
    navigate("/");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Share Your Journey</h2>
      <ContributeForm onSubmitSuccess={handleSuccess} />
    </div>
  );
};

export default Contribute;
