import { Navigate } from "react-router-dom";
import { getAuthToken } from "@/lib/api";

const Index = () => {
  const token = getAuthToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

export default Index;
