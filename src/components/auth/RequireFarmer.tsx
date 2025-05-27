
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RequireFarmerProps {
  children: ReactNode;
}

const RequireFarmer = ({ children }: RequireFarmerProps) => {
  const { isFarmer } = useAuth();
  const { toast } = useToast();

  if (!isFarmer()) {
    toast({
      title: "Access Denied",
      description: "Only farmers can access this page",
      variant: "destructive",
    });
    return <Navigate to="/marketplace" replace />;
  }

  return <>{children}</>;
};

export default RequireFarmer;
