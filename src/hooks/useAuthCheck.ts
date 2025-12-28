import { useEffect } from "react";
import { clearAuthToken } from "@/lib/api";

// Centralized auth check that can be used across the app
export function useAuthCheck() {
  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      clearAuthToken();
      window.location.href = "/login";
    };

    window.addEventListener("auth:unauthorized" as any, handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized" as any, handleUnauthorized);
    };
  }, []);
}

// Helper to trigger unauthorized event
export function triggerUnauthorized() {
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}
