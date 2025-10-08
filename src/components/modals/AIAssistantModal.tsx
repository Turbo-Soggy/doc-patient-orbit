import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, FileText, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface AIAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName?: string;
  action: "summarize" | "recommend";
}

const AIAssistantModal = ({ open, onOpenChange, patientName, action }: AIAssistantModalProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (action === "summarize") {
        setResult({
          summary: "Patient John Smith, 45-year-old male with history of hypertension. Chief complaint: chest discomfort and shortness of breath during physical activity. Vital signs stable. Current medications: Lisinopril 10mg daily. Physical examination reveals no acute abnormalities. Recommend ECG and stress test for further evaluation.",
          keyPoints: [
            "Stable vital signs",
            "History of hypertension",
            "Currently on Lisinopril",
            "Needs cardiac workup"
          ]
        });
      } else {
        setResult({
          procedures: [
            {
              name: "ECG (Electrocardiogram)",
              reason: "To assess cardiac rhythm and detect any abnormalities",
              urgency: "Routine"
            },
            {
              name: "Exercise Stress Test",
              reason: "To evaluate cardiac function under stress",
              urgency: "Within 2 weeks"
            },
            {
              name: "Lipid Panel",
              reason: "To assess cardiovascular risk factors",
              urgency: "Routine"
            }
          ]
        });
      }
      setLoading(false);
      toast({
        title: "AI Analysis Complete",
        description: action === "summarize" ? "Notes summarized successfully" : "Recommendations generated",
      });
    }, 2000);
  };

  const handleClose = () => {
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            {action === "summarize" ? "AI Note Summarization" : "AI Procedure Recommendations"}
          </DialogTitle>
          <DialogDescription>
            {patientName && `For patient: ${patientName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!result && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {action === "summarize" ? (
                  <FileText className="w-8 h-8 text-accent" />
                ) : (
                  <Lightbulb className="w-8 h-8 text-accent" />
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                {action === "summarize" 
                  ? "AI will analyze and summarize the patient notes"
                  : "AI will recommend appropriate procedures based on patient history"}
              </p>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  `Generate ${action === "summarize" ? "Summary" : "Recommendations"}`
                )}
              </Button>
            </div>
          )}

          {result && action === "summarize" && (
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.summary}
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2">Key Points</h4>
                <ul className="space-y-2">
                  {result.keyPoints.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="flex gap-2">
                <Button className="flex-1">Copy to Notes</Button>
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          )}

          {result && action === "recommend" && (
            <div className="space-y-4">
              {result.procedures.map((procedure: any, i: number) => (
                <Card key={i} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{procedure.name}</h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {procedure.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{procedure.reason}</p>
                </Card>
              ))}

              <div className="flex gap-2">
                <Button className="flex-1">Add to Treatment Plan</Button>
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

export default AIAssistantModal;
