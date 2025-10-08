import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-healthcare.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/5" />
      
      {/* Hero image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Healthcare professional" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Healthcare Management</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Smart Healthcare
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Scheduling & Management
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl">
              Revolutionary AI-powered platform that streamlines appointments, enhances patient care, 
              and integrates seamlessly with Google Workspace.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div>
                <div className="text-3xl font-bold text-primary">AI</div>
                <div className="text-sm text-muted-foreground">Powered Intelligence</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">Secure & Private</div>
              </div>
            </div>
          </div>

          {/* Visual element */}
          <div className="relative lg:block hidden">
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl opacity-20 blur-3xl" />
              <img 
                src={heroImage}
                alt="Healthcare management"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
