import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SophJourney } from "@/types/sophJourney";
import { Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SophJourneyModalProps {
  journey: SophJourney | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SophJourneyModal = ({ journey, isOpen, onClose }: SophJourneyModalProps) => {
  const { toast } = useToast();
  
  if (!journey) return null;

  const handleCopyLink = () => {
    toast({
      description: "Link copied",
      duration: 1000,
      className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <DialogTitle className="text-xl font-bold text-primary flex-1">
              {journey.sophSummerJob}
            </DialogTitle>
            <div style={{ marginLeft: '100px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex items-center gap-2 shrink-0"
                title="Share this journey with others - click to copy link"
              >
                <Link className="h-4 w-4" />
                Share Journey
              </Button>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Major & Academic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Academic Background</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-semibold">Major:</span> {journey.major}
                </p>
                {journey.minor && (
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold">Minor:</span> {journey.minor}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Major Type:</span> {journey.majorType}
                </p>
              </CardContent>
            </Card>

            {/* Sophomore Summer Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Sophomore Summer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-card-foreground mb-2">What They Did:</p>
                  <p className="text-sm text-muted-foreground mb-1">{journey.sophSummerJob}</p>
                  <p className="text-xs text-muted-foreground">({journey.sophSummerCareerType})</p>
                </div>
                {journey.sophSummerHowGot && (
                  <div>
                    <p className="text-sm font-semibold text-card-foreground mb-2">How They Got This Experience:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {journey.sophSummerHowGot}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Freshman Summer Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Freshman Summer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-card-foreground mb-2">What They Did:</p>
                  <p className="text-sm text-muted-foreground mb-1">{journey.freshmanSummerJob}</p>
                  <p className="text-xs text-muted-foreground">({journey.freshmanSummerCareerType})</p>
                </div>
                {journey.freshmanSummerHowGot && (
                  <div>
                    <p className="text-sm font-semibold text-card-foreground mb-2">How They Got This Experience:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {journey.freshmanSummerHowGot}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Advice */}
            {journey.advice && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Advice to Underclassmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {journey.advice}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Hacks & Shortcuts */}
            {journey.hacks && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Hacks & Shortcuts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {journey.hacks}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};