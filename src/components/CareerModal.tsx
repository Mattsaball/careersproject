import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareerJourney } from "@/types/career";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CareerModalProps {
  career: CareerJourney | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CareerModal = ({ career, isOpen, onClose }: CareerModalProps) => {
  if (!career) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {career.postGradPlans}
          </DialogTitle>
          <Badge variant="secondary" className="w-fit">
            {career.major}
          </Badge>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {career.careerPath && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Career Path</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {career.careerPath}
                  </p>
                </CardContent>
              </Card>
            )}

            {career.freshmanAdvice && career.freshmanAdvice !== "NA" && career.freshmanAdvice !== "na" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Freshman Advice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {career.freshmanAdvice}
                  </p>
                </CardContent>
              </Card>
            )}

            {career.skillsToFocus && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills to Focus On</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {career.skillsToFocus}
                  </p>
                </CardContent>
              </Card>
            )}

            {career.shortcuts && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shortcuts & Hacks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {career.shortcuts}
                  </p>
                </CardContent>
              </Card>
            )}

            {career.additionalAdvice && career.additionalAdvice !== "n/a" && career.additionalAdvice !== "na" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Advice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {career.additionalAdvice}
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