import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SophJourney } from "@/types/sophJourney";

interface SophJourneyModalProps {
  journey: SophJourney | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SophJourneyModal = ({ journey, isOpen, onClose }: SophJourneyModalProps) => {
  if (!journey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            {journey.sophSummerJob}
          </DialogTitle>
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

            {/* Summer Experiences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Summer Experiences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-card-foreground mb-1">
                    Sophomore Summer (Current):
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">{journey.sophSummerJob}</p>
                  <p className="text-xs text-muted-foreground">({journey.sophSummerCareerType})</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground mb-1">
                    Freshman Summer:
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">{journey.freshmanSummerJob}</p>
                  <p className="text-xs text-muted-foreground">({journey.freshmanSummerCareerType})</p>
                </div>
              </CardContent>
            </Card>

            {/* How They Got These Experiences */}
            {journey.networkingStrategies && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">How They Got These Experiences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {journey.networkingStrategies}
                  </p>
                </CardContent>
              </Card>
            )}

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