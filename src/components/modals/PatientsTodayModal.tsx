import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Clock, FileText, Video, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientsTodayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewHistory: (patientName: string) => void;
}

const todaysPatients = [
  {
    id: "1",
    name: "John Smith",
    time: "9:00 AM",
    type: "General Checkup",
    status: "Scheduled",
    condition: "New Patient",
    urgency: "Routine"
  },
  {
    id: "2",
    name: "Emily Davis",
    time: "10:30 AM",
    type: "Cardiology Follow-up",
    status: "In Progress",
    condition: "Hypertension",
    urgency: "Medium"
  },
  {
    id: "3",
    name: "Michael Brown",
    time: "2:00 PM",
    type: "Telehealth Consultation",
    status: "Scheduled",
    condition: "Diabetes",
    urgency: "Routine"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    time: "3:30 PM",
    type: "Follow-up",
    status: "Scheduled",
    condition: "Post-Surgery",
    urgency: "High"
  },
];

const PatientsTodayModal = ({ open, onOpenChange, onViewHistory }: PatientsTodayModalProps) => {
  const { toast } = useToast();

  const handleStartConsultation = (patientName: string) => {
    toast({
      title: "Starting Consultation",
      description: `Opening consultation room for ${patientName}`,
    });
  };

  const handleMarkComplete = (patientName: string) => {
    toast({
      title: "Appointment Complete",
      description: `${patientName}'s appointment has been marked as complete.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Today's Patients
          </DialogTitle>
          <DialogDescription>
            All patients scheduled for consultations today.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {todaysPatients.map((patient) => (
            <Card key={patient.id} className="p-4 border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm bg-primary/20 text-primary px-3 py-1 rounded-full mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{patient.time}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    patient.status === "In Progress"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {patient.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm mb-3">
                <span className="text-muted-foreground">{patient.type}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  patient.urgency === "High"
                    ? "bg-destructive/20 text-destructive"
                    : patient.urgency === "Medium"
                    ? "bg-accent/20 text-accent"
                    : "bg-primary/10 text-primary"
                }`}>
                  {patient.urgency} Priority
                </span>
              </div>

              <div className="flex gap-2">
                {patient.status === "Scheduled" && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStartConsultation(patient.name)}
                  >
                    Start Consultation
                  </Button>
                )}
                {patient.status === "In Progress" && (
                  <Button 
                    size="sm"
                    onClick={() => handleMarkComplete(patient.name)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Mark Complete
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    onViewHistory(patient.name);
                    onOpenChange(false);
                  }}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  View History
                </Button>
                {patient.type.includes("Telehealth") && (
                  <Button size="sm" variant="outline">
                    <Video className="w-3 h-3 mr-1" />
                    Join Call
                  </Button>
                )}
              </div>
            </Card>
          ))}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {todaysPatients.length} patients scheduled today
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientsTodayModal;
