import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function InstallAppButton() {
  const { isInstallable, isInstalled, installApp, deferredPrompt } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);
    
    // Check if already in standalone mode
    const standalone = window.matchMedia("(display-mode: standalone)").matches 
      || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
  }, []);

  // Hide if already installed as standalone
  if (isStandalone || isInstalled) return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      await installApp();
    } else {
      // Show manual instructions
      setShowInstructions(true);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={handleClick}
        className="gap-2 text-xs border-primary/50 text-primary hover:bg-primary/10"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Install App</span>
      </Button>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Install App
            </DialogTitle>
            <DialogDescription>
              Install this app on your device for quick access
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isIOS ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">To install on iOS:</p>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li className="flex items-center gap-2">
                    Tap the <Share className="h-4 w-4 inline" /> Share button
                  </li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">To install on Android:</p>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Tap the menu (⋮) in your browser</li>
                  <li>Select "Install app" or "Add to Home screen"</li>
                  <li>Tap "Install" to confirm</li>
                </ol>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
