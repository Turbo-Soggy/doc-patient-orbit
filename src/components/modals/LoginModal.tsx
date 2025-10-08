import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth, Role } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
}

const LoginModal = ({ open, onOpenChange, role }: LoginModalProps) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    login(role);
    onOpenChange(false);
    navigate(`/${role}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in as {role}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <GoogleLogin onSuccess={handleLoginSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;