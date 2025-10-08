import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Users, Search, Calendar, FileText, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewHistory: (patientName: string) => void;
}

const samplePatients = [
  {
    id: "1",
    name: "John Smith",
    age: 45,
    condition: "Hypertension",
    lastVisit: "Nov 28, 2024",
    nextAppointment: "Today, 9:00 AM",
    status: "Active",
    type: "General Checkup"
  },
  {
    id: "2",
    name: "Emily Davis",
    age: 38,
    condition: "Cardiology Follow-up",
    lastVisit: "Nov 15, 2024",
    nextAppointment: "Today, 10:30 AM",
    status: "Active",
    type: "Follow-up"
  },
  {
    id: "3",
    name: "Michael Brown",
    age: 52,
    condition: "Diabetes Management",
    lastVisit: "Nov 20, 2024",
    nextAppointment: "Today, 2:00 PM",
    status: "Telehealth",
    type: "Consultation"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    age: 29,
    condition: "Annual Physical",
    lastVisit: "Oct 10, 2024",
    nextAppointment: "Dec 20, 2024",
    status: "Scheduled",
    type: "Checkup"
  },
  {
    id: "5",
    name: "David Martinez",
    age: 61,
    condition: "Post-surgery Follow-up",
    lastVisit: "Nov 25, 2024",
    nextAppointment: "Dec 18, 2024",
    status: "Scheduled",
    type: "Follow-up"
  },
];

const PatientListModal = ({ open, onOpenChange, onViewHistory }: PatientListModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredPatients = samplePatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (patientName: string) => {
    onViewHistory(patientName);
    onOpenChange(false);
  };

  const handleScheduleAppointment = (patientName: string) => {
    toast({
      title: "Scheduling",
      description: `Opening scheduler for ${patientName}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Patient List
          </DialogTitle>
          <DialogDescription>
            View and manage all patients under your care.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Patient List */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} years • {patient.condition}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    patient.status === "Active" 
                      ? "bg-secondary/20 text-secondary" 
                      : patient.status === "Telehealth"
                      ? "bg-accent/20 text-accent"
                      : "bg-primary/20 text-primary"
                  }`}>
                    {patient.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Last Visit:</span>
                    <p className="font-medium">{patient.lastVisit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next:</span>
                    <p className="font-medium">{patient.nextAppointment}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(patient.name)}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    View History
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleScheduleAppointment(patient.name)}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule
                  </Button>
                  {patient.status === "Telehealth" && (
                    <Button size="sm" variant="outline">
                      <Video className="w-3 h-3 mr-1" />
                      Join Call
                    </Button>
                  )}
                </div>
              </Card>
            ))}

            {filteredPatients.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No patients found matching your search.</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPatients.length} of {samplePatients.length} patients
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

export default PatientListModal;
