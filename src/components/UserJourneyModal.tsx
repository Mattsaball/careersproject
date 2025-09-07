import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CareerJourney } from "@/types/career";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";

interface UserJourneyModalProps {
  journey: CareerJourney | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
}

export const UserJourneyModal = ({ journey, isOpen, onClose, onShare }: UserJourneyModalProps) => {
  if (!journey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-6">
            <DialogTitle className="text-2xl">
              {journey.postGradPlans}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="flex items-center gap-1.5 border-[#1DA1F2] text-[#1DA1F2] bg-transparent hover:bg-[#E6F3FF] hover:text-[#0A66C2] active:bg-[#1DA1F2] active:text-white transition-all duration-200 ease-in-out hover:scale-105"
              title="Share this journey with others"
            >
              <Link className="h-[18px] w-[18px]" />
              Share Journey
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4 [&>[data-radix-scroll-area-scrollbar]]:opacity-100">
          <div className="space-y-6">
            {/* Assuming similar card structure as CareerModal */}
            {journey.major && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Major</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {journey.major}
                  </p>
                </CardContent>
              </Card>
            )}
            {/* Add other journey details as needed */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
