import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: any | null;
}

export const UserJourneyModal = ({
  isOpen,
  onClose,
  journey,
}: UserJourneyModalProps) => {
  const { toast } = useToast();
  
  if (!journey) return null;

  const handleCopyLink = () => {
    toast({
      description: "Link copied",
      duration: 2000,
      className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6 sm:p-8 bg-background text-foreground">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold">
                {journey.anonymous ? "Anonymous" : journey.name}
              </h2>
              <p className="text-muted-foreground">
                Class of {journey.graduationYear || "N/A"}
              </p>
            </div>
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

          {journey.summers?.length > 0 && (
            <div>
              <h3 className="font-semibold">Summer Experiences</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {journey.summers.map((summer: string, idx: number) => (
                  <li key={idx}>{summer}</li>
                ))}
              </ul>
            </div>
          )}

          {journey.clubs && (
            <div>
              <h3 className="font-semibold">Helpful Clubs</h3>
              <p className="text-muted-foreground">{journey.clubs}</p>
            </div>
          )}

          {journey.resources && (
            <div>
              <h3 className="font-semibold">Helpful Resources</h3>
              <p className="text-muted-foreground">{journey.resources}</p>
            </div>
          )}

          {journey.missed && (
            <div>
              <h3 className="font-semibold">Opportunities I Missed</h3>
              <p className="text-muted-foreground">{journey.missed}</p>
            </div>
          )}

          {journey.advice && (
            <div>
              <h3 className="font-semibold">Advice</h3>
              <p className="text-muted-foreground">{journey.advice}</p>
            </div>
          )}

          {journey.linkedin && !journey.anonymous && (
            <div>
              <h3 className="font-semibold">LinkedIn</h3>
              <a
                href={journey.linkedin}
                className="text-blue-600 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {journey.linkedin}
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
