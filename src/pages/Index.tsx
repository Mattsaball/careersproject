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
        console.log("Static journeys fallback:", staticJourneys.length);
        const staticNormalized = staticJourneys.map((journey) => ({
          ...journey,
          id: `static-${journey.id}`,
        }));
        console.log("Setting fallback journeys:", staticNormalized.length);
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

  // Helper function to check if major filter matches (expansive matching)
  const majorFilterMatches = (journey: CareerJourney, selectedMajors: string[]): boolean => {
    if (selectedMajors.length === 0) return true;
    
    const majorFilter = (journey.majorFilter || '').toLowerCase();
    const major = (journey.major || '').toLowerCase();
    
    // Check if the journey matches any of the selected major categories
    return selectedMajors.some(selectedMajor => {
      switch (selectedMajor) {
        case 'Business & Finance':
          return majorFilter.includes('business') || majorFilter.includes('finance') || 
                 majorFilter.includes('economics') || majorFilter.includes('accounting') ||
                 majorFilter.includes('marketing') || majorFilter.includes('management') ||
                 major.includes('business') || major.includes('finance') || 
                 major.includes('economics') || major.includes('accounting');
        case 'Science & Health Sciences':
          return majorFilter.includes('biology') || majorFilter.includes('chemistry') || 
                 majorFilter.includes('physics') || majorFilter.includes('medicine') || 
                 majorFilter.includes('health') || majorFilter.includes('science') ||
                 majorFilter.includes('pre-med') || majorFilter.includes('biochem') ||
                 major.includes('biology') || major.includes('chemistry') || 
                 major.includes('physics') || major.includes('science');
        case 'Engineering & Math':
          return majorFilter.includes('engineering') || majorFilter.includes('computer') || 
                 majorFilter.includes('math') || majorFilter.includes('technology') ||
                 majorFilter.includes('cs') || majorFilter.includes('stem') ||
                 major.includes('engineering') || major.includes('computer') || 
                 major.includes('math') || major.includes('cs');
        case 'Humanities':
          return majorFilter.includes('history') || majorFilter.includes('literature') || 
                 majorFilter.includes('philosophy') || majorFilter.includes('language') || 
                 majorFilter.includes('humanities') || majorFilter.includes('english') ||
                 majorFilter.includes('comparative') || majorFilter.includes('classics') ||
                 major.includes('history') || major.includes('english') || 
                 major.includes('philosophy') || major.includes('literature');
        case 'Social Sciences':
          return majorFilter.includes('psychology') || majorFilter.includes('sociology') || 
                 majorFilter.includes('anthropology') || majorFilter.includes('political') || 
                 majorFilter.includes('social') || majorFilter.includes('international') ||
                 majorFilter.includes('relations') || majorFilter.includes('studies') ||
                 major.includes('psychology') || major.includes('political') || 
                 major.includes('sociology') || major.includes('anthropology');
        case 'Arts & Media':
          return majorFilter.includes('art') || majorFilter.includes('music') || 
                 majorFilter.includes('theater') || majorFilter.includes('media') || 
                 majorFilter.includes('design') || majorFilter.includes('film') ||
                 majorFilter.includes('creative') || majorFilter.includes('visual') ||
                 major.includes('art') || major.includes('music') || 
                 major.includes('film') || major.includes('design');
        default:
          return false;
      }
    });
  };

  // Helper function to check if career filter matches (expansive matching)
  const careerFilterMatches = (journey: CareerJourney, selectedCareerTypes: string[]): boolean => {
    if (selectedCareerTypes.length === 0) return true;
    
    const careerFilter = (journey.careerFilter || '').toLowerCase();
    const postGradPlans = (journey.postGradPlans || '').toLowerCase();
    
    // Check if the journey matches any of the selected career categories
    return selectedCareerTypes.some(selectedCareer => {
      switch (selectedCareer) {
        case 'Business / Finance':
          return careerFilter.includes('business') || careerFilter.includes('finance') || 
                 careerFilter.includes('banking') || careerFilter.includes('consulting') ||
                 careerFilter.includes('investment') || careerFilter.includes('analyst') ||
                 postGradPlans.includes('business') || postGradPlans.includes('finance') ||
                 postGradPlans.includes('consulting') || postGradPlans.includes('banking');
        case 'Engineering / Tech':
          return careerFilter.includes('engineering') || careerFilter.includes('tech') || 
                 careerFilter.includes('software') || careerFilter.includes('computer') ||
                 careerFilter.includes('data') || careerFilter.includes('developer') ||
                 postGradPlans.includes('tech') || postGradPlans.includes('engineering') ||
                 postGradPlans.includes('software') || postGradPlans.includes('google') ||
                 postGradPlans.includes('microsoft') || postGradPlans.includes('amazon');
        case 'Healthcare / Life Sciences':
          return careerFilter.includes('healthcare') || careerFilter.includes('medical') || 
                 careerFilter.includes('life sciences') || careerFilter.includes('biology') ||
                 careerFilter.includes('pharma') || careerFilter.includes('biotech') ||
                 postGradPlans.includes('medical') || postGradPlans.includes('healthcare') ||
                 postGradPlans.includes('hospital') || postGradPlans.includes('med school');
        case 'Academia / Graduate School':
          return careerFilter.includes('academia') || careerFilter.includes('graduate') || 
                 careerFilter.includes('research') || careerFilter.includes('phd') ||
                 careerFilter.includes('grad school') || careerFilter.includes('university') ||
                 postGradPlans.includes('grad school') || postGradPlans.includes('phd') ||
                 postGradPlans.includes('research') || postGradPlans.includes('university');
        case 'Government / Policy / Legal':
          return careerFilter.includes('government') || careerFilter.includes('policy') || 
                 careerFilter.includes('legal') || careerFilter.includes('law') ||
                 careerFilter.includes('public') || careerFilter.includes('federal') ||
                 postGradPlans.includes('government') || postGradPlans.includes('law school') ||
                 postGradPlans.includes('policy') || postGradPlans.includes('legal');
        case 'Media / Arts / Museums':
          return careerFilter.includes('media') || careerFilter.includes('arts') || 
                 careerFilter.includes('museum') || careerFilter.includes('creative') ||
                 careerFilter.includes('journalism') || careerFilter.includes('entertainment') ||
                 postGradPlans.includes('media') || postGradPlans.includes('museum') ||
                 postGradPlans.includes('arts') || postGradPlans.includes('creative');
        case 'Education / Teaching':
          return careerFilter.includes('education') || careerFilter.includes('teaching') || 
                 careerFilter.includes('teacher') || careerFilter.includes('school') ||
                 postGradPlans.includes('teaching') || postGradPlans.includes('education') ||
                 postGradPlans.includes('teacher') || postGradPlans.includes('school');
        case 'Sustainability / Environment':
          return careerFilter.includes('sustainability') || careerFilter.includes('environment') || 
                 careerFilter.includes('climate') || careerFilter.includes('green') ||
                 careerFilter.includes('renewable') || careerFilter.includes('conservation') ||
                 postGradPlans.includes('sustainability') || postGradPlans.includes('environment');
        default:
          return false;
      }
    });
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

      return majorMatch && careerMatch && yearMatch;
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

        {/* Alumni Career Journeys Section */}
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

        {/* Sophomore Experiences Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Sophomore Experiences (Class of 2027)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {sophJourneys.map((journey) => (
              <SophJourneyCard
                key={journey.id}
                journey={journey}
                onClick={() => handleSophJourneyClick(journey.id)}
              />
            ))}
          </div>
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

      <SophJourneyModal
        journey={selectedSophJourney}
        isOpen={isSophModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
