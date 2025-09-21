import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/AuthHooks.tsx";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading || isAuthenticated === null) {
    return null;
  }
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
