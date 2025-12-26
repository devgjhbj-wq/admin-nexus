import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, ArrowRight, Loader2, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminLogin, setAuthData } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  mobileNumber: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(/^[0-9]+$/, "Mobile number must contain only digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ mobileNumber?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate inputs
    const result = loginSchema.safeParse({ mobileNumber, password });
    if (!result.success) {
      const fieldErrors: { mobileNumber?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "mobileNumber") {
          fieldErrors.mobileNumber = err.message;
        }
        if (err.path[0] === "password") {
          fieldErrors.password = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await adminLogin(mobileNumber.trim(), password);
      setAuthData(response.token, response.user);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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
          <p className="mt-2 text-muted-foreground">Sign in to access the dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="mobile" className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="h-12 pl-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                autoComplete="tel"
              />
            </div>
            {errors.mobileNumber && (
              <p className="text-[10px] text-destructive">{errors.mobileNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-destructive">{errors.password}</p>
            )}
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
