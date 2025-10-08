import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TelehealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName?: string;
  appointmentTime?: string;
}

const TelehealthModal = ({ open, onOpenChange, patientName, appointmentTime }: TelehealthModalProps) => {
  const [meetLink, setMeetLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Generate a Google Meet-style link
      const randomId = Math.random().toString(36).substring(2, 15);
      setMeetLink(`https://meet.google.com/${randomId}`);
    }
  }, [open]);

  const handleJoinCall = () => {
    window.open(meetLink, "_blank");
    toast({
      title: "Opening Video Call",
      description: "Google Meet is opening in a new tab.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetLink);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Meeting link copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Telehealth Consultation
          </DialogTitle>
          <DialogDescription>
            {patientName && `Video consultation with ${patientName}`}
            {appointmentTime && ` at ${appointmentTime}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <Video className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Ready to Join</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your Google Meet consultation room is ready
            </p>
            <Button onClick={handleJoinCall} size="lg" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Join Video Call
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Meeting Link</Label>
            <div className="flex gap-2">
              <Input value={meetLink} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-secondary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link with your patient for them to join
            </p>
          </div>

          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm">Consultation Guidelines</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                <span>Ensure stable internet connection</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                <span>Test camera and microphone before joining</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                <span>Find a quiet, private space for the consultation</span>
              </li>
            </ul>
          </div>

          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TelehealthModal;
