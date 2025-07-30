import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Lightbulb, Target } from "lucide-react";
import { careerJourneys } from "@/data/careerJourneys";

const CareerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const career = careerJourneys.find((journey) => journey.id === id);
  
  if (!career) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Career Journey Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Career Journeys
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            onClick={() => navigate("/")} 
            variant="outline" 
            className="mb-4 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Career Journeys
          </Button>
          
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {career.title}
            </h1>
            <Badge variant="secondary" className="text-sm font-medium">
              {career.subtitle}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                Experience Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground leading-relaxed">
                {career.details}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Target className="h-5 w-5 text-primary" />
                Key Skills Developed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-sm px-3 py-1 border-primary/30 text-primary bg-accent/30 hover:bg-accent/50 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] border-primary/20 bg-gradient-to-br from-accent/30 to-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lightbulb className="h-5 w-5 text-primary" />
                Career Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground leading-relaxed italic">
                "{career.advice}"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerDetail;