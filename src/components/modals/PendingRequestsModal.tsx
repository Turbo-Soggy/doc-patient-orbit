import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingRequestsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pendingRequests = [
  {
    id: "1",
    patientName: "John Smith",
    requestedDate: "Dec 15, 2024",
    requestedTime: "10:00 AM",
    type: "General Checkup",
    urgency: "Routine",
    reason: "AI symptom analysis recommended cardiology consultation",
    submittedOn: "Dec 14, 2024 - 3:45 PM"
  },
  {
    id: "2",
    patientName: "Sarah Wilson",
    requestedDate: "Dec 16, 2024",
    requestedTime: "2:00 PM",
    type: "Follow-up",
    urgency: "Medium",
    reason: "Follow-up for blood pressure management",
    submittedOn: "Dec 13, 2024 - 11:20 AM"
  },
  {
    id: "3",
    patientName: "David Martinez",
    requestedDate: "Dec 18, 2024",
    requestedTime: "9:00 AM",
    type: "Consultation",
    urgency: "High",
    reason: "Post-surgery complications check",
    submittedOn: "Dec 14, 2024 - 8:30 AM"
  },
];

const PendingRequestsModal = ({ open, onOpenChange }: PendingRequestsModalProps) => {
  const { toast } = useToast();

  const handleApprove = (patientName: string, date: string, time: string) => {
    // Create Google Calendar event URL
    const startDateTime = new Date(date);
    const [hours, minutes] = time.includes("PM") 
      ? [parseInt(time.split(":")[0]) + (parseInt(time.split(":")[0]) === 12 ? 0 : 12), parseInt(time.split(":")[1])]
      : [parseInt(time.split(":")[0]) === 12 ? 0 : parseInt(time.split(":")[0]), parseInt(time.split(":")[1])];
    startDateTime.setHours(hours, minutes, 0);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment+with+${encodeURIComponent(patientName)}&dates=${startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Patient+appointment+approved+through+HealthCare+AI&location=Medical+Center`;
    
    window.open(googleCalendarUrl, '_blank');
    
    toast({
      title: "Appointment Approved & Synced",
      description: `${patientName}'s appointment for ${date} at ${time} has been confirmed. Google Calendar opened.`,
    });
  };

  const handleDecline = (patientName: string) => {
    toast({
      title: "Request Declined",
      description: `${patientName}'s appointment request has been declined. Patient will be notified.`,
      variant: "destructive",
    });
  };

  const handleReschedule = (patientName: string) => {
    toast({
      title: "Rescheduling",
      description: `Opening reschedule options for ${patientName}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            Pending Appointment Requests
          </DialogTitle>
          <DialogDescription>
            Review and approve patient appointment requests.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <Card key={request.id} className="p-4 border-l-4 border-accent">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{request.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{request.type}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  request.urgency === "High" 
                    ? "bg-destructive/20 text-destructive" 
                    : request.urgency === "Medium"
                    ? "bg-accent/20 text-accent"
                    : "bg-primary/20 text-primary"
                }`}>
                  {request.urgency} Priority
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Requested:</span>
                  <span>{request.requestedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Time:</span>
                  <span>{request.requestedTime}</span>
                </div>
                <div className="text-sm mt-2 p-3 bg-muted/50 rounded">
                  <span className="font-medium">Reason:</span>
                  <p className="mt-1 text-muted-foreground">{request.reason}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submitted on: {request.submittedOn}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleApprove(request.patientName, request.requestedDate, request.requestedTime)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleReschedule(request.patientName)}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Reschedule
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDecline(request.patientName)}
                >
                  Decline
                </Button>
              </div>
            </Card>
          ))}

          {pendingRequests.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending appointment requests.</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {pendingRequests.length} pending requests
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

export default PendingRequestsModal;
