import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { format, isSameDay } from "date-fns";

interface AppointmentsCalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample appointments data with dates
const appointmentsData = [
  { date: new Date(), time: "9:00 AM", patient: "John Smith", type: "General Checkup" },
  { date: new Date(), time: "10:30 AM", patient: "Emily Davis", type: "Follow-up" },
  { date: new Date(), time: "2:00 PM", patient: "Michael Brown", type: "Telehealth" },
  { date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: "9:30 AM", patient: "Sarah Wilson", type: "Consultation" },
  { date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: "11:00 AM", patient: "David Martinez", type: "Follow-up" },
  { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), time: "10:00 AM", patient: "Lisa Anderson", type: "Checkup" },
  { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), time: "2:30 PM", patient: "Robert Taylor", type: "Consultation" },
  { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), time: "9:00 AM", patient: "Jennifer White", type: "General Checkup" },
];

const AppointmentsCalendarModal = ({ open, onOpenChange }: AppointmentsCalendarModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get appointments for selected date
  const selectedDateAppointments = appointmentsData.filter(apt => 
    isSameDay(apt.date, selectedDate)
  );

  // Get dates that have appointments
  const datesWithAppointments = appointmentsData.map(apt => apt.date);

  const modifiers = {
    hasAppointment: datesWithAppointments,
  };

  const modifiersStyles = {
    hasAppointment: {
      fontWeight: "bold",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      borderRadius: "0.5rem",
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-secondary" />
            Appointments Calendar
          </DialogTitle>
          <DialogDescription>
            View all your scheduled appointments. Dates with appointments are highlighted.
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar View */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Select a Date</h3>
              <span className="text-sm text-muted-foreground">
                {appointmentsData.length} total appointments
              </span>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 rounded bg-primary"></div>
              <span>= Days with appointments</span>
            </div>
          </div>

          {/* Appointments List for Selected Date */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              {format(selectedDate, "EEEE, MMMM dd, yyyy")}
            </h3>
            
            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {selectedDateAppointments.map((apt, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold">{apt.patient}</h4>
                          <p className="text-sm text-muted-foreground">{apt.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{apt.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Reschedule
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No appointments scheduled for this date.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentsCalendarModal;
