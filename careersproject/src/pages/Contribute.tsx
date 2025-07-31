import React from "react";
import ContributeForm from "../components/ContributeForm";

const Contribute: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Share Your Journey</h2>
      <ContributeForm />
    </div>
  );
};

export default Contribute;
