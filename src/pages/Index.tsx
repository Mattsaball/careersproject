import { useState, useMemo } from "react";
import { CareerCard } from "@/components/CareerCard";
import { CareerModal } from "@/components/CareerModal";
import { FilterSection } from "@/components/FilterSection";
import { careerJourneys } from "@/data/careerJourneys";
import { CareerJourney } from "@/types/career";
import { GraduationCap } from "lucide-react";

const Index = () => {
  const [selectedCareer, setSelectedCareer] = useState<CareerJourney | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedCareerTypes, setSelectedCareerTypes] = useState<string[]>([]);

  // Filter the career journeys based on selected filters
  const filteredCareers = useMemo(() => {
    if (selectedMajors.length === 0 && selectedCareerTypes.length === 0) {
      return careerJourneys;
    }

    return careerJourneys.filter((career) => {
      const majorMatch = selectedMajors.length > 0 && selectedMajors.some(selectedMajor => 
        career.majorFilter.split('||').map(f => f.trim()).includes(selectedMajor)
      );
      
      const careerMatch = selectedCareerTypes.length > 0 && selectedCareerTypes.some(selectedCareer => 
        career.careerFilter.split('||').map(f => f.trim()).includes(selectedCareer)
      );
      
      return majorMatch || careerMatch;
    });
  }, [selectedMajors, selectedCareerTypes]);

  const handleCardClick = (id: string) => {
    const career = filteredCareers.find((journey) => journey.id === id);
    if (career) {
      setSelectedCareer(career);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCareer(null);
  };

  const handleMajorToggle = (major: string) => {
    setSelectedMajors(prev => 
      prev.includes(major) 
        ? prev.filter(m => m !== major)
        : [...prev, major]
    );
  };

  const handleCareerTypeToggle = (careerType: string) => {
    setSelectedCareerTypes(prev => 
      prev.includes(careerType) 
        ? prev.filter(c => c !== careerType)
        : [...prev, careerType]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedMajors([]);
    setSelectedCareerTypes([]);
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

        <div className="max-w-7xl mx-auto">
          <FilterSection
            selectedMajors={selectedMajors}
            selectedCareerTypes={selectedCareerTypes}
            onMajorToggle={handleMajorToggle}
            onCareerTypeToggle={handleCareerTypeToggle}
            onClearAll={handleClearAllFilters}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                onClick={() => handleCardClick(career.id)}
              />
            ))}
          </div>

          {filteredCareers.length === 0 && (selectedMajors.length > 0 || selectedCareerTypes.length > 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No career journeys match your selected filters. Try adjusting your selection.</p>
            </div>
          )}
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
