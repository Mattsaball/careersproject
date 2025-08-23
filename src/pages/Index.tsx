import { useState, useEffect, useMemo } from "react";
import { CareerCard } from "@/components/CareerCard";
import { CareerModal } from "@/components/CareerModal";
import { UserJourneyModal } from "@/components/UserJourneyModal";
import { FilterSection } from "@/components/FilterSection";
import { careerJourneys as staticJourneys } from "@/data/careerJourneys";
import { CareerJourney } from "@/types/career";
import { GraduationCap } from "lucide-react";

const Index = () => {
  const [allJourneys, setAllJourneys] = useState<CareerJourney[]>([]);
  const [selectedStaticCareer, setSelectedStaticCareer] =
    useState<CareerJourney | null>(null);
  const [selectedUserJourney, setSelectedUserJourney] =
    useState<CareerJourney | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedCareerTypes, setSelectedCareerTypes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  useEffect(() => {
    // Load static journeys from reflects.json via the careerJourneys import
    const staticNormalized = staticJourneys.map((journey) => ({
      ...journey,
      id: `static-${journey.id}`, // prefix static ids
    }));

    setAllJourneys(staticNormalized);
  }, []);

  const handleCardClick = (id: string) => {
    const journey = allJourneys.find((j) => j.id === id);
    if (!journey) return;

    if (id.startsWith("static-")) {
      setSelectedStaticCareer(journey);
    } else {
      setSelectedUserJourney(journey);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStaticCareer(null);
    setSelectedUserJourney(null);
    setIsModalOpen(false);
  };

  // Major category mapping - now using the Major Filter field from data
  const getMajorCategory = (journey: CareerJourney): string[] => {
    // Use the majorFilter field if available (from reflects.json)
    const majorFilter = journey.majorFilter || '';
    if (majorFilter) {
      return majorFilter.split('||').map((cat: string) => cat.trim());
    }
    
    // Fallback to mapping from the actual major text if majorFilter is not available
    const majorLower = journey.major.toLowerCase();
    const categories = [];
    if (majorLower.includes('business') || majorLower.includes('finance') || majorLower.includes('economics') || majorLower.includes('accounting')) {
      categories.push('Business & Finance');
    }
    if (majorLower.includes('biology') || majorLower.includes('chemistry') || majorLower.includes('physics') || majorLower.includes('medicine') || majorLower.includes('health') || majorLower.includes('science')) {
      categories.push('Science & Health Sciences');
    }
    if (majorLower.includes('engineering') || majorLower.includes('computer') || majorLower.includes('math') || majorLower.includes('technology')) {
      categories.push('Engineering & Math');
    }
    if (majorLower.includes('history') || majorLower.includes('literature') || majorLower.includes('philosophy') || majorLower.includes('language') || majorLower.includes('humanities')) {
      categories.push('Humanities');
    }
    if (majorLower.includes('psychology') || majorLower.includes('sociology') || majorLower.includes('anthropology') || majorLower.includes('political') || majorLower.includes('social')) {
      categories.push('Social Sciences');
    }
    if (majorLower.includes('art') || majorLower.includes('music') || majorLower.includes('theater') || majorLower.includes('media') || majorLower.includes('design')) {
      categories.push('Arts & Media');
    }
    return categories.length > 0 ? categories : ['Other'];
  };

  // Career type mapping
  const getCareerTypeCategory = (careerType: string): string => {
    const careerLower = careerType.toLowerCase();
    if (careerLower.includes('business') || careerLower.includes('finance') || careerLower.includes('banking') || careerLower.includes('consulting')) {
      return 'Business / Finance';
    }
    if (careerLower.includes('engineering') || careerLower.includes('tech') || careerLower.includes('software') || careerLower.includes('computer')) {
      return 'Engineering / Tech';
    }
    if (careerLower.includes('healthcare') || careerLower.includes('medical') || careerLower.includes('life sciences') || careerLower.includes('biology')) {
      return 'Healthcare / Life Sciences';
    }
    if (careerLower.includes('academia') || careerLower.includes('graduate') || careerLower.includes('research') || careerLower.includes('phd')) {
      return 'Academia / Graduate School';
    }
    if (careerLower.includes('government') || careerLower.includes('policy') || careerLower.includes('legal') || careerLower.includes('law')) {
      return 'Government / Policy / Legal';
    }
    if (careerLower.includes('media') || careerLower.includes('arts') || careerLower.includes('museum') || careerLower.includes('creative')) {
      return 'Media / Arts / Museums';
    }
    if (careerLower.includes('education') || careerLower.includes('teaching') || careerLower.includes('teacher')) {
      return 'Education / Teaching';
    }
    if (careerLower.includes('sustainability') || careerLower.includes('environment') || careerLower.includes('climate')) {
      return 'Sustainability / Environment';
    }
    return 'Other';
  };

  // Filter functions
  const toggleMajor = (major: string) => {
    setSelectedMajors(prev => 
      prev.includes(major) 
        ? prev.filter(m => m !== major)
        : [...prev, major]
    );
  };

  const toggleCareerType = (careerType: string) => {
    setSelectedCareerTypes(prev => 
      prev.includes(careerType) 
        ? prev.filter(c => c !== careerType)
        : [...prev, careerType]
    );
  };

  const clearAllFilters = () => {
    setSelectedMajors([]);
    setSelectedCareerTypes([]);
    setSelectedYears([]);
  };

  // Filtered journeys using OR logic between major and career type
  const filteredJourneys = useMemo(() => {
    if (selectedMajors.length === 0 && selectedCareerTypes.length === 0 && selectedYears.length === 0) {
      return allJourneys;
    }

    return allJourneys.filter(journey => {
      const majorCategories = getMajorCategory(journey);
      const majorMatch = selectedMajors.length === 0 || selectedMajors.some(selectedMajor => 
        majorCategories.includes(selectedMajor)
      );
      
      const careerMatch = selectedCareerTypes.length === 0 || selectedCareerTypes.includes(getCareerTypeCategory(journey.industry || ''));
      const yearMatch = selectedYears.length === 0 || selectedYears.includes(journey.graduationYear || '');

      // OR logic between major and career type, AND with year
      const majorOrCareerMatch = (selectedMajors.length === 0 && selectedCareerTypes.length === 0) || majorMatch || careerMatch;
      
      return majorOrCareerMatch && yearMatch;
    });
  }, [allJourneys, selectedMajors, selectedCareerTypes, selectedYears]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Career Journey Reflections
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore inspiring career paths and learn from real experiences
            across different industries and fields.
          </p>
        </div>

        <FilterSection
          selectedMajors={selectedMajors}
          selectedCareerTypes={selectedCareerTypes}
          onMajorToggle={toggleMajor}
          onCareerTypeToggle={toggleCareerType}
          onClearAll={clearAllFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredJourneys.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              onClick={() => handleCardClick(career.id)}
            />
          ))}
        </div>
      </div>

      {selectedStaticCareer && (
        <CareerModal
          career={selectedStaticCareer}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {selectedUserJourney && (
        <UserJourneyModal
          journey={selectedUserJourney}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Index;
