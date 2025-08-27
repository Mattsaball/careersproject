import { Card, CardContent } from "@/components/ui/card";
import { SophJourney } from "@/types/sophJourney";
import { ChevronRight } from "lucide-react";

interface SophJourneyCardProps {
  journey: SophJourney;
  onClick: () => void;
}

export const SophJourneyCard = ({ journey, onClick }: SophJourneyCardProps) => {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-hover)] bg-gradient-to-br from-card to-accent border-border hover:border-primary/30 transform hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {journey.sophSummerJob || "No summer job shared yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {journey.major} • Class of {journey.graduationYear}
            </p>
            <p className="text-xs text-muted-foreground">
              {journey.sophSummerCareerType}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-4" />
        </div>
      </CardContent>
    </Card>
  );
};