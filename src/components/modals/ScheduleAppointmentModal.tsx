import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ScheduleAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const samplePatients = [
  { id: "1", name: "John Smith", condition: "New Patient" },
  { id: "2", name: "Emily Davis", condition: "Follow-up" },
  { id: "3", name: "Michael Brown", condition: "Consultation" },
  { id: "4", name: "Sarah Wilson", condition: "Checkup" },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const ScheduleAppointmentModal = ({ open, onOpenChange }: ScheduleAppointmentModalProps) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");
  const [syncWithGoogle, setSyncWithGoogle] = useState(false);
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!selectedPatient || !selectedDate || !selectedTime || !appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const patient = samplePatients.find(p => p.id === selectedPatient);
    
    if (syncWithGoogle) {
      // Create Google Calendar event URL
      const startDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.includes("PM") 
        ? [parseInt(selectedTime.split(":")[0]) + (parseInt(selectedTime.split(":")[0]) === 12 ? 0 : 12), parseInt(selectedTime.split(":")[1])]
        : [parseInt(selectedTime.split(":")[0]) === 12 ? 0 : parseInt(selectedTime.split(":")[0]), parseInt(selectedTime.split(":")[1])];
      startDateTime.setHours(hours, minutes, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1);
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment+with+${encodeURIComponent(patient?.name || "Patient")}&dates=${startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Appointment+Type:+${encodeURIComponent(appointmentType)}${notes ? '%0A%0ANotes:+' + encodeURIComponent(notes) : ''}&location=Medical+Center`;
      
      window.open(googleCalendarUrl, '_blank');
      
      toast({
        title: "Appointment Scheduled & Synced!",
        description: `Appointment with ${patient?.name} scheduled for ${format(selectedDate, "MMM dd, yyyy")} at ${selectedTime}. Google Calendar opened.`,
      });
    } else {
      toast({
        title: "Appointment Scheduled!",
        description: `Appointment with ${patient?.name} scheduled for ${format(selectedDate, "MMM dd, yyyy")} at ${selectedTime}`,
      });
    }

    // Reset form
    setSelectedPatient("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setAppointmentType("");
    setNotes("");
    setSyncWithGoogle(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Schedule Appointment
          </DialogTitle>
          <DialogDescription>
            Create a new appointment for a patient.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Patient *</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {samplePatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} - {patient.condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Appointment Type *</Label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkup">General Checkup</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="telehealth">Telehealth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Date *</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Select Time *
            </Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any special notes or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <Checkbox
              id="googleSync"
              checked={syncWithGoogle}
              onCheckedChange={(checked) => setSyncWithGoogle(checked as boolean)}
            />
            <Label
              htmlFor="googleSync"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Sync with Google Calendar
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSchedule} className="flex-1">
              Schedule Appointment
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentModal;
