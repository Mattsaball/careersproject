import { useState, useEffect } from "react";
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
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedCareerTypes, setSelectedCareerTypes] = useState<string[]>([]);

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
        ? prev.filter(ct => ct !== careerType) 
        : [...prev, careerType]
    );
  };

  const handleClearAll = () => {
    setSelectedMajors([]);
    setSelectedCareerTypes([]);
  };

  // Filter journeys based on selected filters
  const filteredJourneys = allJourneys.filter(journey => {
    // If no filters selected, show all
    if (selectedMajors.length === 0 && selectedCareerTypes.length === 0) {
      return true;
    }

    let matchesMajor = selectedMajors.length === 0;
    let matchesCareer = selectedCareerTypes.length === 0;

    // Check major filter - exact category matching
    if (selectedMajors.length > 0) {
      matchesMajor = selectedMajors.some(selectedMajor => {
        const journeyMajor = journey.major?.toLowerCase() || '';
        
        // Map filter categories to data patterns
        switch(selectedMajor) {
          case "Business & Finance":
            return journeyMajor.includes('business') || journeyMajor.includes('finance') || journeyMajor.includes('economics');
          case "Science & Health Sciences":
            return journeyMajor.includes('biology') || journeyMajor.includes('chemistry') || journeyMajor.includes('physics') || 
                   journeyMajor.includes('science') || journeyMajor.includes('health') || journeyMajor.includes('medical');
          case "Engineering & Math":
            return journeyMajor.includes('engineering') || journeyMajor.includes('math') || journeyMajor.includes('computer');
          case "Humanities":
            return journeyMajor.includes('english') || journeyMajor.includes('history') || journeyMajor.includes('philosophy') ||
                   journeyMajor.includes('literature') || journeyMajor.includes('humanities');
          case "Social Sciences":
            return journeyMajor.includes('psychology') || journeyMajor.includes('sociology') || journeyMajor.includes('political') ||
                   journeyMajor.includes('anthropology') || journeyMajor.includes('social');
          case "Arts & Media":
            return journeyMajor.includes('art') || journeyMajor.includes('media') || journeyMajor.includes('design') ||
                   journeyMajor.includes('music') || journeyMajor.includes('theater') || journeyMajor.includes('film');
          default:
            return false;
        }
      });
    }

    // Check career filter - exact category matching
    if (selectedCareerTypes.length > 0) {
      matchesCareer = selectedCareerTypes.some(selectedCareer => {
        const journeyCareer = journey.industry?.toLowerCase() || '';
        
        // Map filter categories to data patterns
        switch(selectedCareer) {
          case "Business / Finance":
            return journeyCareer.includes('business') || journeyCareer.includes('finance') || journeyCareer.includes('consulting');
          case "Engineering / Tech":
            return journeyCareer.includes('tech') || journeyCareer.includes('engineering') || journeyCareer.includes('software');
          case "Healthcare / Life Sciences":
            return journeyCareer.includes('health') || journeyCareer.includes('medical') || journeyCareer.includes('life sciences');
          case "Academia / Graduate School":
            return journeyCareer.includes('academia') || journeyCareer.includes('graduate') || journeyCareer.includes('research');
          case "Government / Policy / Legal":
            return journeyCareer.includes('government') || journeyCareer.includes('policy') || journeyCareer.includes('legal') || journeyCareer.includes('law');
          case "Media / Arts / Museums":
            return journeyCareer.includes('media') || journeyCareer.includes('arts') || journeyCareer.includes('museum');
          case "Education / Teaching":
            return journeyCareer.includes('education') || journeyCareer.includes('teaching') || journeyCareer.includes('school');
          case "Sustainability / Environment":
            return journeyCareer.includes('sustainability') || journeyCareer.includes('environment') || journeyCareer.includes('green');
          default:
            return false;
        }
      });
    }

    return matchesMajor && matchesCareer;
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/journeys")
      .then((res) => res.json())
      .then((data) => {
        const backendJourneys = data.map((journey: any, index: number) => ({
          id: `backend-${journey.id || index}`,
          postGradPlans: journey.advice || "No post-grad plans shared yet",
          graduationYear: journey.graduationYear || "N/A",
          name: journey.anonymous ? "Anonymous" : journey.name || "Unnamed",
          linkedin: journey.anonymous ? "" : journey.linkedin || "",
          summers: journey.summers || [],
          clubs: journey.clubs || "N/A",
          resources: journey.resources || "N/A",
          missed: journey.missed || "N/A",
          advice: journey.advice || "N/A",
          anonymous: journey.anonymous ?? true,
        }));

        const staticNormalized = staticJourneys.map((journey) => ({
          ...journey,
          id: `static-${journey.id}`, // prefix static ids
        }));

        setAllJourneys([...staticNormalized, ...backendJourneys]);
      })
      .catch((err) => {
        console.error("Failed to fetch backend journeys:", err);
        const staticNormalized = staticJourneys.map((journey) => ({
          ...journey,
          id: `static-${journey.id}`,
        }));
        setAllJourneys(staticNormalized);
      });
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

        <div className="max-w-7xl mx-auto">
          <FilterSection
            selectedMajors={selectedMajors}
            selectedCareerTypes={selectedCareerTypes}
            onMajorToggle={handleMajorToggle}
            onCareerTypeToggle={handleCareerTypeToggle}
            onClearAll={handleClearAll}
          />
        </div>

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
