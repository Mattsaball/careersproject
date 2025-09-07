import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CareerJourney } from "@/types/career";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CareerModalProps {
  career: CareerJourney | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CareerModal = ({ career, isOpen, onClose }: CareerModalProps) => {
  const { toast } = useToast();
  
  if (!career) return null;

  const handleCopyLink = () => {
    toast({
      description: "Link copied",
      duration: 2000,
      className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-fit px-4 py-2 rounded-md bg-background border shadow-lg",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-6">
            <DialogTitle className="text-2xl">
              {career.postGradPlans}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
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
            {career.major && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Major</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {career.major}
                  </p>
                </CardContent>
              </Card>
            )}
            {career.careerPath && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Previous Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {career.careerPath}
                  </p>
                </CardContent>
              </Card>
            )}

            {career.networkingStrategies && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Networking Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {career.networkingStrategies}
                  </p>
                </CardContent>
              </Card>
            )}

            {career.freshmanAdvice && career.freshmanAdvice !== "NA" && career.freshmanAdvice !== "na" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advice</CardTitle>
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