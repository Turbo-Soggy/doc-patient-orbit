import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Brain, FileText, Video, Users, Clock, Bell } from "lucide-react";
import MedicalHistoryModal from "@/components/modals/MedicalHistoryModal";
import TelehealthModal from "@/components/modals/TelehealthModal";
import AIAssistantModal from "@/components/modals/AIAssistantModal";
import ScheduleAppointmentModal from "@/components/modals/ScheduleAppointmentModal";
import PatientListModal from "@/components/modals/PatientListModal";
import PendingRequestsModal from "@/components/modals/PendingRequestsModal";
import { useToast } from "@/hooks/use-toast";

const Doctor = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [telehealthOpen, setTelehealthOpen] = useState(false);
  const [telehealthPatient, setTelehealthPatient] = useState({ name: "", time: "" });
  const [aiAction, setAiAction] = useState<"summarize" | "recommend">("summarize");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [patientListOpen, setPatientListOpen] = useState(false);
  const [pendingRequestsOpen, setPendingRequestsOpen] = useState(false);
  const { toast } = useToast();

  const handleViewHistory = (patientName: string) => {
    setSelectedPatient(patientName);
    setHistoryOpen(true);
  };

  const handleJoinCall = (patientName: string, time: string) => {
    setTelehealthPatient({ name: patientName, time });
    setTelehealthOpen(true);
  };

  const handleStartConsultation = (patientName: string) => {
    toast({
      title: "Starting Consultation",
      description: `Opening consultation room for ${patientName}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Dr. Sarah Johnson, MD</p>
          </div>
          <Button variant="outline">Sign Out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-primary/30">
            <Users className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">Patients Today</p>
          </Card>
          
          <Card className="p-6 border-secondary/30">
            <Calendar className="w-8 h-8 text-secondary mb-2" />
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">Appointments</p>
          </Card>
          
          <Card className="p-6 border-accent/30">
            <Video className="w-8 h-8 text-accent mb-2" />
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Telehealth</p>
          </Card>
          
          <Card 
            className="p-6 border-accent/30 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setPendingRequestsOpen(true)}
          >
            <Bell className="w-8 h-8 text-accent mb-2" />
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Today's Schedule
                </h2>
                <Button variant="outline" size="sm">Sync Calendar</Button>
              </div>
              <div className="space-y-3">
                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">John Smith - General Checkup</h3>
                      <p className="text-sm text-muted-foreground">New Patient</p>
                    </div>
                    <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">9:00 AM</span>
                  </div>
                  <Button size="sm" className="mt-2" onClick={() => handleStartConsultation("John Smith")}>
                    Start Consultation
                  </Button>
                </div>
                
                <div className="p-4 border-l-4 border-secondary bg-secondary/5 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Emily Davis - Follow-up</h3>
                      <p className="text-sm text-muted-foreground">Cardiology</p>
                    </div>
                    <span className="text-sm bg-secondary/20 text-secondary px-3 py-1 rounded-full">10:30 AM</span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => handleViewHistory("Emily Davis")}>
                    View History
                  </Button>
                </div>

                <div className="p-4 border-l-4 border-accent bg-accent/5 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Michael Brown - Telehealth</h3>
                      <p className="text-sm text-muted-foreground">Consultation</p>
                    </div>
                    <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full">2:00 PM</span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => handleJoinCall("Michael Brown", "2:00 PM")}>
                    Join Video Call
                  </Button>
                </div>
              </div>
            </Card>

            {/* AI Assistant */}
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" />
                AI Medical Assistant
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg">
                  <h3 className="font-semibold mb-2">Patient Summary for John Smith</h3>
                  <p className="text-sm text-muted-foreground">
                    45-year-old male with history of hypertension. Last visit 6 months ago. 
                    Current medications: Lisinopril 10mg. Recent labs show controlled BP.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setAiAction("summarize");
                      setAiModalOpen(true);
                    }}
                  >
                    Generate Notes
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setAiAction("recommend");
                      setAiModalOpen(true);
                    }}
                  >
                    Procedure Recommendations
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setScheduleOpen(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setAiAction("summarize");
                    setAiModalOpen(true);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Note
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setPatientListOpen(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Patient List
                </Button>
              </div>
            </Card>

            {/* Pending Tasks */}
            <Card className="p-6">
              <h2 className="font-bold mb-4">Pending Tasks</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <span>Review lab results for 3 patients</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5" />
                  <span>Complete 5 patient notes</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
                  <span>Approve 2 prescription refills</span>
                </div>
              </div>
            </Card>

            {/* Calendar Sync Status */}
            <Card className="p-6 bg-secondary/5 border-secondary/20">
              <h2 className="font-bold mb-2">Google Calendar</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Last synced: 5 minutes ago
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ 
                  title: "Syncing Calendar", 
                  description: "Google Calendar sync in progress..." 
                })}
              >
                Sync Now
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <MedicalHistoryModal 
        open={historyOpen} 
        onOpenChange={setHistoryOpen}
        patientName={selectedPatient}
      />
      <TelehealthModal 
        open={telehealthOpen} 
        onOpenChange={setTelehealthOpen}
        patientName={telehealthPatient.name}
        appointmentTime={telehealthPatient.time}
      />
      <AIAssistantModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        patientName="John Smith"
        action={aiAction}
      />
      <ScheduleAppointmentModal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
      />
      <PatientListModal
        open={patientListOpen}
        onOpenChange={setPatientListOpen}
        onViewHistory={(patientName) => {
          setSelectedPatient(patientName);
          setHistoryOpen(true);
        }}
      />
      <PendingRequestsModal
        open={pendingRequestsOpen}
        onOpenChange={setPendingRequestsOpen}
      />
    </div>
  );
};

export default Doctor;
