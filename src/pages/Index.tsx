import { useState, useEffect, useMemo } from "react";
import { CareerCard } from "@/components/CareerCard";
import { CareerModal } from "@/components/CareerModal";
import { UserJourneyModal } from "@/components/UserJourneyModal";
import { SophJourneyCard } from "@/components/SophJourneyCard";
import { SophJourneyModal } from "@/components/SophJourneyModal";
import { FilterSection } from "@/components/FilterSection";
import { alumniCards, studentCards } from "../../populate_cards";
import { CareerJourney } from "@/types/career";
import { SophJourney } from "@/types/sophJourney";
import { GraduationCap } from "lucide-react";

// Convert AlumniCard instances to CareerJourney format
const staticJourneys: CareerJourney[] = alumniCards.map((alumniCard, index) => {
  const journey = {
    id: (index + 1).toString(),
    company: (() => {
      const pg = alumniCard.post_grad_plans || "";
      if (typeof pg === "string") {
        const afterColon = pg.split(":")[1]?.trim();
        return afterColon || "";
      }
      return "";
    })(),
    industry: alumniCard.career_filter || "",
    majorFilter: alumniCard.major_filter || "",
    careerFilter: alumniCard.career_filter || "",
    graduationYear: `fulltime • Class of ${alumniCard.grad_year}`,
    major: alumniCard.major || "",
    postGradPlans: alumniCard.post_grad_plans || "",
    careerPath: alumniCard.prev_experience || "",
    freshmanAdvice: alumniCard.advice || "",
    skillsToFocus: alumniCard.skills_to_focus_on || "",
    shortcuts: alumniCard.hacks || "",
    additionalAdvice: alumniCard.additional_advice || "",
    networkingStrategies: alumniCard.networking_strats || "",
    prevExperience: alumniCard.prev_experience || ""
  };
  
  // Debug the first few journeys
  if (index < 3) {
    console.log(`Journey ${index + 1}:`, {
      postGradPlans: journey.postGradPlans,
      major: journey.major,
      networkingStrategies: journey.networkingStrategies,
      freshmanAdvice: journey.freshmanAdvice,
      skillsToFocus: journey.skillsToFocus,
      shortcuts: journey.shortcuts,
      additionalAdvice: journey.additionalAdvice,
      prevExperience: journey.prevExperience
    });
    console.log(`Alumni card ${index + 1} raw data:`, {
      post_grad_plans: alumniCard.post_grad_plans,
      major: alumniCard.major,
      networking_strats: alumniCard.networking_strats,
      advice: alumniCard.advice,
      skills_to_focus_on: alumniCard.skills_to_focus_on,
      hacks: alumniCard.hacks,
      additional_advice: alumniCard.additional_advice,
      prev_experience: alumniCard.prev_experience
    });
  }
  
  return journey;
});

// Convert StudentCard instances to SophJourney format
const sophJourneys: SophJourney[] = studentCards.map((studentCard, index) => ({
  id: `soph-${index + 1}`,
  major: studentCard.major || "",
  majorType: studentCard.major_filter || "",
  minor: "", // Not available in StudentCard, keeping empty
  majorFilter: studentCard.major_filter || "",
  careerFilter: studentCard.career_filter || "",
  sophSummerJob: studentCard.soph_summer || "",
  sophSummerCareerType: studentCard.soph_career_type || "",
  sophSummerHowGot: studentCard.soph_how_got || "",
  freshmanSummerJob: studentCard.fresh_summer || "",
  freshmanSummerCareerType: studentCard.fresh_career_type || "",
  freshmanSummerHowGot: studentCard.fresh_how_got || "",
  networkingStrategies: studentCard.networking_strats || "",
  advice: studentCard.advice || "",
  hacks: studentCard.hacks || "",
  graduationYear: "2027"
}));

const Index = () => {
  const [allJourneys, setAllJourneys] = useState<CareerJourney[]>([]);
  const [selectedStaticCareer, setSelectedStaticCareer] =
    useState<CareerJourney | null>(null);
  const [selectedUserJourney, setSelectedUserJourney] =
    useState<CareerJourney | null>(null);
  const [selectedSophJourney, setSelectedSophJourney] = useState<SophJourney | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSophModalOpen, setIsSophModalOpen] = useState(false);
  
  // Filter states
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedCareerTypes, setSelectedCareerTypes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  
  // Journey type toggle state
  const [showAlumni, setShowAlumni] = useState(false);

  useEffect(() => {
    // Load static journeys immediately to avoid latency
    const staticNormalized = staticJourneys.map((journey) => ({
      ...journey,
      id: `static-${journey.id}`,
    }));
    setAllJourneys(staticNormalized);

    // Try to fetch backend journeys with a timeout
    const fetchWithTimeout = (url: string, timeout = 5000) => {
      return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);
    };

    fetchWithTimeout("http://localhost:8080/api/journeys")
      .then((res: any) => res.json())
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

        // Append backend journeys to existing static ones
        setAllJourneys(prev => [...prev, ...backendJourneys]);
      })
      .catch((err) => {
        console.log("Backend journeys not available, using static data only");
        // Static data is already loaded, no need to do anything
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

  const handleSophJourneyClick = (id: string) => {
    const journey = sophJourneys.find(j => j.id === id);
    if (journey) {
      setSelectedSophJourney(journey);
      setIsSophModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedStaticCareer(null);
    setSelectedUserJourney(null);
    setSelectedSophJourney(null);
    setIsModalOpen(false);
    setIsSophModalOpen(false);
  };

  // Major category mapping
  const getMajorCategory = (major: string): string => {
    const majorLower = major.toLowerCase();
    if (majorLower.includes('business') || majorLower.includes('finance') || majorLower.includes('economics') || majorLower.includes('accounting')) {
      return 'Business & Finance';
    }
    if (majorLower.includes('biology') || majorLower.includes('chemistry') || majorLower.includes('physics') || majorLower.includes('medicine') || majorLower.includes('health') || majorLower.includes('science')) {
      return 'Science & Health Sciences';
    }
    if (majorLower.includes('engineering') || majorLower.includes('computer') || majorLower.includes('math') || majorLower.includes('technology')) {
      return 'Engineering & Math';
    }
    if (majorLower.includes('history') || majorLower.includes('literature') || majorLower.includes('philosophy') || majorLower.includes('language') || majorLower.includes('humanities')) {
      return 'Humanities';
    }
    if (majorLower.includes('psychology') || majorLower.includes('sociology') || majorLower.includes('anthropology') || majorLower.includes('political') || majorLower.includes('social')) {
      return 'Social Sciences';
    }
    if (majorLower.includes('art') || majorLower.includes('music') || majorLower.includes('theater') || majorLower.includes('media') || majorLower.includes('design')) {
      return 'Arts & Media';
    }
    return 'Other';
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

  // Helper function to check if major filter matches
  const majorFilterMatches = (journey: CareerJourney, selectedMajors: string[]): boolean => {
    if (selectedMajors.length === 0) return true;
    
    const majorFilter = journey.majorFilter || '';
    
    // Check if the journey's major filter contains any of the selected major categories
    return selectedMajors.some(selectedMajor => {
      // Direct match
      if (majorFilter === selectedMajor) return true;
      
      // Category-based matching
      const majorLower = majorFilter.toLowerCase();
      switch (selectedMajor) {
        case 'Business & Finance':
          return majorLower.includes('business') || majorLower.includes('finance') || 
                 majorLower.includes('economics') || majorLower.includes('accounting');
        case 'Science & Health Sciences':
          return majorLower.includes('biology') || majorLower.includes('chemistry') || 
                 majorLower.includes('physics') || majorLower.includes('medicine') || 
                 majorLower.includes('health') || majorLower.includes('science');
        case 'Engineering & Math':
          return majorLower.includes('engineering') || majorLower.includes('computer') || 
                 majorLower.includes('math') || majorLower.includes('technology');
        case 'Humanities':
          return majorLower.includes('history') || majorLower.includes('literature') || 
                 majorLower.includes('philosophy') || majorLower.includes('language') || 
                 majorLower.includes('humanities');
        case 'Social Sciences':
          return majorLower.includes('psychology') || majorLower.includes('sociology') || 
                 majorLower.includes('anthropology') || majorLower.includes('political') || 
                 majorLower.includes('social');
        case 'Arts & Media':
          return majorLower.includes('art') || majorLower.includes('music') || 
                 majorLower.includes('theater') || majorLower.includes('media') || 
                 majorLower.includes('design');
        default:
          return false;
      }
    });
  };

  // Helper function to check if career filter matches
  const careerFilterMatches = (journey: CareerJourney, selectedCareerTypes: string[]): boolean => {
    if (selectedCareerTypes.length === 0) return true;
    
    const careerFilter = journey.careerFilter || '';
    
    // Check if the journey's career filter contains any of the selected career categories
    return selectedCareerTypes.some(selectedCareer => {
      // Direct match
      if (careerFilter === selectedCareer) return true;
      
      // Category-based matching
      const careerLower = careerFilter.toLowerCase();
      switch (selectedCareer) {
        case 'Business / Finance':
          return careerLower.includes('business') || careerLower.includes('finance') || 
                 careerLower.includes('banking') || careerLower.includes('consulting');
        case 'Engineering / Tech':
          return careerLower.includes('engineering') || careerLower.includes('tech') || 
                 careerLower.includes('software') || careerLower.includes('computer');
        case 'Healthcare / Life Sciences':
          return careerLower.includes('healthcare') || careerLower.includes('medical') || 
                 careerLower.includes('life sciences') || careerLower.includes('biology');
        case 'Academia / Graduate School':
          return careerLower.includes('academia') || careerLower.includes('graduate') || 
                 careerLower.includes('research') || careerLower.includes('phd');
        case 'Government / Policy / Legal':
          return careerLower.includes('government') || careerLower.includes('policy') || 
                 careerLower.includes('legal') || careerLower.includes('law');
        case 'Media / Arts / Museums':
          return careerLower.includes('media') || careerLower.includes('arts') || 
                 careerLower.includes('museum') || careerLower.includes('creative');
        case 'Education / Teaching':
          return careerLower.includes('education') || careerLower.includes('teaching') || 
                 careerLower.includes('teacher');
        case 'Sustainability / Environment':
          return careerLower.includes('sustainability') || careerLower.includes('environment') || 
                 careerLower.includes('climate');
        default:
          return false;
      }
    });
  };

  // Helper function to check if soph journey matches filters
  const sophJourneyMatches = (journey: SophJourney): boolean => {
    if (selectedMajors.length === 0 && selectedCareerTypes.length === 0) return true;
    
    let majorMatch = false;
    let careerMatch = false;
    
    // Check major filter
    if (selectedMajors.length > 0) {
      const majorFilter = journey.majorFilter || '';
      majorMatch = selectedMajors.some(selectedMajor => {
        if (majorFilter === selectedMajor) return true;
        
        const majorLower = majorFilter.toLowerCase();
        switch (selectedMajor) {
          case 'Business & Finance':
            return majorLower.includes('business') || majorLower.includes('finance') || 
                   majorLower.includes('economics') || majorLower.includes('accounting');
          case 'Science & Health Sciences':
            return majorLower.includes('biology') || majorLower.includes('chemistry') || 
                   majorLower.includes('physics') || majorLower.includes('medicine') || 
                   majorLower.includes('health') || majorLower.includes('science');
          case 'Engineering & Math':
            return majorLower.includes('engineering') || majorLower.includes('computer') || 
                   majorLower.includes('math') || majorLower.includes('technology');
          case 'Humanities':
            return majorLower.includes('history') || majorLower.includes('literature') || 
                   majorLower.includes('philosophy') || majorLower.includes('language') || 
                   majorLower.includes('humanities');
          case 'Social Sciences':
            return majorLower.includes('psychology') || majorLower.includes('sociology') || 
                   majorLower.includes('anthropology') || majorLower.includes('political') || 
                   majorLower.includes('social');
          case 'Arts & Media':
            return majorLower.includes('art') || majorLower.includes('music') || 
                   majorLower.includes('theater') || majorLower.includes('media') || 
                   majorLower.includes('design');
          default:
            return false;
        }
      });
    }
    
    // Check career filter
    if (selectedCareerTypes.length > 0) {
      const careerFilter = journey.careerFilter || '';
      careerMatch = selectedCareerTypes.some(selectedCareer => {
        if (careerFilter === selectedCareer) return true;
        
        const careerLower = careerFilter.toLowerCase();
        switch (selectedCareer) {
          case 'Business / Finance':
            return careerLower.includes('business') || careerLower.includes('finance') || 
                   careerLower.includes('banking') || careerLower.includes('consulting');
          case 'Engineering / Tech':
            return careerLower.includes('engineering') || careerLower.includes('tech') || 
                   careerLower.includes('software') || careerLower.includes('computer');
          case 'Healthcare / Life Sciences':
            return careerLower.includes('healthcare') || careerLower.includes('medical') || 
                   careerLower.includes('life sciences') || careerLower.includes('biology');
          case 'Academia / Graduate School':
            return careerLower.includes('academia') || careerLower.includes('graduate') || 
                   careerLower.includes('research') || careerLower.includes('phd');
          case 'Government / Policy / Legal':
            return careerLower.includes('government') || careerLower.includes('policy') || 
                   careerLower.includes('legal') || careerLower.includes('law');
          case 'Media / Arts / Museums':
            return careerLower.includes('media') || careerLower.includes('arts') || 
                   careerLower.includes('museum') || careerLower.includes('creative');
          case 'Education / Teaching':
            return careerLower.includes('education') || careerLower.includes('teaching') || 
                   careerLower.includes('teacher');
          case 'Sustainability / Environment':
            return careerLower.includes('sustainability') || careerLower.includes('environment') || 
                   careerLower.includes('climate');
          default:
            return false;
        }
      });
    }
    
    // Use OR logic: if either major or career filters are selected and match, include the journey
    if (selectedMajors.length > 0 && selectedCareerTypes.length > 0) {
      return majorMatch || careerMatch;
    } else if (selectedMajors.length > 0) {
      return majorMatch;
    } else if (selectedCareerTypes.length > 0) {
      return careerMatch;
    }
    
    return true;
  };

  // Filtered journeys using OR logic
  const filteredJourneys = useMemo(() => {
    if (selectedMajors.length === 0 && selectedCareerTypes.length === 0 && selectedYears.length === 0) {
      return allJourneys;
    }

    return allJourneys.filter(journey => {
      const majorMatch = majorFilterMatches(journey, selectedMajors);
      const careerMatch = careerFilterMatches(journey, selectedCareerTypes);
      const yearMatch = selectedYears.length === 0 || selectedYears.includes(journey.graduationYear || '');

      // Use OR logic for major and career filters, AND for year filter
      if (selectedMajors.length > 0 && selectedCareerTypes.length > 0) {
        return (majorMatch || careerMatch) && yearMatch;
      } else if (selectedMajors.length > 0) {
        return majorMatch && yearMatch;
      } else if (selectedCareerTypes.length > 0) {
        return careerMatch && yearMatch;
      }
      
      return yearMatch;
    });
  }, [allJourneys, selectedMajors, selectedCareerTypes, selectedYears]);

  // Filtered sophomore journeys
  const filteredSophJourneys = useMemo(() => {
    return sophJourneys.filter(sophJourneyMatches);
  }, [sophJourneys, selectedMajors, selectedCareerTypes]);

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

        {/* Journey Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-card border rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setShowAlumni(false)}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                !showAlumni
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Current Student Journeys
            </button>
            <button
              onClick={() => setShowAlumni(true)}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                showAlumni
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Alumni Journeys
            </button>
          </div>
        </div>

        <FilterSection
          selectedMajors={selectedMajors}
          selectedCareerTypes={selectedCareerTypes}
          onMajorToggle={toggleMajor}
          onCareerTypeToggle={toggleCareerType}
          onClearAll={clearAllFilters}
        />

        {/* Conditional Journey Sections */}
        {showAlumni ? (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Alumni Career Journeys</h3>
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
        ) : (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Current Student Journeys (Class of 2027)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredSophJourneys.map((journey) => (
                <SophJourneyCard
                  key={journey.id}
                  journey={journey}
                  onClick={() => handleSophJourneyClick(journey.id)}
                />
              ))}
            </div>
          </div>
        )}
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

      <SophJourneyModal
        journey={selectedSophJourney}
        isOpen={isSophModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
