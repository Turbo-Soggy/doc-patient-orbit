import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import RescheduleModal from "./RescheduleModal";

interface PendingRequestsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  urgency: string;
  reason: string | null;
  submitted_at: string;
  patient: {
    id: string;
    profiles: {
      full_name: string | null;
    } | null;
  } | null;
}

const PendingRequestsModal = ({ open, onOpenChange }: PendingRequestsModalProps) => {
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view pending requests.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id (
            id,
            profiles (full_name)
          )
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'pending')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setPendingRequests(data || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast({
        title: "Error",
        description: "Failed to load pending requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPendingRequests();
    }
  }, [open]);

  const handleApprove = async (appointmentId: string, patientName: string, date: string, time: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'approved' })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchPendingRequests();
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
        description: `${patientName}'s appointment for ${date} at ${time} has been confirmed.`,
      });
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast({
        title: "Error",
        description: "Failed to approve appointment.",
        variant: "destructive",
      });
    }
  };

  const handleDecline = async (appointmentId: string, patientName: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'declined' })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchPendingRequests();

      toast({
        title: "Request Declined",
        description: `${patientName}'s appointment request has been declined.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error declining appointment:', error);
      toast({
        title: "Error",
        description: "Failed to decline appointment.",
        variant: "destructive",
      });
    }
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const handleRescheduleConfirm = async (newDate: Date, newTime: string) => {
    if (!selectedAppointment) return;

    try {
      // Convert time from "9:00 AM" format to "09:00:00" format
      const [time, period] = newTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

      const { error } = await supabase
        .from('appointments')
        .update({ 
          appointment_date: format(newDate, 'yyyy-MM-dd'),
          appointment_time: timeString,
          status: 'approved'
        })
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      await fetchPendingRequests();

      toast({
        title: "Appointment Rescheduled",
        description: `Successfully rescheduled to ${format(newDate, 'MMM dd, yyyy')} at ${newTime}`,
      });
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule appointment.",
        variant: "destructive",
      });
    }
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

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Loading pending requests...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => {
              const patientName = request.patient?.profiles?.full_name || 'Unknown Patient';
              const formattedDate = format(new Date(request.appointment_date), 'MMM dd, yyyy');
              const formattedTime = format(new Date(`2000-01-01 ${request.appointment_time}`), 'h:mm a');
              const formattedSubmitted = format(new Date(request.submitted_at), 'MMM dd, yyyy - h:mm a');

              return (
                <Card key={request.id} className="p-4 border-l-4 border-accent">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{patientName}</h3>
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
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium">Time:</span>
                      <span>{formattedTime}</span>
                    </div>
                    {request.reason && (
                      <div className="text-sm mt-2 p-3 bg-muted/50 rounded">
                        <span className="font-medium">Reason:</span>
                        <p className="mt-1 text-muted-foreground">{request.reason}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted on: {formattedSubmitted}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleApprove(request.id, patientName, formattedDate, formattedTime)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleReschedule(request)}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDecline(request.id, patientName)}
                    >
                      Decline
                    </Button>
                  </div>
                </Card>
              );
            })}

            {pendingRequests.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending appointment requests.</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {pendingRequests.length} pending {pendingRequests.length === 1 ? 'request' : 'requests'}
              </p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      {selectedAppointment && (
        <RescheduleModal
          open={rescheduleModalOpen}
          onOpenChange={setRescheduleModalOpen}
          onReschedule={handleRescheduleConfirm}
          patientName={selectedAppointment.patient?.profiles?.full_name || 'Unknown Patient'}
          currentDate={format(new Date(selectedAppointment.appointment_date), 'MMM dd, yyyy')}
          currentTime={format(new Date(`2000-01-01 ${selectedAppointment.appointment_time}`), 'h:mm a')}
        />
      )}
    </Dialog>
  );
};

export default PendingRequestsModal;
