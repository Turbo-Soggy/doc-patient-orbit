import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SymptomCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SymptomCheckModal = ({ open, onOpenChange }: SymptomCheckModalProps) => {
  const [symptoms, setSymptoms] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const analyzeSymptoms = () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setResult({
        severity: "Moderate",
        recommendations: [
          "Schedule an appointment with a cardiologist within 1-2 weeks",
          "Monitor blood pressure daily",
          "Avoid strenuous physical activity until consultation"
        ],
        suggestedSpecialist: "Dr. Sarah Johnson - Cardiology",
        urgency: "Medium Priority"
      });
      setAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your symptoms successfully.",
      });
    }, 2000);
  };

  const handleClose = () => {
    setSymptoms("");
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            AI Symptom Analysis
          </DialogTitle>
          <DialogDescription>
            Describe your symptoms and our AI will provide recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe Your Symptoms</Label>
            <Textarea
              id="symptoms"
              placeholder="E.g., I've been experiencing chest pain and shortness of breath..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {!result && (
            <Button 
              onClick={analyzeSymptoms} 
              disabled={!symptoms.trim() || analyzing}
              className="w-full"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Symptoms"
              )}
            </Button>
          )}

          {result && (
            <div className="space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div>
                <h4 className="font-semibold mb-2">Severity Level</h4>
                <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm">
                  {result.severity}
                </span>
              </div>

              <div>
                <h4 className="font-semibold mb-2">AI Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Suggested Specialist</h4>
                <p className="text-sm text-muted-foreground">{result.suggestedSpecialist}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Book Appointment</Button>
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SymptomCheckModal;
