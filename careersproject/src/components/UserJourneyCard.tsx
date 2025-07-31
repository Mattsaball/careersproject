import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface UserJourneyCardProps {
  postGradPlans: string;
  graduationYear?: string;
  onClick?: () => void;
}

export const UserJourneyCard = ({
  postGradPlans,
  graduationYear,
  onClick,
}: UserJourneyCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-hover)] bg-gradient-to-br from-card to-accent border-border hover:border-primary/30 transform hover:-translate-y-1"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {postGradPlans}
            </h3>
            {graduationYear && (
              <p className="text-muted-foreground text-sm">
                Class of {graduationYear}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-4" />
        </div>
      </CardContent>
    </Card>
  );
};
