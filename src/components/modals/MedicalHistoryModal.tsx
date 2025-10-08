import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MedicalHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName?: string;
}

const sampleHistory = [
  {
    date: "Nov 28, 2024",
    type: "General Checkup",
    doctor: "Dr. Sarah Johnson",
    diagnosis: "Routine physical examination - All vitals normal",
    prescriptions: ["Multivitamin supplement"],
  },
  {
    date: "Oct 15, 2024",
    type: "Cardiology Consultation",
    doctor: "Dr. Michael Chen",
    diagnosis: "Mild hypertension - Stage 1",
    prescriptions: ["Lisinopril 10mg", "Low sodium diet"],
  },
  {
    date: "Sep 03, 2024",
    type: "Lab Results",
    doctor: "Dr. Sarah Johnson",
    diagnosis: "Annual blood work - Normal ranges",
    prescriptions: [],
  },
];

const MedicalHistoryModal = ({ open, onOpenChange, patientName }: MedicalHistoryModalProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your medical records are being prepared for download.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Medical History {patientName && `- ${patientName}`}
          </DialogTitle>
          <DialogDescription>
            Complete medical history and past consultations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {sampleHistory.map((record, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{record.type}</h4>
                  <p className="text-sm text-muted-foreground">{record.doctor}</p>
                </div>
                <span className="text-sm text-muted-foreground">{record.date}</span>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Diagnosis:</p>
                  <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                </div>

                {record.prescriptions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Prescriptions:</p>
                    <ul className="text-sm text-muted-foreground">
                      {record.prescriptions.map((prescription, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {prescription}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Records
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalHistoryModal;
