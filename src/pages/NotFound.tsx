import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // Auto-redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-4 text-xl text-foreground">Page not found</p>
        <p className="mb-6 text-muted-foreground">Redirecting to home in 3 seconds...</p>
        <button 
          onClick={() => navigate("/")} 
          className="text-primary underline hover:text-primary/80"
        >
          Go to Home Now
        </button>
      </div>
    </div>
  );
};

export default NotFound;
