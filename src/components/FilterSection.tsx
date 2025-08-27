import { useState } from "react";
import { ChevronDown, ChevronRight, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterSectionProps {
  selectedMajors: string[];
  selectedCareerTypes: string[];
  onMajorToggle: (major: string) => void;
  onCareerTypeToggle: (careerType: string) => void;
  onClearAll: () => void;
}

  const majorCategories = [
    "Business/Finance",
    "Science/Health Sciences", 
    "Engineering/Math",
    "Humanities",
    "Social Sciences",
    "Arts/Media"
  ];

  const careerTypeCategories = [
    "Business/Finance",
    "Engineering/Tech", 
    "Healthcare/Life Sciences",
    "Academia/Graduate School",
    "Government/Policy/Legal",
    "Media/Arts/Museums",
    "Education/Teaching",
    "Sustainability/Environment"
  ];

export const FilterSection = ({
  selectedMajors,
  selectedCareerTypes,
  onMajorToggle,
  onCareerTypeToggle,
  onClearAll
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalSelected = selectedMajors.length + selectedCareerTypes.length;

  return (
    <div className="w-full mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {totalSelected > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalSelected}
                </Badge>
              )}
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filter Career Journeys</h3>
                {totalSelected > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClearAll}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Major Categories */}
                <div>
                  <h4 className="font-medium mb-3 text-foreground">Major Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {majorCategories.map((major) => (
                      <Badge
                        key={major}
                        variant={selectedMajors.includes(major) ? "default" : "outline"}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => onMajorToggle(major)}
                      >
                        {major}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Career Type Categories */}
                <div>
                  <h4 className="font-medium mb-3 text-foreground">Career Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {careerTypeCategories.map((careerType) => (
                      <Badge
                        key={careerType}
                        variant={selectedCareerTypes.includes(careerType) ? "default" : "outline"}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => onCareerTypeToggle(careerType)}
                      >
                        {careerType}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};