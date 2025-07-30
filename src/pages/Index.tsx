import { useState } from "react";
import { CareerCard } from "@/components/CareerCard";
import { CareerModal } from "@/components/CareerModal";
import { careerJourneys } from "@/data/careerJourneys";
import { CareerJourney } from "@/types/career";
import { GraduationCap } from "lucide-react";

const Index = () => {
  const [selectedCareer, setSelectedCareer] = useState<CareerJourney | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (id: string) => {
    const career = careerJourneys.find((journey) => journey.id === id);
    if (career) {
      setSelectedCareer(career);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCareer(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Career Journey Reflections</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore inspiring career paths and learn from real experiences across different industries and fields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {careerJourneys.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              onClick={() => handleCardClick(career.id)}
            />
          ))}
        </div>
      </div>

      <CareerModal
        career={selectedCareer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
