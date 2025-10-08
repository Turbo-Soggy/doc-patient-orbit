import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Stethoscope, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    icon: UserCircle,
    title: "Patient Portal",
    description: "Access AI symptom analysis, book appointments, and manage your medical history.",
    features: ["AI Symptom Checker", "Book Appointments", "Medical History", "Telehealth"],
    color: "primary",
    path: "/patient",
  },
  {
    icon: Stethoscope,
    title: "Doctor Dashboard",
    description: "Manage appointments, access AI-powered tools, and sync with Google Calendar.",
    features: ["Smart Scheduling", "AI Note Summary", "Procedure Recommendations", "Calendar Sync"],
    color: "secondary",
    path: "/doctor",
  },
  {
    icon: Settings,
    title: "Admin Console",
    description: "Oversee system operations, manage users, and access comprehensive analytics.",
    features: ["User Management", "Resource Allocation", "Analytics", "System Config"],
    color: "accent",
    path: "/admin",
  },
];

const RoleSelector = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
          <p className="text-xl text-muted-foreground">
            Tailored experiences for every user type in healthcare management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const colorClasses = {
              primary: "text-primary bg-primary/10 border-primary/30",
              secondary: "text-secondary bg-secondary/10 border-secondary/30",
              accent: "text-accent bg-accent/10 border-accent/30",
            };
            
            return (
              <Card 
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 group border-2 hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colorClasses[role.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
                <p className="text-muted-foreground mb-6">{role.description}</p>

                <ul className="space-y-2 mb-8">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${role.color === 'primary' ? 'bg-primary' : role.color === 'secondary' ? 'bg-secondary' : 'bg-accent'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full group-hover:gap-3 transition-all">
                  <Link to={role.path}>
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleSelector;
