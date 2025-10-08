import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Clock, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TelehealthSessionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const telehealthSessions = [
  {
    id: "1",
    patient: "Michael Brown",
    time: "2:00 PM",
    status: "Scheduled",
    type: "Diabetes Consultation",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    notes: "Review recent glucose levels and adjust medication if needed"
  },
  {
    id: "2",
    patient: "Jennifer White",
    time: "4:30 PM",
    status: "Scheduled",
    type: "Follow-up Consultation",
    meetingLink: "https://meet.google.com/xyz-mnop-qrs",
    notes: "Post-treatment follow-up, discuss lab results"
  },
  {
    id: "3",
    patient: "Robert Taylor",
    time: "5:45 PM",
    status: "Pending",
    type: "Initial Consultation",
    meetingLink: "https://meet.google.com/tuv-wxyz-123",
    notes: "New patient consultation for chronic pain management"
  },
];

const TelehealthSessionsModal = ({ open, onOpenChange }: TelehealthSessionsModalProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleJoinCall = (meetingLink: string) => {
    window.open(meetingLink, "_blank");
    toast({
      title: "Opening Video Call",
      description: "Google Meet is opening in a new tab.",
    });
  };

  const handleCopyLink = (meetingLink: string, sessionId: string) => {
    navigator.clipboard.writeText(meetingLink);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Link Copied",
      description: "Meeting link copied to clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-accent" />
            Telehealth Sessions Today
          </DialogTitle>
          <DialogDescription>
            Scheduled virtual consultations for today.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {telehealthSessions.map((session) => (
            <Card key={session.id} className="p-4 border-l-4 border-l-accent">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{session.patient}</h3>
                  <p className="text-sm text-muted-foreground">{session.type}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm bg-accent/20 text-accent px-3 py-1 rounded-full mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{session.time}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.status === "Scheduled"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded text-sm mb-3">
                <p className="font-medium mb-1">Session Notes:</p>
                <p className="text-muted-foreground">{session.notes}</p>
              </div>

              <div className="flex items-center gap-2 mb-3 p-2 bg-accent/5 rounded">
                <Video className="w-4 h-4 text-accent" />
                <code className="text-xs flex-1 truncate">{session.meetingLink}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyLink(session.meetingLink, session.id)}
                >
                  {copiedId === session.id ? (
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleJoinCall(session.meetingLink)}
                  className="flex-1"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Join Video Call
                </Button>
                <Button size="sm" variant="outline">
                  View Patient
                </Button>
              </div>
            </Card>
          ))}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {telehealthSessions.length} telehealth sessions today
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

export default TelehealthSessionsModal;
