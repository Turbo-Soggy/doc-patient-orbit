import { Card } from "@/components/ui/card";
import { Brain, Calendar, ShieldCheck, Zap, Video, Bell } from "lucide-react";
import aiMedical from "@/assets/ai-medical.png";
import smartScheduling from "@/assets/smart-scheduling.png";
import googleIntegration from "@/assets/google-integration.png";

const features = [
  {
    icon: Brain,
    title: "AI Symptom Analysis",
    description: "Advanced AI algorithms analyze symptoms and recommend specialists with precision.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    image: aiMedical,
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Intelligent appointment booking with automatic conflict prevention and optimization.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    image: smartScheduling,
  },
  {
    icon: Zap,
    title: "Google Integration",
    description: "Seamless sync with Google Calendar, Drive, and Meet for unified workflow.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    image: googleIntegration,
  },
  {
    icon: ShieldCheck,
    title: "Multi-Role Access",
    description: "Role-based dashboards for patients, doctors, and admins with secure controls.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Video,
    title: "Telehealth Ready",
    description: "Built-in video consultation support for remote patient care.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    description: "Live notifications and status tracking for all appointments and updates.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need for
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Modern Healthcare
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to streamline healthcare operations and improve patient outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-8 hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 group"
              >
                {feature.image && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
