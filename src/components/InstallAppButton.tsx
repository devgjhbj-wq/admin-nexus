import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function InstallAppButton() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  if (isInstalled || !isInstallable) return null;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={installApp}
      className="gap-2 text-xs"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}
