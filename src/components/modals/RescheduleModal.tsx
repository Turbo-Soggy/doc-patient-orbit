import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

interface RescheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (date: Date, time: string) => void;
  patientName: string;
  currentDate: string;
  currentTime: string;
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM"
];

const RescheduleModal = ({ 
  open, 
  onOpenChange, 
  onReschedule, 
  patientName,
  currentDate,
  currentTime
}: RescheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onReschedule(selectedDate, selectedTime);
      onOpenChange(false);
      setSelectedDate(undefined);
      setSelectedTime("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select a new date and time for {patientName}'s appointment.
            <br />
            <span className="text-xs">Current: {currentDate} at {currentTime}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Select Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Reschedule
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedDate(undefined);
                setSelectedTime("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
