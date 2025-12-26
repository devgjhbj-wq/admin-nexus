import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setAuthToken } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast.error("Please enter your admin token");
      return;
    }

    setIsLoading(true);
    
    // Simulate a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setAuthToken(token.trim());
    toast.success("Authentication successful");
    navigate("/");
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Terminal className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-foreground">RBSlot Admin</h1>
          <p className="mt-2 text-muted-foreground">Enter your admin token to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Admin Token
            </label>
            <Input
              id="token"
              type="password"
              placeholder="Enter your admin token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Access Dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground">
          Protected endpoint • Authorized personnel only
        </p>
      </div>
    </div>
  );
}
