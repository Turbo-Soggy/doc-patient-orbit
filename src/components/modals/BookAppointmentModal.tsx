import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BookAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedDoctor?: string;
  preSelectedDoctorName?: string;
}

const doctors = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiology" },
  { id: "2", name: "Dr. Michael Chen", specialty: "General Practice" },
  { id: "3", name: "Dr. Emily Williams", specialty: "Pediatrics" },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const BookAppointmentModal = ({ open, onOpenChange, preSelectedDoctor, preSelectedDoctorName }: BookAppointmentModalProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState(preSelectedDoctor || "");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [syncWithGoogle, setSyncWithGoogle] = useState(false);
  const { toast } = useToast();

  // Update selected doctor when pre-selected doctor changes
  useEffect(() => {
    if (preSelectedDoctor) {
      setSelectedDoctor(preSelectedDoctor);
    }
  }, [preSelectedDoctor]);

  const handleBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    
    if (syncWithGoogle) {
      // Create Google Calendar event URL
      const startDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.includes("PM") 
        ? [parseInt(selectedTime.split(":")[0]) + 12, parseInt(selectedTime.split(":")[1])]
        : [parseInt(selectedTime.split(":")[0]), parseInt(selectedTime.split(":")[1])];
      startDateTime.setHours(hours, minutes, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1);
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Medical+Appointment+with+${encodeURIComponent(doctor?.name || "Doctor")}&dates=${startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Healthcare+appointment+scheduled+through+HealthCare+AI&location=Medical+Center`;
      
      window.open(googleCalendarUrl, '_blank');
      
      toast({
        title: "Appointment Booked & Synced!",
        description: `Your appointment has been scheduled for ${format(selectedDate, "MMM dd, yyyy")} at ${selectedTime}. Google Calendar opened in new tab.`,
      });
    } else {
      toast({
        title: "Appointment Booked!",
        description: `Your appointment has been scheduled for ${format(selectedDate, "MMM dd, yyyy")} at ${selectedTime}`,
      });
    }
    
    onOpenChange(false);
    // Reset form
    setSelectedDoctor("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setSyncWithGoogle(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            {preSelectedDoctorName 
              ? `Schedule your appointment with ${preSelectedDoctorName}` 
              : "Schedule your appointment with a healthcare professional."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {preSelectedDoctorName && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-accent" />
                <span className="font-semibold text-sm">AI Recommended Specialist</span>
              </div>
              <p className="text-sm text-muted-foreground">{preSelectedDoctorName}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Select Doctor</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                    {preSelectedDoctor === doctor.id && " ⭐ (Recommended)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Time</Label>
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

          <div className="flex gap-2">
            <Button onClick={handleBooking} className="flex-1">
              Confirm Booking
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

export default BookAppointmentModal;
