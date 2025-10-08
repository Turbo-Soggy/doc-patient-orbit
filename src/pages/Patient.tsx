import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Calendar, FileText, Video, Clock, Activity } from "lucide-react";
import SymptomCheckModal from "@/components/modals/SymptomCheckModal";
import BookAppointmentModal from "@/components/modals/BookAppointmentModal";
import MedicalHistoryModal from "@/components/modals/MedicalHistoryModal";
import TelehealthModal from "@/components/modals/TelehealthModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  status: string;
  doctor: {
    id: string;
    profiles: {
      full_name: string | null;
    } | null;
  } | null;
}

const Patient = () => {
  const [symptomCheckOpen, setSymptomCheckOpen] = useState(false);
  const [bookAppointmentOpen, setBookAppointmentOpen] = useState(false);
  const [medicalHistoryOpen, setMedicalHistoryOpen] = useState(false);
  const [telehealthOpen, setTelehealthOpen] = useState(false);
  const [preSelectedDoctor, setPreSelectedDoctor] = useState<{ id: string; name: string } | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctor_id (
            id,
            profiles (full_name)
          )
        `)
        .eq('patient_id', user.id)
        .eq('status', 'approved')
        .gte('appointment_date', format(new Date(), 'yyyy-MM-dd'))
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setUpcomingAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBookFromSymptomCheck = (doctorId: string, doctorName: string) => {
    setPreSelectedDoctor({ id: doctorId, name: doctorName });
    setBookAppointmentOpen(true);
    toast({
      title: "Ready to Book",
      description: `Opening appointment booking with ${doctorName}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Patient Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Patient</p>
          </div>
          <Button variant="outline">Sign Out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card 
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-primary/30"
            onClick={() => setSymptomCheckOpen(true)}
          >
            <Brain className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">AI Symptom Check</h3>
            <p className="text-sm text-muted-foreground">Analyze symptoms</p>
          </Card>
          
          <Card 
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-secondary/30"
            onClick={() => setBookAppointmentOpen(true)}
          >
            <Calendar className="w-8 h-8 text-secondary mb-3" />
            <h3 className="font-semibold mb-1">Book Appointment</h3>
            <p className="text-sm text-muted-foreground">Schedule visit</p>
          </Card>
          
          <Card 
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-accent/30"
            onClick={() => setMedicalHistoryOpen(true)}
          >
            <FileText className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Medical History</h3>
            <p className="text-sm text-muted-foreground">View records</p>
          </Card>
          
          <Card 
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-primary/30"
            onClick={() => setTelehealthOpen(true)}
          >
            <Video className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Telehealth</h3>
            <p className="text-sm text-muted-foreground">Start consultation</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Upcoming Appointments
              </h2>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Loading appointments...</p>
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.appointment_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    let dateLabel = format(appointmentDate, 'MMM dd');
                    if (appointmentDate.toDateString() === today.toDateString()) {
                      dateLabel = 'Today';
                    } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
                      dateLabel = 'Tomorrow';
                    }

                    const timeFormatted = format(new Date(`2000-01-01 ${appointment.appointment_time}`), 'h:mm a');
                    const doctorName = appointment.doctor?.profiles?.full_name || 'Unknown Doctor';

                    return (
                      <div key={appointment.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{doctorName}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          </div>
                          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">{dateLabel}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(appointmentDate, 'MMM dd, yyyy')} at {timeFormatted}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming appointments.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setBookAppointmentOpen(true)}
                  >
                    Book Appointment
                  </Button>
                </div>
              )}
            </Card>

            {/* AI Recommendations */}
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" />
                AI Health Recommendations
              </h2>
              <div className="space-y-3">
                <p className="text-sm">Based on your recent activity and health data:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                    <span>Consider scheduling your annual physical checkup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                    <span>Your vaccination records may need updating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                    <span>Cardiology follow-up recommended in 3 months</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Health Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Blood Pressure</span>
                    <span className="font-semibold text-secondary">120/80</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Normal range</div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Heart Rate</span>
                    <span className="font-semibold text-secondary">72 bpm</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Healthy</div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Last Visit</span>
                    <span className="font-semibold">Nov 28, 2024</span>
                  </div>
                  <div className="text-xs text-muted-foreground">2 weeks ago</div>
                </div>
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-6">
              <h2 className="font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({ title: "Request Sent", description: "Your prescription refill request has been submitted." })}
                >
                  Request Prescription Refill
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({ title: "Messaging", description: "Opening secure messaging with your doctor." })}
                >
                  Message Your Doctor
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setMedicalHistoryOpen(true)}
                >
                  Download Records
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <SymptomCheckModal 
        open={symptomCheckOpen} 
        onOpenChange={setSymptomCheckOpen}
        onBookAppointment={handleBookFromSymptomCheck}
      />
      <BookAppointmentModal 
        open={bookAppointmentOpen} 
        onOpenChange={setBookAppointmentOpen}
        preSelectedDoctor={preSelectedDoctor?.id}
        preSelectedDoctorName={preSelectedDoctor?.name}
      />
      <MedicalHistoryModal open={medicalHistoryOpen} onOpenChange={setMedicalHistoryOpen} />
      <TelehealthModal open={telehealthOpen} onOpenChange={setTelehealthOpen} />
    </div>
  );
};

export default Patient;
