import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Users, BarChart3, Database, Shield, Activity } from "lucide-react";
import EditUserModal from "@/components/modals/EditUserModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setEditUserOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Console</h1>
            <p className="text-sm text-muted-foreground">System Administrator</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* System Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-primary/30">
            <Users className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <div className="text-xs text-secondary mt-1">+12% this month</div>
          </Card>
          
          <Card className="p-6 border-secondary/30">
            <Activity className="w-8 h-8 text-secondary mb-2" />
            <div className="text-2xl font-bold">342</div>
            <p className="text-sm text-muted-foreground">Active Today</p>
            <div className="text-xs text-secondary mt-1">89% uptime</div>
          </Card>
          
          <Card className="p-6 border-accent/30">
            <BarChart3 className="w-8 h-8 text-accent mb-2" />
            <div className="text-2xl font-bold">4.2K</div>
            <p className="text-sm text-muted-foreground">Appointments</p>
            <div className="text-xs text-secondary mt-1">+8% weekly</div>
          </Card>
          
          <Card className="p-6 border-primary/30">
            <Shield className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold">100%</div>
            <p className="text-sm text-muted-foreground">Compliance</p>
            <div className="text-xs text-secondary mt-1">All checks passed</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Management */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User Management
                </h2>
                <Button size="sm" onClick={handleAddUser}>Add New User</Button>
              </div>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Doctor • Cardiology</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">Active</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditUser({ name: "Dr. Sarah Johnson", role: "Doctor", specialty: "Cardiology", status: "Active" })}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">John Smith</h3>
                      <p className="text-sm text-muted-foreground">Patient • ID: #12847</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">Active</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditUser({ name: "John Smith", role: "Patient", status: "Active" })}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Emily Davis</h3>
                      <p className="text-sm text-muted-foreground">Admin • System Manager</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">Active</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditUser({ name: "Emily Davis", role: "Admin", status: "Active" })}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* System Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Recent System Activity
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium">New user registered</p>
                    <p className="text-muted-foreground">Michael Chen • Patient</p>
                    <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium">Appointment scheduled</p>
                    <p className="text-muted-foreground">Dr. Johnson • 24 appointments today</p>
                    <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium">System backup completed</p>
                    <p className="text-muted-foreground">All data backed up successfully</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Settings */}
            <Card className="p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Settings
              </h2>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({ title: "Database Management", description: "Opening database configuration panel" })}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Database Management
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({ title: "Security Settings", description: "Opening security configuration" })}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({ title: "Analytics", description: "Loading analytics dashboard" })}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Button>
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6 bg-secondary/5 border-secondary/20">
              <h2 className="font-bold mb-4">System Health</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Server Status</span>
                    <span className="font-semibold text-secondary">Healthy</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-secondary rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Database</span>
                    <span className="font-semibold text-secondary">Optimal</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[88%] bg-secondary rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>API Response</span>
                    <span className="font-semibold text-secondary">Fast</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-secondary rounded-full" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h2 className="font-bold mb-4">System Alerts</h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                  <p className="font-medium text-primary">Security Update Available</p>
                  <p className="text-xs text-muted-foreground mt-1">Install recommended</p>
                </div>
                <div className="p-3 bg-accent/5 border border-accent/20 rounded">
                  <p className="font-medium text-accent">Backup Scheduled</p>
                  <p className="text-xs text-muted-foreground mt-1">Next: Tonight 2:00 AM</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <EditUserModal
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        user={selectedUser}
      />
    </div>
  );
};

export default Admin;
