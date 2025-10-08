import { useAuth, Role } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: Role;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { role } = useAuth();

  if (role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;